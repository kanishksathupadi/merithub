
"use client";

import { useState, useEffect } from "react";
import type { RoadmapTask } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Link as LinkIcon, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { addNotification } from "@/lib/tracking";

const categories: RoadmapTask['category'][] = ['Academics', 'Extracurriculars', 'Skill Building'];

const updateMasterUserList = (email: string, updatedTasks: RoadmapTask[]) => {
  if (typeof window === 'undefined') return;
  try {
    const allUsersStr = localStorage.getItem('allSignups');
    if (allUsersStr) {
      let allUsers = JSON.parse(allUsersStr);
      allUsers = allUsers.map((user: any) => {
        if (user.email === email) {
          return { ...user, tasks: updatedTasks };
        }
        return user;
      });
      localStorage.setItem('allSignups', JSON.stringify(allUsers));
    }
  } catch(e) {
    console.error("Failed to update master user list:", e);
  }
};

export function RoadmapView() {
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
        const signupDataStr = localStorage.getItem('signupData');
        if (signupDataStr) {
          const signupData = JSON.parse(signupDataStr);
          const email = signupData.email;
          setUserEmail(email);

            let storedTasks = localStorage.getItem(`roadmapTasks-${email}`);
            if (storedTasks) {
            let parsedTasks: RoadmapTask[] = JSON.parse(storedTasks);
            parsedTasks = parsedTasks.map((task, index) => ({
                ...task,
                points: task.points || Math.floor(Math.random() * 20) + 10,
                dueDate: task.dueDate || new Date(Date.now() + index * 3 * 24 * 60 * 60 * 1000).toISOString(),
            }));
            setTasks(parsedTasks);
            }
        }
    } catch(error) {
        console.error("Failed to parse roadmap tasks from localStorage", error);
        if (userEmail) {
            localStorage.removeItem(`roadmapTasks-${userEmail}`);
        }
    } finally {
        setLoading(false);
    }
  }, [userEmail]);

  const toggleTask = (taskId: string) => {
    if (!userEmail) return;

    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        const wasCompleted = task.completed;
        const isNowCompleted = !wasCompleted;
        if (isNowCompleted) {
          addNotification({
            title: "Task Completed!",
            description: `You earned ${task.points || 10} points for "${task.title}".`
          });
        }
        return { ...task, completed: isNowCompleted };
      }
      return task;
    });

    setTasks(newTasks);
    localStorage.setItem(`roadmapTasks-${userEmail}`, JSON.stringify(newTasks));
    updateMasterUserList(userEmail, newTasks);
    window.dispatchEvent(new StorageEvent('storage', {key: 'roadmapTasks'}));
  };

  const getCategoryColor = (category: RoadmapTask['category']) => {
    switch(category) {
        case 'Academics': return 'bg-blue-500';
        case 'Extracurriculars': return 'bg-green-500';
        case 'Skill Building': return 'bg-yellow-500';
        default: return 'bg-gray-500';
    }
  }

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    );
  }

  const filteredTasks = activeTab === 'all' ? tasks : tasks.filter(t => t.category === activeTab);

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="all">All</TabsTrigger>
        {categories.map(cat => <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>)}
      </TabsList>

      <div className="space-y-4 mt-4">
        {filteredTasks.length > 0 ? (
            filteredTasks.map(task => <TaskCard key={task.id} task={task} onToggle={toggleTask} getCategoryColor={getCategoryColor} />)
        ) : (
            <Card className="mt-4">
                <CardContent className="p-6 text-center text-muted-foreground">
                    No tasks in this category yet.
                </CardContent>
            </Card>
        )}
      </div>
    </Tabs>
  );
}

function TaskCard({ task, onToggle, getCategoryColor }: { task: RoadmapTask, onToggle: (id: string) => void, getCategoryColor: (cat: RoadmapTask['category']) => string }) {
    return (
        <Card className={`transition-all ${task.completed ? 'bg-muted/70 opacity-60' : 'bg-card'}`}>
            <CardHeader>
                <div className="flex items-start gap-4">
                    <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => onToggle(task.id)} className="mt-1" />
                    <div className="grid gap-1.5 flex-1">
                        <CardTitle className={`text-xl ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                        </CardTitle>
                        <CardDescription>{task.description}</CardDescription>
                    </div>
                     <div className="hidden sm:flex flex-col items-end gap-2">
                        <Badge variant="outline" className="whitespace-nowrap">
                            <span className={`w-2 h-2 mr-2 rounded-full ${getCategoryColor(task.category)}`}></span>
                            {task.category}
                        </Badge>
                        {task.points && (
                            <Badge variant="secondary" className="bg-yellow-400/10 text-yellow-300">
                                <Star className="w-3 h-3 mr-1" /> {task.points} pts
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="text-sm text-muted-foreground flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4"/>
                        <span>For {task.grade}</span>
                    </div>
                    {task.dueDate && (
                        <div className="flex items-center gap-2">
                            <span className="font-bold">Due:</span>
                            <span>{format(parseISO(task.dueDate), "MMMM d, yyyy")}</span>
                        </div>
                    )}
                 </div>
            </CardContent>
            {task.relatedResources && task.relatedResources.length > 0 && (
                <CardFooter>
                     <div className="flex gap-2">
                        {task.relatedResources?.map(resource => (
                            <Button key={resource.title} variant="outline" size="sm" asChild>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    <LinkIcon className="w-4 h-4 mr-2" />
                                    {resource.title}
                                </a>
                            </Button>
                        ))}
                     </div>
                </CardFooter>
            )}
        </Card>
    )
}
