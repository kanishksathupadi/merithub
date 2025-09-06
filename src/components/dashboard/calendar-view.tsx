
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RoadmapTask } from '@/lib/types';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isWithinInterval, getDay } from 'date-fns';
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
                return true;
            }
            return false;
        });
    }, [tasks, month]);

    const getTasksForDay = (day: Date): RoadmapTask[] => {
        const dayOfWeek = getDay(day);
        return tasks.filter(task => { 
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
        <Card className="p-2 h-full flex flex-col glass-card">
            <Calendar
                mode="single"
                selected={new Date()}
                onMonthChange={setMonth}
                className="p-0 h-full flex flex-col"
                 classNames={{
                    root: "h-full flex flex-col",
                    months: "flex flex-col sm:flex-row flex-1",
                    month: "h-full flex flex-col flex-1 space-y-2",
                    table: "w-full border-collapse flex flex-col flex-1",
                    tbody: "flex-1 grid grid-rows-5 gap-1",
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md w-full basis-0 flex-1 font-normal text-[0.8rem] text-center",
                    row: "flex w-full gap-1",
                    cell: "h-full w-full text-center text-sm p-0 relative basis-0 flex-1",
                    day: "h-full w-full p-1",
                    day_outside: "day-outside text-muted-foreground opacity-50",
                }}
                components={{
                    Day: ({ date, displayMonth }) => {
                        const tasksForDay = getTasksForDay(date);
                        const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();
                        const firstTask = tasksForDay.length > 0 ? tasksForDay[0] : null;

                        return (
                            <div className="w-full h-full text-left relative flex flex-col border border-border/20 rounded-md p-1 items-center">
                                <div className={`font-semibold text-xs ${isOutsideMonth ? 'text-muted-foreground/50': ''}`}>{format(date, "d")}</div>
                                <div className="mt-1 w-full">
                                    {firstTask && (
                                        <Badge variant={firstTask.completed ? "secondary" : "default"} className="block truncate w-full text-center text-[10px] p-1 h-auto">
                                            {firstTask.title}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        );
                    }
                }}
            />
        </Card>
    );
}
