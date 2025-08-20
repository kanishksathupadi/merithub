
"use client";

import { Suspense, useEffect, useState } from "react";
import { suggestNextStep, type SuggestNextStepInput, type SuggestNextStepOutput } from "@/ai/flows/suggest-next-step";
import { DailyGoalCard } from "@/components/dashboard/daily-goal-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ListChecks, MessageSquare, TrendingUp, Users, Star, GraduationCap, PenSquare, Trophy } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { v4 as uuidv4 } from 'uuid';
import type { RoadmapTask } from "@/lib/types";
import { cn } from "@/lib/utils";
import { trackFeatureUsage } from "@/lib/tracking";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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

    useEffect(() => {
        const getSuggestionAndTasks = async () => {
            const cachedSuggestion = localStorage.getItem('aiSuggestion');
            const cachedTasks = localStorage.getItem('roadmapTasks');
            
            if (cachedSuggestion && cachedTasks) {
                try {
                    setTasks(JSON.parse(cachedTasks));
                } catch (error) {
                    console.error("Failed to parse cached data from localStorage", error);
                    localStorage.removeItem('aiSuggestion');
                    localStorage.removeItem('roadmapTasks');
                } finally {
                    setLoading(false);
                    return;
                }
            }

            const onboardingDataStr = localStorage.getItem('onboardingData');
            const signupDataStr = localStorage.getItem('signupData');

            if (onboardingDataStr && signupDataStr) {
                const onboardingData = JSON.parse(onboardingDataStr);
                const signupData = JSON.parse(signupDataStr);
                const result = await fetchSuggestion({ ...onboardingData, grade: signupData.grade });
                
                if (result) {
                    localStorage.setItem('aiSuggestion', JSON.stringify(result));
                    const newTasks = generateTasksFromSuggestion(result);
                    setTasks(newTasks);
                    localStorage.setItem('roadmapTasks', JSON.stringify(newTasks));
                    window.dispatchEvent(new Event('storage'));
                }
            }
            setLoading(false);
        };

        getSuggestionAndTasks();
    }, []);
    
    useEffect(() => {
        const handleStorageChange = () => {
            const storedTasks = localStorage.getItem('roadmapTasks');
            if (storedTasks) {
                try {
                    setTasks(JSON.parse(storedTasks));
                } catch (error) {
                    console.error("Failed to parse tasks from localStorage on storage event", error);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (loading) {
        return <Skeleton className="h-48 w-full" />;
    }

    if (tasks.length === 0) {
        return <Card><CardContent className="pt-6"><p>Failed to load your strategic plan. Please try refreshing the page.</p></CardContent></Card>;
    }
    
    const nextTask = tasks.find(task => !task.completed);

    return <DailyGoalCard nextTask={nextTask} />;
}

const standardTiles = [
    { title: "My Roadmap", description: "View your personalized tasks.", icon: ListChecks, href: "/dashboard/roadmap", feature: "myRoadmap" },
    { title: "Progress Tracker", description: "Visualize your achievements.", icon: TrendingUp, href: "/dashboard/progress", feature: "progressTracker" },
    { title: "AI Study Buddy", description: "Generate guides and quizzes.", icon: BookOpen, href: "/dashboard/study-resources", feature: "aiStudyBuddy" },
    { title: "College Finder", description: "Discover colleges that fit you.", icon: GraduationCap, href: "/dashboard/college-finder", feature: "collegeFinder" },
];

const eliteTiles = [
    ...standardTiles,
    { title: "AI Essay Review", description: "Get feedback on your essays.", icon: PenSquare, href: "/dashboard/essay-review", isElite: true, feature: "essayReview" },
    { title: "Mentor Match", description: "Connect with experienced mentors.", icon: MessageSquare, href: "/dashboard/mentor-match", isElite: true, feature: "mentorMatch" },
    { title: "Q&A Forum", description: "Ask questions and get answers.", icon: Users, href: "/dashboard/q-and-a-forum", isElite: true, feature: "qaForum" },
]


export default function DashboardPage() {
    const [userPlan, setUserPlan] = useState<'standard' | 'elite'>('standard');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
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
                }
            } catch (e) {
                console.error("Error parsing signupData", e)
            }
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
    const gridCols = userPlan === 'elite' ? 'lg:grid-cols-3' : 'lg:grid-cols-2';

  return (
    <div className="space-y-8">
      <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold mb-4">Today's Goal</h2>
                <Suspense fallback={<Skeleton className="h-48 w-full" />}>
                    <SuggestionView />
                </Suspense>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Community Spotlight</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                <Trophy/>
                            </div>
                            <div>
                                <p className="font-semibold">Weekly Challenge</p>
                                <p className="text-sm text-muted-foreground">Complete 5 tasks to earn a badge!</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Dashboard</h2>
         <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-4",
            gridCols
         )}>
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
