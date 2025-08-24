
"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { suggestNextStep, type SuggestNextStepInput, type SuggestNextStepOutput } from "@/ai/flows/suggest-next-step";
import { updateStudentPlan } from "@/ai/flows/update-student-plan";
import { NextStepCard } from "@/components/dashboard/next-step-card";
import { CheckInCard } from "@/components/dashboard/check-in-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ListChecks, MessageSquare, TrendingUp, Users, Star, GraduationCap, PenSquare, Trophy, Award } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { v4 as uuidv4 } from 'uuid';
import type { RoadmapTask } from "@/lib/types";
import { cn } from "@/lib/utils";
import { trackFeatureUsage } from "@/lib/tracking";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";


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
    const [loading, setLoading] = useState(true);
    const [showCheckIn, setShowCheckIn] = useState(false);
    const { toast } = useToast();

    const getEmail = () => {
         const signupDataStr = localStorage.getItem('signupData');
         if (!signupDataStr) return null;
         try {
             return JSON.parse(signupDataStr).email;
         } catch {
             return null;
         }
    }

    const loadTasks = useCallback(() => {
        const email = getEmail();
        if (!email) return [];
        const storedTasks = localStorage.getItem(`roadmapTasks-${email}`);
        if (storedTasks) {
            try {
                const parsedTasks = JSON.parse(storedTasks);
                setTasks(parsedTasks);
                return parsedTasks;
            } catch (error) {
                console.error("Failed to parse tasks from localStorage", error);
            }
        }
        return [];
    }, []);

    const saveTasks = (tasksToSave: RoadmapTask[]) => {
         const email = getEmail();
         if (!email) return;
         localStorage.setItem(`roadmapTasks-${email}`, JSON.stringify(tasksToSave));
         setTasks(tasksToSave);
         window.dispatchEvent(new Event('storage'));
    }

    useEffect(() => {
        const getSuggestionAndTasks = async () => {
            setLoading(true);
            const email = getEmail();
            if (!email) {
                setLoading(false);
                return;
            };

            const cachedSuggestion = localStorage.getItem(`aiSuggestion-${email}`);
            const currentTasks = loadTasks();
            
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
                        saveTasks(newTasks);
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
        
        const handleStorageChange = () => loadTasks();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [loadTasks]);

    const handleTaskToggle = (taskId: string) => {
        const newTasks = tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        saveTasks(newTasks);
    };

    const handleCheckIn = async (checkInText: string) => {
        setLoading(true);
        const email = getEmail();
        if (!email) {
             toast({ variant: "destructive", title: "Error", description: "Could not find user profile." });
             setLoading(false);
             return;
        };

        try {
            const result = await updateStudentPlan({ existingPlan: tasks, checkInText });
            const { updatedPlan } = result;

            if (updatedPlan) {
                saveTasks(updatedPlan);
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
            <div className="grid lg:grid-cols-2 gap-6">
                <Skeleton className="h-56 w-full" />
                <Skeleton className="h-56 w-full" />
            </div>
        )
    }
    
    return (
        <div className={cn(
            "grid gap-6 items-start",
            showCheckIn ? "lg:grid-cols-2" : "lg:grid-cols-1"
        )}>
             {tasks.length > 0 ? (
                <NextStepCard tasks={tasks} onTaskToggle={handleTaskToggle} />
             ) : (
                <Card><CardContent className="pt-6"><p>Failed to load your strategic plan. Please try refreshing the page.</p></CardContent></Card>
             )}
            {showCheckIn && <CheckInCard onCheckIn={handleCheckIn} isLoading={loading} />}
        </div>
    )
}

const standardTiles = [
    { title: "My Roadmap", description: "View your personalized tasks.", icon: ListChecks, href: "/dashboard/roadmap", feature: "myRoadmap" },
    { title: "Progress Tracker", description: "Visualize your achievements.", icon: TrendingUp, href: "/dashboard/progress", feature: "progressTracker" },
    { title: "AI Study Buddy", description: "Generate guides and quizzes.", icon: BookOpen, href: "/dashboard/study-resources", feature: "aiStudyBuddy" },
    { title: "College Finder", description: "Discover colleges that fit you.", icon: GraduationCap, href: "/dashboard/college-finder", feature: "collegeFinder" },
];

const eliteTiles = [
    ...standardTiles,
    { title: "Scholarship Finder", description: "Get AI-powered scholarship matches.", icon: Award, href: "/dashboard/scholarship-finder", isElite: true, feature: "scholarshipFinder" },
    { title: "AI Essay Review", description: "Get feedback on your essays.", icon: PenSquare, href: "/dashboard/essay-review", isElite: true, feature: "essayReview" },
    { title: "Mentor Match", description: "Connect with experienced mentors.", icon: MessageSquare, href: "/dashboard/mentor-match", isElite: true, feature: "mentorMatch" },
    { title: "Q&A Forum", description: "Ask questions and get answers.", icon: Users, href: "/dashboard/q-and-a-forum", isElite: true, feature: "qaForum" },
]


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
            localStorage.setItem('hasBeenWelcomed', 'true');
        }

        setLoading(false);
    }, [router]);

    if (loading || isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    const dashboardTiles = userPlan === 'elite' ? eliteTiles : standardTiles;

  return (
    <div className="space-y-8">
      <DashboardHeader />

      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-2xl">Welcome to Your Dashboard!</DialogTitle>
                <DialogDescription className="pt-2">
                    This is your command center for success. Here are two key places to start:
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-muted">
                    <h3 className="font-semibold text-foreground">1. Your Next Step</h3>
                    <p className="text-sm text-muted-foreground">This card shows you the very next task from your personalized plan. It's the best way to make consistent progress.</p>
                </div>
                 <div className="p-4 rounded-lg border bg-muted">
                    <h3 className="font-semibold text-foreground">2. My Roadmap</h3>
                    <p className="text-sm text-muted-foreground">Go here to see the full, long-term strategy the AI has built for you. You can see all your tasks and milestones.</p>
                </div>
            </div>
            <DialogFooter>
                <Button onClick={() => setShowWelcome(false)}>Got It!</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Your Personalized Plan</h2>
            <Suspense fallback={<Skeleton className="h-56 w-full" />}>
                <SuggestionView />
            </Suspense>
        </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Toolkit</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardTiles.map((tile) => (
                <Link 
                    href={tile.href} 
                    key={tile.title} 
                    onClick={() => trackFeatureUsage(tile.feature)}
                    className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
                >
                    <Card className={cn(
                        "hover:border-primary/50 hover:bg-primary/5 transition-colors h-full",
                         tile.isElite && "border-yellow-400/30 bg-yellow-400/5 hover:border-yellow-400/50 hover:bg-yellow-400/10"
                    )}>
                        <CardHeader className="flex flex-row items-center gap-4">
                             <div className={cn(
                                "p-3 rounded-lg",
                                tile.isElite ? "bg-yellow-400/10 text-yellow-300" : "bg-primary/10 text-primary"
                            )}>
                                <tile.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">{tile.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <CardDescription>{tile.description}</CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
