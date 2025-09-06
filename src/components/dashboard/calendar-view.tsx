
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RoadmapTask } from '@/lib/types';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isWithinInterval, getDay } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Checkbox } from '../ui/checkbox';
import { addNotification } from '@/lib/tracking';

type DayWithTasks = {
    date: Date;
    tasks: RoadmapTask[];
};

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

export function CalendarView() {
    const [tasks, setTasks] = useState<RoadmapTask[]>([]);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [month, setMonth] = useState<Date>(new Date());
    
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

    useEffect(() => {
        loadTasks();
        window.addEventListener('storage', loadTasks);
        return () => window.removeEventListener('storage', loadTasks);
    }, [loadTasks]);

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

    const tasksForMonth = useMemo(() => {
        const start = startOfMonth(month);
        const end = endOfMonth(month);
        const interval = { start, end };
        
        return tasks.filter(task => {
            if (task.dueDate) {
                const dueDate = parseISO(task.dueDate);
                return isWithinInterval(dueDate, interval);
            }
            if (task.recurringDays && task.recurringDays.length > 0) {
                // If it's recurring, it's potentially visible in any month
                return true;
            }
            return false;
        });
    }, [tasks, month]);

    const getTasksForDay = (day: Date): RoadmapTask[] => {
        const dayOfWeek = getDay(day); // 0 for Sunday, 1 for Monday...
        return tasksForMonth.filter(task => {
            if (task.dueDate && isSameDay(parseISO(task.dueDate), day)) {
                return true;
            }
            if (task.recurringDays && task.recurringDays.length > 0) {
                return task.recurringDays.some(recurringDay => dayOfWeekMap[recurringDay] === dayOfWeek);
            }
            return false;
        });
    };

    return (
        <Card className="p-4">
            <Calendar
                mode="single"
                selected={new Date()}
                onMonthChange={setMonth}
                className="p-0"
                classNames={{
                    day_cell: "h-24 w-32 align-top p-1",
                    day: "w-full h-full",
                }}
                components={{
                    Day: ({ date, displayMonth }) => {
                        const tasksForDay = getTasksForDay(date);
                        const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();

                        if (isOutsideMonth) {
                            return <div className="p-1 text-muted-foreground/50">{format(date, "d")}</div>;
                        }

                        return (
                            <Popover>
                                <PopoverTrigger asChild disabled={tasksForDay.length === 0}>
                                    <div className="w-full h-full p-1 text-left relative cursor-pointer hover:bg-muted rounded-md">
                                        <div className="font-bold">{format(date, "d")}</div>
                                        <div className="space-y-1 mt-1 overflow-y-auto max-h-16">
                                            {tasksForDay.slice(0, 2).map(task => (
                                                <Badge key={task.id} variant={task.completed ? "secondary" : "default"} className="block truncate text-xs">
                                                    {task.title}
                                                </Badge>
                                            ))}
                                            {tasksForDay.length > 2 && (
                                                <Badge variant="outline" className="block text-xs">
                                                    + {tasksForDay.length - 2} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <h4 className="font-semibold mb-2">{format(date, "PPP")}</h4>
                                    <div className="space-y-2">
                                        {tasksForDay.map(task => (
                                            <div key={task.id} className="flex items-center gap-2">
                                                <Checkbox id={`cal-${task.id}`} checked={task.completed} onCheckedChange={() => toggleTask(task.id)}/>
                                                <label htmlFor={`cal-${task.id}`} className="text-sm">{task.title}</label>
                                            </div>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        );
                    }
                }}
            />
        </Card>
    );
}
