
"use client";

import { useState, useEffect } from "react";
import type { RoadmapTask } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Link as LinkIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const categories: RoadmapTask['category'][] = ['Academics', 'Extracurriculars', 'Skill Building', 'Competitions & Events'];

export function RoadmapView() {
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const storedTasks = localStorage.getItem('roadmapTasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    setLoading(false);
  }, []);

  const toggleTask = (taskId: string) => {
    const newTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    localStorage.setItem('roadmapTasks', JSON.stringify(newTasks));
    // Manually dispatch a storage event to notify other components like the progress page.
    window.dispatchEvent(new Event('storage'));
  };

  const getCategoryColor = (category: RoadmapTask['category']) => {
    switch(category) {
        case 'Academics': return 'bg-blue-500';
        case 'Extracurriculars': return 'bg-green-500';
        case 'Competitions & Events': return 'bg-purple-500';
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
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
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
                    <Badge variant="outline" className="hidden sm:inline-flex">
                        <span className={`w-2 h-2 mr-2 rounded-full ${getCategoryColor(task.category)}`}></span>
                        {task.category}
                    </Badge>
                </div>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
                 <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4"/>
                     Due: In {task.grade}
                 </div>
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
        </Card>
    )
}
