
"use client";

import { Suspense, useEffect, useState } from "react";
import { suggestNextStep, type SuggestNextStepInput, type SuggestNextStepOutput } from "@/ai/flows/suggest-next-step";
import { NextStepCard } from "@/components/dashboard/next-step-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ListChecks, MessageSquare, TrendingUp, Users, Star, GraduationCap } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { v4 as uuidv4 } from 'uuid';
import type { RoadmapTask } from "@/lib/types";
import { cn } from "@/lib/utils";
import { trackFeatureUsage } from "@/lib/tracking";

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

    suggestion.plan.forEach((planItem) => {
        const createTasks = (items: any[], category: RoadmapTask['category']) => {
            items.forEach(item => {
                tasks.push({
                    id: uuidv4(),
                    title: item.title,
                    description: item.description,
                    category,
                    grade: planItem.grade,
                    completed: false,
                    relatedResources: item.resource ? [item.resource] : [],
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
    const [suggestion, setSuggestion] = useState<SuggestNextStepOutput | null>(null);
    const [tasks, setTasks] = useState<RoadmapTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSuggestionAndTasks = async () => {
            const cachedSuggestion = localStorage.getItem('aiSuggestion');
            const cachedTasks = localStorage.getItem('roadmapTasks');
            
            if (cachedSuggestion && cachedTasks) {
                setSuggestion(JSON.parse(cachedSuggestion));
                setTasks(JSON.parse(cachedTasks));
                setLoading(false);
                return;
            }

            const onboardingDataStr = localStorage.getItem('onboardingData');
            const signupDataStr = localStorage.getItem('signupData');

            if (onboardingDataStr && signupDataStr) {
                const onboardingData = JSON.parse(onboardingDataStr);
                const signupData = JSON.parse(signupDataStr);
                const result = await fetchSuggestion({ ...onboardingData, grade: signupData.grade });
                
                if (result) {
                    setSuggestion(result);
                    localStorage.setItem('aiSuggestion', JSON.stringify(result));
                    const newTasks = generateTasksFromSuggestion(result);
                    setTasks(newTasks);
                    localStorage.setItem('roadmapTasks', JSON.stringify(newTasks));
                    // Dispatch storage event to notify other components
                    window.dispatchEvent(new Event('storage'));
                }
            }
            setLoading(false);
        };

        getSuggestionAndTasks();
    }, []);
    
    // This effect listens for task updates from other components (like the roadmap page)
    useEffect(() => {
        const handleStorageChange = () => {
            const storedTasks = localStorage.getItem('roadmapTasks');
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (loading) {
        return <Skeleton className="h-48 w-full" />;
    }

    if (!suggestion || tasks.length === 0) {
        return <Card><CardContent className="pt-6"><p>Failed to load your strategic plan. Please try refreshing the page.</p></CardContent></Card>;
    }
    
    const nextTask = tasks.find(task => !task.completed);

    return <NextStepCard nextTask={nextTask} />;
}

const standardTiles = [
    { title: "My Roadmap", description: "View your personalized tasks.", icon: ListChecks, href: "/dashboard/roadmap", feature: "myRoadmap" },
    { title: "Progress Tracker", description: "Visualize your achievements.", icon: TrendingUp, href: "/dashboard/progress", feature: "progressTracker" },
    { title: "AI Study Buddy", description: "Generate guides and quizzes.", icon: BookOpen, href: "/dashboard/study-resources", feature: "aiStudyBuddy" },
];

const eliteTiles = [
    { title: "Mentor Match", description: "Connect with experienced mentors.", icon: MessageSquare, href: "/dashboard/mentor-match", isFeatured: true, feature: "mentorMatch" },
    { title: "Q&A Forum", description: "Ask questions and get answers.", icon: Users, href: "/dashboard/q-and-a-forum", isElite: true, feature: "qaForum" },
    ...standardTiles,
]


export default function DashboardPage() {
    const [userPlan, setUserPlan] = useState<'standard' | 'elite'>('standard');

    useEffect(() => {
        const plan = localStorage.getItem('userPlan') as 'standard' | 'elite' | null;
        if (plan) {
            setUserPlan(plan);
        }
    }, []);

    const dashboardTiles = userPlan === 'elite' ? eliteTiles : standardTiles;

  return (
    <div className="space-y-8">
      <DashboardHeader />

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Next Step</h2>
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <SuggestionView />
        </Suspense>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Dashboard</h2>
         <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-4",
            userPlan === 'elite' ? "lg:grid-cols-3" : "lg:grid-cols-3"
         )}>
            {dashboardTiles.map((tile: any) => (
                <Link 
                    href={tile.href} 
                    key={tile.title} 
                    onClick={() => trackFeatureUsage(tile.feature)}
                    className={cn(
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg",
                        tile.isFeatured && "lg:col-span-2"
                )}>
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
