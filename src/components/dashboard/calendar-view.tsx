
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RoadmapTask } from '@/lib/types';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isWithinInterval, getDay } from 'date-fns';
import { Checkbox } from '../ui/checkbox';
import { addNotification } from '@/lib/tracking';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CheckCircle, LinkIcon } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

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

const dayOfWeekMap: { [key: string]: number } = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function DayPopover({ date, tasks, onToggle }: { date: Date, tasks: RoadmapTask[], onToggle: (taskId: string) => void }) {
    if (tasks.length === 0) {
        return <div className="font-semibold text-xs">{format(date, "d")}</div>;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="w-full h-full text-left p-1 focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
                     <div className="font-semibold text-xs">{format(date, "d")}</div>
                      <div className="mt-1 w-full space-y-1">
                        {tasks.slice(0, 3).map(task => (
                            <Badge key={task.id} variant={task.completed ? "secondary" : "default"} className="block truncate w-full text-left p-1 h-auto text-[11px] font-normal">
                                {task.title}
                            </Badge>
                        ))}
                         {tasks.length > 3 && (
                            <Badge variant="outline" className="block w-full text-center p-1 h-auto text-[10px] font-normal">
                                + {tasks.length - 3} more
                            </Badge>
                        )}
                    </div>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                 <div className="space-y-4">
                    <div className="font-bold text-lg">{format(date, "EEEE, MMMM d")}</div>
                    <ScrollArea className="max-h-60 pr-4">
                        <div className="space-y-3">
                            {tasks.map(task => (
                                <div key={task.id} className="flex items-start gap-3">
                                    <Checkbox
                                        id={`popover-task-${task.id}`}
                                        checked={task.completed}
                                        onCheckedChange={() => onToggle(task.id)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <label htmlFor={`popover-task-${task.id}`} className={`font-medium text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                            {task.title}
                                        </label>
                                        <p className="text-xs text-muted-foreground">{task.description}</p>
                                        {task.relatedResources && task.relatedResources.length > 0 && (
                                            <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                                                <a href={task.relatedResources[0].url} target="_blank" rel="noopener noreferrer">
                                                    <LinkIcon className="w-3 h-3 mr-1" />
                                                    View Resource
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                 </div>
            </PopoverContent>
        </Popover>
    );
}


export function CalendarView() {
    const [tasks, setTasks] = useState<RoadmapTask[]>([]);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    
    const loadTasks = useCallback(() => {
        if (typeof window === 'undefined') return;
        try {
            const signupDataStr = localStorage.getItem('signupData');
            if (signupDataStr) {
                const signupData = JSON.parse(signupDataStr);
                const email = signupData.email;
                setUserEmail(email);

                const storedTasks = localStorage.getItem(`roadmapTasks-${email}`);
                if (storedTasks) {
                    setTasks(JSON.parse(storedTasks));
                }
            }
        } catch (error) {
            console.error("Failed to load tasks for calendar view:", error);
        }
    }, []);

    const handleTaskToggle = (taskId: string) => {
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


    useEffect(() => {
        loadTasks();
        window.addEventListener('storage', loadTasks);
        return () => window.removeEventListener('storage', loadTasks);
    }, [loadTasks]);

    const daysInMonth = useMemo(() => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);
    
    const getTasksForDay = useCallback((day: Date): RoadmapTask[] => {
        const dayOfWeek = getDay(day);
        return tasks.filter(task => { 
            if (task.dueDate && isSameDay(parseISO(task.dueDate), day)) {
                return true;
            }
            if (task.recurringDays && task.recurringDays.length > 0) {
                return task.recurringDays.some(recurringDay => dayOfWeekMap[recurringDay] === dayOfWeek);
            }
            return false;
        }).sort((a, b) => (a.completed ? 1 : -1)); // Show incomplete tasks first
    }, [tasks]);

    const calendarGrid = useMemo(() => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        const startDate = start.getDay() === 0 ? start : new Date(start.setDate(start.getDate() - start.getDay()));
        const endDate = end.getDay() === 6 ? end : new Date(end.setDate(end.getDate() + (6 - end.getDay())));
        
        const grid = [];
        let day = startDate;
        while (day <= endDate) {
            grid.push(day);
            day = new Date(day.setDate(day.getDate() + 1));
        }
        return grid;
    }, [currentMonth]);

    return (
        <Card className="p-4 h-full flex flex-col glass-card">
             <div className="flex justify-between items-center mb-2 px-2">
                <Button variant="outline" onClick={() => setCurrentMonth(m => new Date(m.setMonth(m.getMonth() - 1)))}>
                    Previous
                </Button>
                <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
                <Button variant="outline" onClick={() => setCurrentMonth(m => new Date(m.setMonth(m.getMonth() + 1)))}>
                    Next
                </Button>
            </div>
            <div className="grid grid-cols-7 gap-1 flex-1">
                 {dayHeaders.map(day => (
                    <div key={day} className="text-center font-bold text-muted-foreground text-sm">
                        {day}
                    </div>
                ))}
                {calendarGrid.map(date => {
                    const tasksForDay = getTasksForDay(date);
                    const isOutsideMonth = date.getMonth() !== currentMonth.getMonth();
                    return (
                        <div key={date.toString()} className={`border border-border/20 rounded-md p-1 ${isOutsideMonth ? 'bg-black/10 text-muted-foreground/50' : 'bg-background/10'}`}>
                           <DayPopover date={date} tasks={tasksForDay} onToggle={handleTaskToggle} />
                        </div>
                    )
                })}
            </div>
        </Card>
    );
}
