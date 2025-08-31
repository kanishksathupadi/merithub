
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, CheckCircle, Trophy, BrainCircuit, Star, ListChecks } from "lucide-react";
import type { RoadmapTask } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface UserData {
    userId: string;
    name: string;
    email: string;
    grade: number;
    plan: 'standard' | 'elite';
    avatarUrl?: string;
    signupTimestamp: string;
}

interface PortfolioData {
    user: UserData | null;
    tasks: RoadmapTask[];
    suggestionTitle: string | null;
    suggestionIntro: string | null;
}

const getCategoryIcon = (category: RoadmapTask['category']) => {
    switch (category) {
        case 'Academics': return <BrainCircuit className="w-4 h-4" />;
        case 'Extracurriculars': return <Trophy className="w-4 h-4" />;
        case 'Skill Building': return <Star className="w-4 h-4" />;
        default: return <ListChecks className="w-4 h-4" />;
    }
}

export default function PortfolioPage() {
    const params = useParams();
    const userId = params.userId as string;
    const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (!userId) {
            setError("User ID not found in the URL.");
            setLoading(false);
            return;
        }

        try {
            const allUsersStr = localStorage.getItem('allSignups');
            if (!allUsersStr) {
                setError("No user data found in storage. This feature works by sharing from a device where a user is logged in.");
                setLoading(false);
                return;
            }

            const allUsers: UserData[] = JSON.parse(allUsersStr);
            const user = allUsers.find(u => u.userId === userId);

            if (!user) {
                setError("Portfolio not found. The user may not exist or the link is incorrect.");
                setLoading(false);
                return;
            }

            // Note: Avatars are stored per-session, so we can't reliably get another user's generated avatar.
            // In a real app, this URL would come from a database. For the prototype, we'll use a fallback.

            const roadmapTasksStr = localStorage.getItem(`roadmapTasks-${user.email}`);
            const roadmapTasks: RoadmapTask[] = roadmapTasksStr ? JSON.parse(roadmapTasksStr) : [];
            const completedTasks = roadmapTasks.filter(t => t.completed);

            const suggestionStr = localStorage.getItem(`aiSuggestion-${user.email}`);
            const suggestion = suggestionStr ? JSON.parse(suggestionStr) : null;
            const suggestionTitle = suggestion?.title || "Personalized Strategic Plan";
            const suggestionIntro = suggestion?.introduction || "A plan for success, tailored to the student's unique strengths and goals.";

            setPortfolio({
                user: { ...user, avatarUrl: undefined }, // Explicitly not using local avatar
                tasks: completedTasks,
                suggestionTitle,
                suggestionIntro,
            });

        } catch (e) {
            console.error("Failed to load portfolio:", e);
            setError("A problem occurred while trying to load the portfolio data.");
        } finally {
            setLoading(false);
        }

    }, [userId]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-16 w-1/2" />
                <Skeleton className="h-48 w-full" />
            </div>
        )
    }

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-muted">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Error Loading Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">{error}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }
    
    if (!portfolio || !portfolio.user) {
        return null;
    }
    
    const { user, tasks, suggestionTitle, suggestionIntro } = portfolio;
    const avatarFallback = user.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <div className="bg-muted min-h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <header className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-border">
                    <Avatar className="w-24 h-24 text-3xl border-4 border-primary">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-4xl font-bold">{user.name}</h1>
                        <p className="text-lg text-muted-foreground">Grade {user.grade} | {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan Member</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-primary shrink-0">
                        <GraduationCap className="w-6 h-6" />
                        <span className="font-bold">PinnaclePath Portfolio</span>
                    </div>
                </header>

                <main className="space-y-8 mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Strategic Plan</CardTitle>
                            <CardDescription>{suggestionTitle}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="italic text-muted-foreground">"{suggestionIntro}"</p>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Key Accomplishments</CardTitle>
                            <CardDescription>A curated list of completed tasks demonstrating growth and initiative.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {tasks.length > 0 ? (
                                <ul className="space-y-4">
                                {tasks.map(task => (
                                    <li key={task.id} className="flex items-start gap-4 p-4 border rounded-lg bg-background/50">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="font-semibold">{task.title}</p>
                                            <p className="text-sm text-muted-foreground">{task.description}</p>
                                             <Badge variant="outline" className="mt-2 flex items-center gap-2 w-fit">
                                                {getCategoryIcon(task.category)}
                                                {task.category}
                                            </Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No completed tasks to display yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <div className="text-center text-muted-foreground text-sm pt-4">
                        This portfolio was generated by PinnaclePath to showcase this student's unique journey and achievements.
                    </div>
                </main>
            </div>
        </div>
    );
}
