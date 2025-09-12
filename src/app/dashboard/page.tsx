
"use client";

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { suggestNextStep, type SuggestNextStepInput, type SuggestNextStepOutput } from "@/ai/flows/suggest-next-step";
import { updateStudentPlan } from "@/ai/flows/update-student-plan";
import { getStrategicBriefing, type StrategicBriefingOutput } from "@/ai/flows/get-strategic-briefing";
import { NextStepCard } from "@/app/dashboard/next-step-card";
import { CheckInCard } from "@/components/dashboard/check-in-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ListChecks, MessageSquare, TrendingUp, Users, Star, GraduationCap, PenSquare, Award, CheckCircle, X, Info, Trophy } from "lucide-react";
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
import { updateUser } from "@/lib/data-client";


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
                    requiresProof: item.requiresProof,
                });
            });
        };

        createTasks(planItem.academics, 'Academics');
        createTasks(planItem.extracurriculars, 'Extracurriculars');
        createTasks(planItem.skillBuilding, 'Skill Building');
    });
    return tasks;
}

const updateMasterUserList = (userId: string, updatedData: { tasks?: RoadmapTask[], suggestion?: SuggestNextStepOutput }) => {
  if (typeof window === 'undefined') return;
  try {
    const allUsersStr = localStorage.getItem('allSignups');
    if (allUsersStr) {
      let allUsers = JSON.parse(allUsersStr);
      allUsers = allUsers.map((user: any) => {
        if (user.userId === userId) {
          return { ...user, ...updatedData };
        }
        return user;
      });
      localStorage.setItem('allSignups', JSON.stringify(allUsers));
    }
  } catch(e) {
    console.error("Failed to update master user list:", e);
  }
};


function SuggestionView() {
    const [tasks, setTasks] = useState<RoadmapTask[]>([]);
    const [briefing, setBriefing] = useState<StrategicBriefingOutput | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCheckIn, setShowCheckIn] = useState(false);
    const { toast } = useToast();

    const currentUser = useMemo(() => {
        if (typeof window === 'undefined') return null;
        const signupDataStr = localStorage.getItem('signupData');
        try {
            return signupDataStr ? JSON.parse(signupDataStr) : null;
        } catch {
            return null;
        }
    }, []);

    const loadTasksAndBriefing = useCallback(async () => {
        if (!currentUser) return;
        
        const allUsersStr = localStorage.getItem('allSignups');
        const allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];
        const userData = allUsers.find((u: any) => u.userId === currentUser.userId);
        
        const currentTasks: RoadmapTask[] = userData?.tasks || [];
        setTasks(currentTasks);
        
        if (currentTasks.length > 0) {
            try {
                const briefingResult = await getStrategicBriefing({ plan: currentTasks });
                setBriefing(briefingResult);
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
    }, [currentUser, toast]);


    const saveTasks = useCallback(async (tasksToSave: RoadmapTask[], suggestion?: SuggestNextStepOutput) => {
         if (!currentUser) return;
        const updatedUser = { ...currentUser, tasks: tasksToSave, suggestion };
        await updateUser(updatedUser);
        setTasks(tasksToSave);
        await loadTasksAndBriefing();
    }, [currentUser, loadTasksAndBriefing]);

    useEffect(() => {
        const getSuggestionAndTasks = async () => {
            setLoading(true);
            if (!currentUser) {
                setLoading(false);
                return;
            };

            const allUsersStr = localStorage.getItem('allSignups');
            const allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];
            const userData = allUsers.find((u: any) => u.userId === currentUser.userId);

            if (userData && userData.tasks && userData.tasks.length > 0) {
                 await loadTasksAndBriefing();
            } else {
                const onboardingData = userData?.onboardingData;
                if (onboardingData) {
                    const result = await fetchSuggestion({ ...onboardingData, grade: currentUser.grade });
                    
                    if (result) {
                        const newTasks = generateTasksFromSuggestion(result);
                        await saveTasks(newTasks, result);
                    }
                }
            }

            // Check-in card visibility logic remains the same
            const lastCheckInStr = localStorage.getItem(`lastCheckIn-${currentUser.email}`);
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
    }, [currentUser, loadTasksAndBriefing, saveTasks]);

    const handleTaskToggle = (taskId: string, proof?: string) => {
        const newTasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed, completionProof: proof };
            }
            return task;
        });
        saveTasks(newTasks);
        // Manually dispatch a storage event so other components (like KeyStats) can update.
        window.dispatchEvent(new StorageEvent('storage', { key: `allSignups` }));
    };

    const handleCheckIn = async (checkInText: string) => {
        setLoading(true);
        if (!currentUser) {
             toast({ variant: "destructive", title: "Error", description: "Could not find user profile." });
             setLoading(false);
             return;
        };

        try {
            const result = await updateStudentPlan({ existingPlan: tasks, checkInText });
            const { updatedPlan } = result;

            if (updatedPlan) {
                await saveTasks(updatedPlan);
                localStorage.setItem(`lastCheckIn-${currentUser.email}`, new Date().toISOString());
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
                <Skeleton className="h-72 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        )
    }
    
    return (
        <div className="space-y-6">
             {briefing ? (
                <NextStepCard briefing={briefing} tasks={tasks} onTaskToggle={handleTaskToggle} />
             ) : (
                <Card><CardContent className="pt-6"><p>Generating your strategic plan. If this takes more than a moment, please try refreshing the page.</p></CardContent></Card>
             )}
            {showCheckIn && <CheckInCard onCheckIn={handleCheckIn} isLoading={loading} />}
        </div>
    )
}

const allTiles = [
    { title: "Action Plan", icon: ListChecks, href: "/dashboard/roadmap", feature: "myRoadmap", color: "text-chart-1" },
    { title: "Progress Tracker", icon: TrendingUp, href: "/dashboard/progress", feature: "progressTracker", color: "text-chart-2" },
    { title: "AI Study Buddy", icon: BookOpen, href: "/dashboard/study-resources", feature: "aiStudyBuddy", color: "text-chart-3" },
    { title: "College Finder", icon: GraduationCap, href: "/dashboard/college-finder", feature: "collegeFinder", color: "text-chart-4" },
    { title: "Scholarship Finder", icon: Award, href: "/dashboard/scholarship-finder", feature: "scholarshipFinder", color: "text-chart-5" },
    { title: "AI Essay Review", icon: PenSquare, href: "/dashboard/essay-review", feature: "essayReview", color: "text-chart-1" },
    { title: "Q&A Forum", icon: Users, href: "/dashboard/q-and-a-forum", feature: "qaForum", color: "text-chart-3" },
    { title: "Leaderboard", icon: Trophy, href: "/dashboard/leaderboard", feature: "leaderboard", color: "text-chart-5" },
];

const WelcomeAlert = ({onDismiss}: {onDismiss: () => void}) => {
    return (
         <Alert className="relative border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-semibold">Welcome to Your Dashboard!</AlertTitle>
            <AlertDescription className="text-primary/80">
                This is your command center. Start with your <strong>AI Strategic Briefing</strong> to see your most important next step, or explore your full plan in <strong>Action Plan</strong>.
            </AlertDescription>
            <button onClick={onDismiss} className="absolute top-2 right-2 p-1">
                <X className="h-4 w-4 text-primary/60 hover:text-primary"/>
            </button>
        </Alert>
    )
}

const KeyStats = () => {
    const [stats, setStats] = useState({ completed: 0, points: 0 });

    const calculateStats = useCallback(() => {
        if (typeof window === 'undefined') return;
        const signupDataStr = localStorage.getItem('signupData');
        if (!signupDataStr) return;
        
        try {
            const userId = JSON.parse(signupDataStr).userId;
            const allUsersStr = localStorage.getItem('allSignups');
            const allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];
            const currentUser = allUsers.find((u: any) => u.userId === userId);

            if (currentUser && currentUser.tasks) {
                const tasks: RoadmapTask[] = currentUser.tasks;
                const completedTasks = tasks.filter(t => t.completed);
                const totalPoints = completedTasks.reduce((sum, task) => sum + (task.points || 0), 0);
                setStats({ completed: completedTasks.length, points: totalPoints });
            }
        } catch(error) {
            console.error("Failed to calculate stats:", error);
        }
    }, []);

    useEffect(() => {
        calculateStats(); // Calculate on initial render

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === `allSignups`) {
                calculateStats();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [calculateStats]);
    
    return (
         <Card>
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

const QuickLinks = () => {
    const tiles = allTiles;
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Your Toolkit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                {tiles.map(tile => (
                    <Link
                        href={tile.href}
                        key={tile.title}
                        onClick={() => trackFeatureUsage(tile.feature)}
                        className="flex items-center gap-3 p-2.5 rounded-md hover:bg-muted transition-colors group"
                    >
                        <tile.icon className={cn("w-5 h-5", tile.color)} />
                        <p className="font-medium text-sm">{tile.title}</p>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
};


export default function DashboardPage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showWelcome, setShowWelcome] = useState(false);
    const router = useRouter();


    useEffect(() => {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
             <div className="space-y-6">
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                    <SuggestionView />
                </Suspense>
             </div>
             <div className="space-y-6">
                 <KeyStats />
                 <QuickLinks />
             </div>
        </div>

    </div>
  );
}
