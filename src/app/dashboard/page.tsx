
"use client";

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { suggestNextStep, type SuggestNextStepInput, type SuggestNextStepOutput } from "@/ai/flows/suggest-next-step";
import { updateStudentPlan } from "@/ai/flows/update-student-plan";
import { getStrategicBriefing, type StrategicBriefingOutput } from "@/ai/flows/get-strategic-briefing";
import { NextStepCard } from "@/components/dashboard/next-step-card";
import { CheckInCard } from "@/components/dashboard/check-in-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ListChecks, MessageSquare, TrendingUp, Users, Star, GraduationCap, PenSquare, Award, CheckCircle, X, Info } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { v4 as uuidv4 } from 'uuid';
import type { RoadmapTask } from "@/lib/types";
import { cn } from "@/lib/utils";
import { trackFeatureUsage } from "@/lib/tracking";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


async function fetchSuggestion(input: SuggestNextStepInput) {
    try {
        const result = await suggestNextStep(input);
        return result;
    } catch (error) {
        console.error("Failed to fetch suggestion:", error);
        return null;
    }
}

function generateTasksFromSuggestion(suggestion: SuggestNextStepOutput): RoadmapTask[] {
    const tasks: RoadmapTask[] = [];
    if (!suggestion || !suggestion.plan) return tasks;

    suggestion.plan.forEach((planItem, planIndex) => {
        const createTasks = (items: any[], category: RoadmapTask['category']) => {
            items.forEach((item, itemIndex) => {
                tasks.push({
                    id: uuidv4(),
                    title: item.title,
                    description: item.description,
                    category,
                    grade: planItem.grade,
                    completed: false,
                    relatedResources: item.resource ? [item.resource] : [],
                    points: Math.floor(Math.random() * 20) + 10, // Assign 10-30 points
                    dueDate: new Date(Date.now() + (planIndex * 30 + itemIndex) * 24 * 60 * 60 * 1000).toISOString(), // Mock due dates
                });
            });
        };

        createTasks(planItem.academics, 'Academics');
        createTasks(planItem.extracurriculars, 'Extracurriculars');
        createTasks(planItem.skillBuilding, 'Skill Building');
    });
    return tasks;
}

function SuggestionView() {
    const [tasks, setTasks] = useState<RoadmapTask[]>([]);
    const [briefing, setBriefing] = useState<StrategicBriefingOutput | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCheckIn, setShowCheckIn] = useState(false);
    const { toast } = useToast();

    const email = useMemo(() => {
        if (typeof window === 'undefined') return null;
        const signupDataStr = localStorage.getItem('signupData');
        if (!signupDataStr) return null;
        try {
            return JSON.parse(signupDataStr).email;
        } catch {
            return null;
        }
    }, []);

    const loadTasksAndBriefing = useCallback(async (email: string | null) => {
        if (!email) return [];
        
        const storedTasksStr = localStorage.getItem(`roadmapTasks-${email}`);
        let currentTasks: RoadmapTask[] = [];
        if (storedTasksStr) {
            try {
                currentTasks = JSON.parse(storedTasksStr);
                setTasks(currentTasks);
            } catch (error) {
                console.error("Failed to parse tasks from localStorage", error);
            }
        }
        
        if (currentTasks.length > 0) {
            const cachedBriefingStr = localStorage.getItem(`strategicBriefing-${email}`);
            if (cachedBriefingStr) {
                try {
                    const cachedBriefing = JSON.parse(cachedBriefingStr);
                    // Basic validation to ensure the cached briefing matches the plan's state
                    const incompleteCount = currentTasks.filter(t => !t.completed).length;
                    if (incompleteCount === 0 && cachedBriefing.priorityMission.id === 'completed') {
                         setBriefing(cachedBriefing);
                         return currentTasks;
                    }
                    if (incompleteCount > 0 && currentTasks.some(t => t.id === cachedBriefing.priorityMission.id && !t.completed)) {
                        setBriefing(cachedBriefing);
                        return currentTasks;
                    }
                } catch (e) {
                    console.error("Failed to parse cached briefing", e);
                }
            }

            // If no valid cache, generate a new briefing
            try {
                const briefingResult = await getStrategicBriefing({ plan: currentTasks });
                setBriefing(briefingResult);
                localStorage.setItem(`strategicBriefing-${email}`, JSON.stringify(briefingResult));
            } catch (error) {
                console.error("Failed to get strategic briefing:", error);
                toast({
                    variant: "destructive",
                    title: "Could not generate AI briefing.",
                    description: "There was an issue contacting the AI. Please try again later."
                })
                setBriefing(null);
            }
        }

        return currentTasks;
    }, [toast]);


    const saveTasks = useCallback(async (tasksToSave: RoadmapTask[]) => {
         if (!email) return;
         localStorage.setItem(`roadmapTasks-${email}`, JSON.stringify(tasksToSave));
         setTasks(tasksToSave);
         // Invalidate briefing cache on task change
         localStorage.removeItem(`strategicBriefing-${email}`);
         await loadTasksAndBriefing(email);
    }, [email, loadTasksAndBriefing]);

    useEffect(() => {
        const getSuggestionAndTasks = async () => {
            setLoading(true);
            if (!email) {
                setLoading(false);
                return;
            };

            const cachedSuggestion = localStorage.getItem(`aiSuggestion-${email}`);
            const currentTasks = await loadTasksAndBriefing(email);
            
            if (cachedSuggestion && currentTasks.length > 0) {
                 setLoading(false);
            } else {
                const onboardingDataStr = localStorage.getItem('onboardingData');
                const signupDataStr = localStorage.getItem('signupData');

                if (onboardingDataStr && signupDataStr) {
                    const onboardingData = JSON.parse(onboardingDataStr);
                    const signupData = JSON.parse(signupDataStr);
                    const result = await fetchSuggestion({ ...onboardingData, grade: signupData.grade });
                    
                    if (result) {
                        localStorage.setItem(`aiSuggestion-${email}`, JSON.stringify(result));
                        const newTasks = generateTasksFromSuggestion(result);
                        await saveTasks(newTasks);
                    }
                }
            }

            // Check-in card visibility logic
            const lastCheckInStr = localStorage.getItem(`lastCheckIn-${email}`);
            if (lastCheckInStr) {
                const lastCheckInTime = new Date(lastCheckInStr).getTime();
                const twentyFourHours = 24 * 60 * 60 * 1000;
                if (Date.now() - lastCheckInTime < twentyFourHours) {
                    setShowCheckIn(false);
                } else {
                    setShowCheckIn(true);
                }
            } else {
                setShowCheckIn(true);
            }

            setLoading(false);
        };

        getSuggestionAndTasks();
    }, [email, loadTasksAndBriefing, saveTasks]);

    const handleTaskToggle = (taskId: string) => {
        const newTasks = tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        saveTasks(newTasks);
    };

    const handleCheckIn = async (checkInText: string) => {
        setLoading(true);
        if (!email) {
             toast({ variant: "destructive", title: "Error", description: "Could not find user profile." });
             setLoading(false);
             return;
        };

        try {
            const result = await updateStudentPlan({ existingPlan: tasks, checkInText });
            const { updatedPlan } = result;

            if (updatedPlan) {
                await saveTasks(updatedPlan);
                localStorage.setItem(`lastCheckIn-${email}`, new Date().toISOString());
                setShowCheckIn(false);
                toast({
                    title: "Plan Updated!",
                    description: "Your roadmap has been updated with your latest input.",
                });
            }
        } catch (error) {
            console.error("Failed to update plan:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "We couldn't update your plan at this time. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
             <div className="space-y-6">
                <Skeleton className="h-72 w-full glass-card" />
                <Skeleton className="h-48 w-full glass-card" />
            </div>
        )
    }
    
    return (
        <div className="space-y-6">
             {briefing ? (
                <NextStepCard briefing={briefing} tasks={tasks} onTaskToggle={handleTaskToggle} />
             ) : (
                <Card className="glass-card"><CardContent className="pt-6"><p>Generating your strategic plan. If this takes more than a moment, please try refreshing the page.</p></CardContent></Card>
             )}
            {showCheckIn && <CheckInCard onCheckIn={handleCheckIn} isLoading={loading} />}
        </div>
    )
}

const standardTiles = [
    { title: "My Roadmap", icon: ListChecks, href: "/dashboard/roadmap", feature: "myRoadmap", color: "text-chart-1" },
    { title: "Progress Tracker", icon: TrendingUp, href: "/dashboard/progress", feature: "progressTracker", color: "text-chart-2" },
    { title: "AI Study Buddy", icon: BookOpen, href: "/dashboard/study-resources", feature: "aiStudyBuddy", color: "text-chart-3" },
    { title: "College Finder", icon: GraduationCap, href: "/dashboard/college-finder", feature: "collegeFinder", color: "text-chart-4" },
];

const eliteTiles = [
    ...standardTiles,
    { title: "Scholarship Finder", icon: Award, href: "/dashboard/scholarship-finder", isElite: true, feature: "scholarshipFinder", color: "text-chart-5" },
    { title: "AI Essay Review", icon: PenSquare, href: "/dashboard/essay-review", isElite: true, feature: "essayReview", color: "text-chart-1" },
    { title: "Mentor Match", icon: MessageSquare, href: "/dashboard/mentor-match", isElite: true, feature: "mentorMatch", color: "text-chart-2" },
    { title: "Q&A Forum", icon: Users, href: "/dashboard/q-and-a-forum", isElite: true, feature: "qaForum", color: "text-chart-3" },
]

const WelcomeAlert = ({onDismiss}: {onDismiss: () => void}) => {
    return (
         <Alert className="relative glass-card border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-semibold">Welcome to Your Dashboard!</AlertTitle>
            <AlertDescription className="text-primary/80">
                This is your command center. Start with your **AI Strategic Briefing** to see your most important next step, or explore your full plan in **My Roadmap**.
            </AlertDescription>
            <button onClick={onDismiss} className="absolute top-2 right-2 p-1">
                <X className="h-4 w-4 text-primary/60 hover:text-primary"/>
            </button>
        </Alert>
    )
}

const KeyStats = () => {
    const [stats, setStats] = useState({ completed: 0, points: 0 });

    useEffect(() => {
        const email = localStorage.getItem('signupData') ? JSON.parse(localStorage.getItem('signupData')!).email : null;
        if (email) {
            const tasksStr = localStorage.getItem(`roadmapTasks-${email}`);
            if (tasksStr) {
                const tasks: RoadmapTask[] = JSON.parse(tasksStr);
                const completedTasks = tasks.filter(t => t.completed);
                const totalPoints = completedTasks.reduce((sum, task) => sum + (task.points || 0), 0);
                setStats({ completed: completedTasks.length, points: totalPoints });
            }
        }
    }, []);
    
    return (
         <Card className="glass-card">
            <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-4xl font-bold text-chart-1">{stats.completed}</p>
                    <p className="text-xs text-muted-foreground">Tasks Done</p>
                </div>
                 <div>
                    <p className="text-4xl font-bold text-chart-2">{stats.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Points Earned</p>
                </div>
            </CardContent>
        </Card>
    );
};

const QuickLinks = ({ plan }: { plan: 'standard' | 'elite' }) => {
    const tiles = plan === 'elite' ? eliteTiles : standardTiles;
    
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="text-lg">Your Toolkit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {tiles.map(tile => (
                    <Link 
                        href={tile.href} 
                        key={tile.title}
                        onClick={() => trackFeatureUsage(tile.feature)}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors group"
                    >
                         <div className={cn(
                            "p-2 rounded-md transition-colors bg-opacity-10",
                             `bg-[${tile.color.replace('text-','hsl(var(--'))}] text-[${tile.color.replace('text-','hsl(var(--'))}]`
                        )}>
                            <tile.icon className={cn("w-5 h-5", tile.color)} />
                        </div>
                        <div>
                             <p className="font-semibold text-sm">{tile.title}</p>
                             {tile.isElite && <p className="text-xs text-yellow-400/80">Elite</p>}
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
};


export default function DashboardPage() {
    const [userPlan, setUserPlan] = useState<'standard' | 'elite'>('standard');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showWelcome, setShowWelcome] = useState(false);
    const router = useRouter();


    useEffect(() => {
        const plan = localStorage.getItem('userPlan') as 'standard' | 'elite' | null;
        if (plan) {
            setUserPlan(plan);
        }
        
        const signupDataStr = localStorage.getItem('signupData');
        if (signupDataStr) {
            try {
                const signupData = JSON.parse(signupDataStr);
                if(signupData.email === 'admin@dymera.com') {
                    setIsAdmin(true);
                    router.replace('/dashboard/admin');
                    return;
                }
            } catch (e) {
                console.error("Error parsing signupData", e)
            }
        }

        const hasBeenWelcomed = localStorage.getItem('hasBeenWelcomed');
        if (!hasBeenWelcomed) {
            setShowWelcome(true);
        }

        setLoading(false);
    }, [router]);
    
    const handleDismissWelcome = () => {
        setShowWelcome(false);
        localStorage.setItem('hasBeenWelcomed', 'true');
    }

    if (loading || isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

  return (
    <div className="space-y-8">
      <DashboardHeader />
      
      {showWelcome && <WelcomeAlert onDismiss={handleDismissWelcome} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             <div className="lg:col-span-2 space-y-6">
                <Suspense fallback={<Skeleton className="h-96 w-full glass-card" />}>
                    <SuggestionView />
                </Suspense>
             </div>
             <div className="lg:col-span-1 space-y-6">
                 <KeyStats />
                 <QuickLinks plan={userPlan} />
             </div>
        </div>

    </div>
  );
}
