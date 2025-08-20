
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { RoadmapTask } from '@/lib/types';
import { isSameDay, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const getCategoryColor = (category: RoadmapTask['category']) => {
    switch (category) {
        case 'Academics': return 'bg-blue-500 hover:bg-blue-600';
        case 'Extracurriculars': return 'bg-green-500 hover:bg-green-600';
        case 'Skill Building': return 'bg-yellow-500 hover:bg-yellow-600';
        default: return 'bg-gray-500 hover:bg-gray-600';
    }
};

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [tasks, setTasks] = useState<RoadmapTask[]>([]);
    const [tasksByDate, setTasksByDate] = useState<{ [key: string]: RoadmapTask[] }>({});

    useEffect(() => {
        const storedTasks = localStorage.getItem('roadmapTasks');
        if (storedTasks) {
            const parsedTasks: RoadmapTask[] = JSON.parse(storedTasks);
            setTasks(parsedTasks);

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
            <div className="relative h-full w-full">
                {props.children}
                {dayTasks.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
                        {dayTasks.slice(0, 3).map((task, index) => (
                            <div key={index} className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(task.category)}`} />
                        ))}
                    </div>
                )}
            </div>
        );
    };
    
    const selectedDayTasks = date ? tasks.filter(task => task.dueDate && isSameDay(parseISO(task.dueDate), date)) : [];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Calendar</h1>
                <p className="text-muted-foreground">Your tasks and deadlines at a glance.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                     <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="p-0"
                        classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                            month: "space-y-4 flex-1",
                            caption_label: "text-lg font-bold",
                            head_row: "flex justify-around",
                            head_cell: "text-muted-foreground rounded-md w-full font-normal text-sm",
                            row: "flex w-full mt-2 justify-around",
                            cell: "h-20 w-full text-center text-sm p-1 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: "h-full w-full p-0 font-normal aria-selected:opacity-100",
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
                            day_today: "bg-accent text-accent-foreground rounded-full",
                        }}
                        components={{
                            Day: DayWithTasks
                        }}
                    />
                </Card>
                <div className="lg:col-span-1 space-y-4">
                     <Card>
                        <CardContent className="p-4">
                           <h2 className="text-lg font-semibold mb-4">
                                {date ? `Tasks for ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}` : 'Select a date'}
                            </h2>
                            {selectedDayTasks.length > 0 ? (
                                <ul className="space-y-3">
                                    {selectedDayTasks.map(task => (
                                        <li key={task.id} className="flex items-start gap-3">
                                             <div className={`mt-1.5 w-2.5 h-2.5 rounded-full ${getCategoryColor(task.category)} flex-shrink-0`}></div>
                                             <div>
                                                <p className="font-medium leading-tight">{task.title}</p>
                                                {task.completed && <Badge variant="secondary" className="mt-1">Completed</Badge>}
                                             </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">No tasks scheduled for this day.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
