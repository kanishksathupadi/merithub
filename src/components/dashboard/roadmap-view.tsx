
"use client";

import { useState, useEffect, useMemo } from "react";
import type { RoadmapTask } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Link as LinkIcon, Star, BrainCircuit, Trophy, Repeat } from "lucide-react";
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

const getCategoryIcon = (category: RoadmapTask['category']) => {
    switch (category) {
        case 'Academics': return <BrainCircuit className="w-5 h-5 text-blue-400" />;
        case 'Extracurriculars': return <Trophy className="w-5 h-5 text-green-400" />;
        case 'Skill Building': return <Star className="w-5 h-5 text-yellow-400" />;
        default: return null;
    }
}

function TaskCard({ task, onToggle }: { task: RoadmapTask, onToggle: (id: string) => void }) {
    return (
        <div className={`p-4 rounded-lg transition-all flex items-start gap-4 ${task.completed ? 'bg-muted/50 opacity-70' : 'bg-background/50'}`}>
             <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => onToggle(task.id)} className="mt-1" />
            <div className="flex-1 space-y-1">
                <p className={`font-semibold ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-2">
                    {task.points && (
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400"/> {task.points} pts</span>
                    )}
                    {task.dueDate && (
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> Due {format(parseISO(task.dueDate), "MMM d, yyyy")}</span>
                    )}
                     {task.recurringDays && task.recurringDays.length > 0 && (
                        <span className="flex items-center gap-1"><Repeat className="w-3 h-3"/> {task.recurringDays.map(d => d.slice(0,1).toUpperCase() + d.slice(1,3)).join(', ')}</span>
                    )}
                </div>
                 {task.relatedResources && task.relatedResources.length > 0 && (
                     <div className="pt-2">
                        {task.relatedResources?.map(resource => (
                            <Button key={resource.url} variant="link" size="sm" asChild className="p-0 h-auto">
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    <LinkIcon className="w-3 h-3 mr-1" />
                                    {resource.title}
                                </a>
                            </Button>
                        ))}
                     </div>
                )}
            </div>
            {!task.completed && (
                <Badge variant="outline" className="h-fit">{task.category}</Badge>
            )}
        </div>
    )
}

export function RoadmapView() {
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [loading, setLoading] = useState(true);
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
                dueDate: task.dueDate, // Keep dueDate as is or undefined
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
  
  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
        const grade = task.grade || "Uncategorized";
        if (!acc[grade]) {
            acc[grade] = {};
        }
        if (!acc[grade][task.category]) {
            acc[grade][task.category] = [];
        }
        acc[grade][task.category].push(task);
        return acc;
    }, {} as Record<string, Record<RoadmapTask['category'], RoadmapTask[]>>);
  }, [tasks]);

  const gradeOrder = useMemo(() => {
    const numericGrades = Object.keys(groupedTasks)
        .filter(g => g.match(/^\d/))
        .sort((a,b) => parseInt(a) - parseInt(b));
    const customGrades = Object.keys(groupedTasks).filter(g => g.toLowerCase() === "custom");
    const otherGrades = Object.keys(groupedTasks).filter(g => !g.match(/^\d/) && g.toLowerCase() !== "custom");

    return [...numericGrades, ...otherGrades, ...customGrades];
  }, [groupedTasks]);


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


  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    );
  }
  
  if (tasks.length === 0) {
      return (
        <Card className="mt-4">
            <CardContent className="p-6 text-center text-muted-foreground">
                Your roadmap is currently empty. Go to the dashboard to generate your AI plan or add a custom task.
            </CardContent>
        </Card>
      )
  }

  return (
    <div className="w-full space-y-4">
        <Accordion type="single" collapsible defaultValue={`${gradeOrder[0]}`} className="w-full space-y-4">
           {gradeOrder.map(grade => (
               <AccordionItem value={grade} key={grade} className="border-b-0">
                    <Card>
                        <AccordionTrigger className="p-6 hover:no-underline">
                             <h2 className="text-2xl font-bold">{grade}</h2>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <div className="space-y-6">
                                {Object.keys(groupedTasks[grade]).map(category => {
                                    const categoryTasks = groupedTasks[grade][category as keyof typeof groupedTasks[typeof grade]]
                                    if (categoryTasks.length === 0) return null;
                                    return (
                                        <div key={category}>
                                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                                {getCategoryIcon(category as RoadmapTask['category'])}
                                                {category}
                                            </h3>
                                            <div className="space-y-3">
                                                {categoryTasks.map(task => (
                                                     <TaskCard key={task.id} task={task} onToggle={toggleTask} />
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </AccordionContent>
                    </Card>
               </AccordionItem>
           ))}
        </Accordion>
    </div>
  );
}
