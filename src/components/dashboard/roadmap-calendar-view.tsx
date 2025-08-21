
"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RoadmapTask } from "@/lib/types";
import { format, parseISO, isSameDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
        case 'Academics': return 'bg-blue-500 border-blue-500/50';
        case 'Extracurriculars': return 'bg-green-500 border-green-500/50';
        case 'Skill Building': return 'bg-yellow-500 border-yellow-500/50';
        default: return 'bg-gray-500 border-gray-500/50';
    }
  }

  const tasksByDay = (date: Date) => {
    return tasks.filter(task => task.dueDate && isSameDay(parseISO(task.dueDate), date));
  }
  
  const tasksForSelectedDay = selectedDate ? tasksByDay(selectedDate) : [];

  if (loading) {
    return (
        <div className="flex flex-col gap-6 mt-4">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[200px] w-full" />
        </div>
    );
  }

  return (
    <div className="mt-4">
        <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border p-0 w-full"
            classNames={{
                table: "w-full border-collapse space-y-1",
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "w-full text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-32 w-full p-1 font-normal aria-selected:opacity-100 flex flex-col items-start justify-start",
                day_selected: "bg-accent text-accent-foreground",
                day_today: "bg-muted text-foreground",
            }}
            components={{
                DayContent: ({ date }) => {
                    const dailyTasks = tasksByDay(date);
                    const dayNumber = format(date, "d");
                    return (
                        <>
                            <time dateTime={format(date, "yyyy-MM-dd")} className="p-1">{dayNumber}</time>
                            {dailyTasks.length > 0 && (
                                <div className="flex-1 w-full overflow-y-auto p-1 space-y-1">
                                    {dailyTasks.map(task => (
                                        <div 
                                            key={task.id} 
                                            className={cn(
                                                "w-full rounded-sm px-1.5 py-0.5 text-xs text-white truncate border-l-2",
                                                getCategoryColor(task.category),
                                                task.completed && "opacity-50 line-through"
                                            )}
                                        >
                                            {task.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    );
                }
            }}
            />
    </div>
  );
}
