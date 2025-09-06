
"use client";

import { useState, useEffect, useMemo } from "react";
import type { RoadmapTask } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Link as LinkIcon, Star, BrainCircuit, Trophy, Repeat, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { addNotification } from "@/lib/tracking";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

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

const getCategoryIcon = (category: RoadmapTask['category']) => {
    switch (category) {
        case 'Academics': return <BrainCircuit className="w-5 h-5 text-blue-400" />;
        case 'Extracurriculars': return <Trophy className="w-5 h-5 text-green-400" />;
        case 'Skill Building': return <Star className="w-5 h-5 text-yellow-400" />;
        default: return <Star className="w-5 h-5 text-gray-400" />;
    }
}

function TaskCompletionDialog({ task, onToggle, children }: { task: RoadmapTask, onToggle: (id: string, proof?: string) => void, children: React.ReactNode }) {
    const [proof, setProof] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const requiresProof = task.requiresProof && !task.completed;
    const canComplete = !requiresProof || (requiresProof && proof.trim().length > 0);

    const handleComplete = () => {
        onToggle(task.id, proof);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{task.completed ? 'Task Details' : 'Complete Task'}</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <div className="font-bold text-lg text-foreground">{task.title}</div>
                            <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    {requiresProof && (
                        <div className="space-y-2">
                             <label htmlFor="proof" className="text-sm font-medium">Proof of Completion</label>
                             <Textarea 
                                id="proof"
                                value={proof}
                                onChange={(e) => setProof(e.target.value)}
                                placeholder="Provide a URL to your project, a brief description of the outcome, or a link to a document..."
                             />
                             <p className="text-xs text-muted-foreground">This is required to mark this task as complete.</p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    {task.completed ? (
                         <Button onClick={() => onToggle(task.id)} variant="outline">Mark as Incomplete</Button>
                    ) : (
                        <Button onClick={handleComplete} disabled={!canComplete}>
                            Complete Task
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


function TaskCard({ task, onToggle }: { task: RoadmapTask, onToggle: (id: string, proof?: string) => void }) {
    return (
        <TaskCompletionDialog task={task} onToggle={onToggle}>
            <div className={`p-4 rounded-lg transition-all flex items-start gap-4 cursor-pointer ${task.completed ? 'bg-muted/50 opacity-70' : 'bg-background/50 hover:bg-muted/80'}`}>
                <Checkbox id={`task-${task.id}`} checked={task.completed} className="mt-1" />
                <div className="flex-1 space-y-1">
                    <p className={`font-semibold ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-2">
                        {task.points && (
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400"/> {task.points} pts</span>
                        )}
                        {task.dueDate && (
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> Due {format(parseISO(task.dueDate), "MMM d, yyyy")}</span>
                        )}
                        {task.recurringDays && task.recurringDays.length > 0 && (
                            <span className="flex items-center gap-1"><Repeat className="w-3 h-3"/> {task.recurringDays.map(d => d.slice(0,1).toUpperCase() + d.slice(1,3)).join(', ')}</span>
                        )}
                        {task.requiresProof && (
                             <span className="flex items-center gap-1 font-semibold text-primary/80"><Lock className="w-3 h-3"/> Proof Required</span>
                        )}
                    </div>
                    {task.relatedResources && task.relatedResources.length > 0 && (
                        <div className="pt-2">
                            {task.relatedResources?.map(resource => (
                                <Button key={resource.url} variant="link" size="sm" asChild className="p-0 h-auto">
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                        <LinkIcon className="w-3 h-3 mr-1" />
                                        {resource.title}
                                    </a>
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
                {!task.completed && (
                    <Badge variant="outline" className="h-fit">{task.category}</Badge>
                )}
            </div>
        </TaskCompletionDialog>
    )
}

export function RoadmapView() {
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
        const signupDataStr = localStorage.getItem('signupData');
        if (signupDataStr) {
          const signupData = JSON.parse(signupDataStr);
          const email = signupData.email;
          setUserEmail(email);

            let storedTasks = localStorage.getItem(`roadmapTasks-${email}`);
            if (storedTasks) {
            let parsedTasks: RoadmapTask[] = JSON.parse(storedTasks);
            parsedTasks = parsedTasks.map((task, index) => ({
                ...task,
                points: task.points || Math.floor(Math.random() * 20) + 10,
                dueDate: task.dueDate,
            }));
            setTasks(parsedTasks);
            }
        }
    } catch(error) {
        console.error("Failed to parse roadmap tasks from localStorage", error);
        if (userEmail) {
            localStorage.removeItem(`roadmapTasks-${userEmail}`);
        }
    } finally {
        setLoading(false);
    }
  }, [userEmail]);
  
  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
        const grade = task.grade || "Uncategorized";
        if (!acc[grade]) {
            acc[grade] = {};
        }
        if (!acc[grade][task.category]) {
            acc[grade][task.category] = [];
        }
        acc[grade][task.category].push(task);
        return acc;
    }, {} as Record<string, Record<RoadmapTask['category'], RoadmapTask[]>>);
  }, [tasks]);

  const gradeOrder = useMemo(() => {
    const numericGrades = Object.keys(groupedTasks)
        .filter(g => g.match(/^\d/))
        .sort((a,b) => parseInt(a) - parseInt(b));
    const customGrades = Object.keys(groupedTasks).filter(g => g.toLowerCase() === "custom");
    const otherGrades = Object.keys(groupedTasks).filter(g => !g.match(/^\d/) && g.toLowerCase() !== "custom");

    return [...numericGrades, ...otherGrades, ...customGrades];
  }, [groupedTasks]);


  const toggleTask = (taskId: string, proof?: string) => {
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
        return { 
            ...task, 
            completed: isNowCompleted,
            completionProof: isNowCompleted ? proof : undefined,
        };
      }
      return task;
    });

    setTasks(newTasks);
    localStorage.setItem(`roadmapTasks-${userEmail}`, JSON.stringify(newTasks));
    updateMasterUserList(userEmail, newTasks);
    window.dispatchEvent(new StorageEvent('storage', {key: 'roadmapTasks'}));
  };


  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    );
  }
  
  if (tasks.length === 0) {
      return (
        <Card className="mt-4">
            <CardContent className="p-6 text-center text-muted-foreground">
                Your roadmap is currently empty. Go to the dashboard to generate your AI plan or add a custom task.
            </CardContent>
        </Card>
      )
  }

  return (
    <div className="w-full space-y-4">
        <Accordion type="single" collapsible defaultValue={`${gradeOrder[0]}`} className="w-full space-y-4">
           {gradeOrder.map(grade => {
                // Determine all categories present for this grade
                const categoriesForGrade = Object.keys(groupedTasks[grade] || {});
                if (categoriesForGrade.length === 0) return null;

                return (
                    <AccordionItem value={grade} key={grade} className="border-b-0">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline">
                                <h2 className="text-2xl font-bold">{grade}</h2>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                                <div className="space-y-6">
                                    {categoriesForGrade.map(category => {
                                        const categoryTasks = groupedTasks[grade][category as keyof typeof groupedTasks[typeof grade]]
                                        if (categoryTasks.length === 0) return null;
                                        return (
                                            <div key={category}>
                                                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                                    {getCategoryIcon(category as RoadmapTask['category'])}
                                                    {category}
                                                </h3>
                                                <div className="space-y-3">
                                                    {categoryTasks.map(task => (
                                                        <TaskCard key={task.id} task={task} onToggle={toggleTask} />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                )
           })}
        </Accordion>
    </div>
  );
}
