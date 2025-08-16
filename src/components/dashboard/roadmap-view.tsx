"use client";

import { useState } from "react";
import type { RoadmapTask } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Link as LinkIcon } from "lucide-react";

const initialTasks: RoadmapTask[] = [
  { id: '1', title: 'Research 5 AI Summer Programs', description: 'Find and compare at least five summer programs focused on AI for high school students.', category: 'Extracurriculars', dueDate: '2024-09-01', completed: true },
  { id: '2', title: 'Complete Khan Academy Calculus Course', description: 'Finish all modules and practice tests for the AP Calculus AB course.', category: 'Academics', dueDate: '2024-10-15', completed: false, relatedResources: [{title: 'Khan Academy Calculus', url: '#'}] },
  { id: '3', title: 'Build a Personal Portfolio Website', description: 'Showcase your robotics and programming projects on a personal website.', category: 'Skill Building', dueDate: '2024-11-01', completed: false },
  { id: '4', title: 'Enter the USACO Programming Competition', description: 'Prepare for and participate in the December USACO contest.', category: 'Competitions & Events', dueDate: '2024-12-10', completed: false },
  { id: '5', title: 'Draft College Application Essay on AI Ethics', description: 'Write a compelling essay about the ethical implications of artificial intelligence.', category: 'Academics', dueDate: '2025-01-05', completed: false },
];

const categories: RoadmapTask['category'][] = ['Academics', 'Extracurriculars', 'Competitions & Events', 'Skill Building'];

export function RoadmapView() {
  const [tasks, setTasks] = useState<RoadmapTask[]>(initialTasks);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
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

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
        <TabsTrigger value="all">All</TabsTrigger>
        {categories.map(cat => <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>)}
      </TabsList>
      <TabsContent value="all">
        <div className="space-y-4 mt-4">
            {tasks.map(task => <TaskCard key={task.id} task={task} onToggle={toggleTask} getCategoryColor={getCategoryColor} />)}
        </div>
      </TabsContent>
      {categories.map(cat => (
        <TabsContent key={cat} value={cat}>
           <div className="space-y-4 mt-4">
            {tasks.filter(t => t.category === cat).map(task => <TaskCard key={task.id} task={task} onToggle={toggleTask} getCategoryColor={getCategoryColor}/>)}
           </div>
        </TabsContent>
      ))}
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
                    Due: {new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
