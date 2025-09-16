
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RoadmapTask } from '@/lib/types';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, getDay, startOfWeek, endOfWeek, addDays, isToday } from 'date-fns';
import { Checkbox } from '../ui/checkbox';
import { addNotification } from '@/lib/tracking';
import { Button } from '../ui/button';
import { CheckCircle, Link as LinkIcon, Star, Trophy, BrainCircuit, Repeat, Calendar as CalendarIcon, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { updateUser, findUserById } from '@/lib/data-client';

const dayOfWeekMap: { [key: string]: number } = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getCategoryIcon = (category: RoadmapTask['category']) => {
    switch (category) {
        case 'Academics': return <BrainCircuit className="w-4 h-4 text-blue-400" />;
        case 'Extracurriculars': return <Trophy className="w-4 h-4 text-green-400" />;
        case 'Skill Building': return <Star className="w-4 h-4 text-yellow-400" />;
        default: return <Star className="w-4 h-4 text-gray-400" />;
    }
};


function TaskDialog({ task, onToggle, children }: { task: RoadmapTask; onToggle: (id: string) => void; children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
           <div className="flex items-center gap-2 mb-2">
                {getCategoryIcon(task.category)}
                <Badge variant="outline">{task.category}</Badge>
            </div>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>{task.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
             <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {task.points && (
                    <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400"/> {task.points} pts</span>
                )}
                {task.dueDate && (
                    <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4"/> Due {format(parseISO(task.dueDate), "MMM d, yyyy")}</span>
                )}
                 {task.recurringDays && task.recurringDays.length > 0 && (
                    <span className="flex items-center gap-1.5"><Repeat className="w-4 h-4"/> {task.recurringDays.map(d => d.slice(0,1).toUpperCase() + d.slice(1,3)).join(', ')}</span>
                )}
            </div>
            {task.relatedResources && task.relatedResources.length > 0 && (
                 <div>
                    <h4 className="font-semibold mb-2">Related Resources</h4>
                    <div className='space-y-2'>
                    {task.relatedResources?.map(resource => (
                        <Button key={resource.url} variant="outline" size="sm" asChild className="w-full justify-start">
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <LinkIcon className="w-4 h-4 mr-2" />
                                {resource.title}
                            </a>
                        </Button>
                    ))}
                    </div>
                 </div>
            )}
        </div>
        <DialogFooter>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onToggle(task.id)}>
              <Checkbox id={`complete-${task.id}`} checked={task.completed} onCheckedChange={() => onToggle(task.id)} />
              <label htmlFor={`complete-${task.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
              </label>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function CalendarView() {
    const [tasks, setTasks] = useState<RoadmapTask[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    
    const loadTasks = useCallback(async () => {
        if (typeof window === 'undefined') return;
        try {
            const userStr = sessionStorage.getItem('user');
            if (userStr) {
                const sessionUser = JSON.parse(userStr);
                const userId = sessionUser.userId;
                setCurrentUserId(userId);
                
                const userData: any = await findUserById(userId);
                setTasks(userData?.tasks || []);
            }
        } catch (error) {
            console.error("Failed to load tasks for calendar view:", error);
        }
    }, []);

    const handleTaskToggle = async (taskId: string) => {
        if (!currentUserId) return;

        let toggledTask: RoadmapTask | undefined;
        const newTasks = tasks.map(task => {
            if (task.id === taskId) {
                if (!task.completed) {
                    addNotification({
                        title: "Task Completed!",
                        description: `You earned ${task.points || 10} points for "${task.title}".`
                    });
                }
                toggledTask = { ...task, completed: !task.completed };
                return toggledTask;
            }
            return task;
        });

        setTasks(newTasks);
        await updateUser(currentUserId, { tasks: newTasks });
    };


    useEffect(() => {
        loadTasks();
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
        }).sort((a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || a.title.localeCompare(b.title));
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
             <div className="grid grid-cols-7 flex-1">
                {dayHeaders.map(day => (
                     <div key={day} className="text-center font-bold text-muted-foreground text-sm py-2">{day}</div>
                ))}
                {calendarGrid.map((date, index) => {
                    const tasksForDay = getTasksForDay(date);
                    const isOutsideMonth = date.getMonth() !== currentMonth.getMonth();
                    const isCurrentDay = isToday(date);
                    return (
                        <div 
                            key={index} 
                            className={cn(
                                "border border-border/20 rounded-md p-2 flex flex-col relative",
                                isOutsideMonth ? 'text-muted-foreground/30 bg-black/10' : 'bg-background/10'
                            )}
                        >
                           <span className={cn(
                               "font-semibold text-xs",
                               isCurrentDay && "text-primary font-bold"
                            )}>{format(date, "d")}</span>
                           <div className="flex-1 mt-1 space-y-1 overflow-auto">
                                {tasksForDay.map(task => (
                                     <TaskDialog key={task.id} task={task} onToggle={handleTaskToggle}>
                                        <Badge
                                            variant={task.completed ? "secondary" : "default"}
                                            className="block w-full text-left p-1 h-auto font-normal truncate cursor-pointer hover:ring-2 hover:ring-primary"
                                        >
                                            {task.title}
                                        </Badge>
                                    </TaskDialog>
                                ))}
                           </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    );
}

    