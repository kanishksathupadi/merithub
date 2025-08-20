
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { RoadmapTask } from '@/lib/types';
import { parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const getCategoryColor = (category: RoadmapTask['category']) => {
    switch (category) {
        case 'Academics': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'Extracurriculars': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'Skill Building': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
};

export default function CalendarPage() {
    const [tasksByDate, setTasksByDate] = useState<{ [key: string]: RoadmapTask[] }>({});

    useEffect(() => {
        const storedTasks = localStorage.getItem('roadmapTasks');
        if (storedTasks) {
            const parsedTasks: RoadmapTask[] = JSON.parse(storedTasks);
            const groupedTasks = parsedTasks.reduce((acc, task) => {
                if (task.dueDate) {
                    const day = parseISO(task.dueDate).toDateString();
                    if (!acc[day]) {
                        acc[day] = [];
                    }
                    acc[day].push(task);
                }
                return acc;
            }, {} as { [key: string]: RoadmapTask[] });
            setTasksByDate(groupedTasks);
        }
    }, []);
    
    const DayWithTasks = ({ date, ...props }: { date: Date } & any) => {
        const dayTasks = tasksByDate[date.toDateString()] || [];

        return (
            <div className="relative h-full w-full flex flex-col p-1 overflow-hidden">
                <time dateTime={date.toISOString()} className="absolute top-1 right-1">{props.children}</time>
                {dayTasks.length > 0 && (
                    <div className="flex flex-col gap-1 mt-6 overflow-y-auto">
                        {dayTasks.slice(0, 2).map((task) => (
                           <Popover key={task.id}>
                                <PopoverTrigger asChild>
                                    <div className={cn("px-2 py-1 text-xs rounded-md truncate cursor-pointer", getCategoryColor(task.category))}>
                                        {task.title}
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold leading-none">{task.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                               {task.description}
                                            </p>
                                        </div>
                                         <Badge variant="outline" className={cn("w-fit", getCategoryColor(task.category))}>
                                            {task.category}
                                        </Badge>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ))}
                         {dayTasks.length > 2 && (
                            <div className="text-xs text-muted-foreground mt-1 text-center">
                                +{dayTasks.length - 2} more
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <header>
                <h1 className="text-3xl font-bold">Calendar</h1>
                <p className="text-muted-foreground">Your tasks and deadlines at a glance.</p>
            </header>
            <div className="border rounded-lg flex-1 flex">
                 <Calendar
                    mode="single"
                    className="p-0 flex-1"
                    classNames={{
                        months: "flex flex-col flex-1",
                        month: "space-y-4 flex flex-col flex-1",
                        caption_label: "text-lg font-bold",
                        head_row: "flex justify-around",
                        head_cell: "text-muted-foreground rounded-md w-full font-normal text-sm",
                        row: "flex w-full mt-2 justify-around flex-1",
                        cell: "w-full text-left text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 border-t border-l",
                        day: "h-full w-full p-0 font-normal aria-selected:opacity-100",
                        day_selected: "bg-accent text-accent-foreground",
                        day_today: "bg-primary/10 text-primary-foreground",
                        table: "w-full h-full flex flex-col",
                        tbody: "flex flex-col flex-1",
                    }}
                    components={{
                        Day: DayWithTasks
                    }}
                />
            </div>
        </div>
    );
}
