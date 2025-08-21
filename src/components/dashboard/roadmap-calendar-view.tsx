
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
        <div className="flex flex-col gap-6 mt-4">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[200px] w-full" />
        </div>
    );
  }

  return (
    <Card className="mt-4">
        <CardContent className="p-4">
            <div className="flex flex-col gap-6">
                <div>
                     <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border p-0 [&_td]:w-full [&_tr]:w-full"
                         classNames={{
                          table: "w-full border-collapse space-y-1",
                          head_cell:
                            "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "w-full h-16 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-16 w-full p-1 font-normal aria-selected:opacity-100",
                        }}
                        modifiers={{
                           events: taskEventDays,
                        }}
                        modifiersClassNames={{
                           events: "bg-primary/20 text-primary-foreground rounded-full",
                        }}
                      />
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Tasks for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No date selected"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 min-h-48">
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
