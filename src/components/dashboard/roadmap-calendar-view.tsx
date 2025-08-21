
"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { RoadmapTask } from "@/lib/types";
import { format, parseISO, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function RoadmapCalendarView() {
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    try {
      let storedTasks = localStorage.getItem('roadmapTasks');
      if (storedTasks) {
        let parsedTasks: RoadmapTask[] = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error("Failed to parse roadmap tasks from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getCategoryColor = (category: RoadmapTask['category']) => {
    switch(category) {
        case 'Academics': return 'bg-blue-500';
        case 'Extracurriculars': return 'bg-green-500';
        case 'Skill Building': return 'bg-yellow-500';
        default: return 'bg-gray-500';
    }
  }

  const tasksForSelectedDay = selectedDate
    ? tasks.filter(task => task.dueDate && isSameDay(parseISO(task.dueDate), selectedDate))
    : [];

  const taskEventDays = tasks
    .filter(task => task.dueDate)
    .map(task => parseISO(task.dueDate));
    
  if (loading) {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2"><Skeleton className="h-[400px] w-full" /></div>
            <div><Skeleton className="h-[400px] w-full" /></div>
        </div>
    );
  }

  return (
    <Card className="mt-4">
        <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                        modifiers={{
                           events: taskEventDays,
                        }}
                        modifiersClassNames={{
                           events: "bg-primary/20 text-primary-foreground rounded-full",
                        }}
                      />
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No date selected"}
                            </CardTitle>
                            <CardDescription>Tasks for this day</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 h-80 overflow-y-auto">
                            {tasksForSelectedDay.length > 0 ? (
                                tasksForSelectedDay.map(task => (
                                    <div key={task.id} className="p-3 rounded-lg bg-muted">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-sm">{task.title}</p>
                                            <Badge variant="outline" className="text-xs whitespace-nowrap">
                                                <span className={`w-2 h-2 mr-1.5 rounded-full ${getCategoryColor(task.category)}`}></span>
                                                {task.category}
                                            </Badge>
                                        </div>
                                        {task.completed && <p className="text-xs text-green-500">Completed</p>}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center pt-8">No tasks scheduled for this day.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
