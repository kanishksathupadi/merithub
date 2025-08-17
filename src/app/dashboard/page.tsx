
"use client";

import { Suspense, useEffect, useState } from "react";
import { suggestNextStep, type SuggestNextStepInput, type SuggestNextStepOutput } from "@/ai/flows/suggest-next-step";
import { NextStepCard } from "@/components/dashboard/next-step-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ListChecks, MessageSquare, TrendingUp, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { v4 as uuidv4 } from 'uuid';
import type { RoadmapTask } from "@/lib/types";

async function fetchSuggestion(input: SuggestNextStepInput) {
    try {
        const result = await suggestNextStep(input);
        return result;
    } catch (error) {
        console.error("Failed to fetch suggestion:", error);
        return null;
    }
}

function generateTasksFromSuggestion(suggestion: any): RoadmapTask[] {
    const tasks: RoadmapTask[] = [];
    if (!suggestion || !suggestion.plan) return tasks;

    suggestion.plan.forEach((planItem: any) => {
        const createTasks = (items: string | string[], category: RoadmapTask['category']) => {
            const itemsArray = Array.isArray(items) ? items : [items];
            itemsArray.forEach(item => {
                if (typeof item !== 'string') return;
                const [title, ...descriptionParts] = item.split(':');
                const description = descriptionParts.join(':').trim();
                tasks.push({
                    id: uuidv4(),
                    title: title.trim(),
                    description: description || `Complete the task: ${title.trim()}`,
                    category,
                    grade: planItem.grade,
                    completed: false,
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSuggestion = async () => {
            const cachedSuggestion = localStorage.getItem('aiSuggestion');
            if (cachedSuggestion) {
                setSuggestion(JSON.parse(cachedSuggestion));
                setLoading(false);
                return;
            }

            const onboardingDataStr = localStorage.getItem('onboardingData');
            const signupDataStr = localStorage.getItem('signupData');

            if (onboardingDataStr && signupDataStr) {
                const onboardingData = JSON.parse(onboardingDataStr);
                const signupData = JSON.parse(signupDataStr);
                const result = await fetchSuggestion({ ...onboardingData, grade: signupData.grade });
                setSuggestion(result);

                if (result) {
                    localStorage.setItem('aiSuggestion', JSON.stringify(result));
                    const tasks = generateTasksFromSuggestion(result);
                    if (localStorage.getItem('roadmapTasks') === null) {
                        localStorage.setItem('roadmapTasks', JSON.stringify(tasks));
                         // Dispatch storage event to notify other components
                        window.dispatchEvent(new Event('storage'));
                    }
                }
            }
            setLoading(false);
        };

        getSuggestion();
    }, []);

    if (loading) {
        return <Skeleton className="h-64 w-full" />;
    }

    if (!suggestion) {
        return <Card><CardContent className="pt-6"><p>Failed to load your strategic plan. Please try refreshing the page.</p></CardContent></Card>;
    }

    return <NextStepCard suggestion={suggestion} />;
}

const standardTiles = [
    { title: "My Roadmap", description: "View your personalized tasks.", icon: ListChecks, href: "/dashboard/roadmap" },
    { title: "Progress Tracker", description: "Visualize your achievements.", icon: TrendingUp, href: "/dashboard/progress" },
    { title: "Study Resources", description: "Find guides and materials.", icon: BookOpen, href: "/dashboard/study-resources" },
];

const eliteTiles = [
    ...standardTiles,
    { title: "Mentor Match", description: "Connect with experienced mentors.", icon: MessageSquare, href: "/dashboard/mentor-match" },
    { title: "Q&A Forum", description: "Ask questions and get answers.", icon: Users, href: "/dashboard/q-and-a-forum" },
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
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <SuggestionView />
        </Suspense>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Your Dashboard</h2>
            <Button variant="ghost">View All <ArrowRight className="w-4 h-4 ml-2"/></Button>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
            {dashboardTiles.map((tile) => (
                <Link href={tile.href} key={tile.title}>
                    <Card className="hover:border-primary/50 hover:bg-primary/5 transition-colors h-full">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
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
