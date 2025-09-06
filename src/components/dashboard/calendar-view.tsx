
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RoadmapTask } from '@/lib/types';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isWithinInterval, getDay, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { Checkbox } from '../ui/checkbox';
import { addNotification } from '@/lib/tracking';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CheckCircle, LinkIcon } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';

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
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        
        const grid = [];
        let day = startDate;
        while (day <= endDate) {
            grid.push(day);
            day = addDays(day, 1);
        }
        return grid;
    }, [currentMonth]);

    return (
        <Card className="p-4 h-full flex flex-col glass-card">
             <div className="flex justify-between items-center mb-4 px-2">
                <Button variant="outline" onClick={() => setCurrentMonth(m => new Date(m.setMonth(m.getMonth() - 1)))}>
                    Previous
                </Button>
                <h2 className="text-xl font-bold text-center">{format(currentMonth, "MMMM yyyy")}</h2>
                <Button variant="outline" onClick={() => setCurrentMonth(m => new Date(m.setMonth(m.getMonth() + 1)))}>
                    Next
                </Button>
            </div>
            <div className="grid grid-cols-7 text-center font-bold text-muted-foreground text-sm">
                {dayHeaders.map(day => (
                    <div key={day} className="py-2">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 grid-rows-6 gap-1 flex-1">
                {calendarGrid.map((date, index) => {
                    const tasksForDay = getTasksForDay(date);
                    const isOutsideMonth = date.getMonth() !== currentMonth.getMonth();
                    return (
                        <div 
                            key={index} 
                            className={cn(
                                "border border-border/20 rounded-md p-2 flex flex-col",
                                isOutsideMonth ? 'text-muted-foreground/50 bg-black/10' : 'bg-background/10'
                            )}
                        >
                           <span className="font-semibold text-xs">{format(date, "d")}</span>
                           <div className="flex-1 mt-1 space-y-1 overflow-hidden">
                                {tasksForDay.map(task => (
                                    <Badge 
                                        key={task.id}
                                        variant={task.completed ? "secondary" : "default"}
                                        className="block w-full text-left p-1 h-auto font-normal truncate"
                                    >
                                        {task.title}
                                    </Badge>
                                ))}
                           </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    );
}
