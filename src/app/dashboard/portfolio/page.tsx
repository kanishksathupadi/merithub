
"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, CheckCircle, Trophy, Star, ListChecks, Share2 } from "lucide-react";
import type { RoadmapTask } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { findUserById } from "@/lib/data";

interface UserData {
    userId: string;
    name: string;
    email: string;
    grade: number;
    plan: 'standard' | 'elite';
    avatarUrl?: string;
    signupTimestamp: string;
    tasks?: RoadmapTask[];
    suggestion?: {
        title: string;
        introduction: string;
    }
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

export default function MyPortfolioPage() {
    const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    
    useEffect(() => {
        const loadPortfolio = async () => {
             if (typeof window === 'undefined') {
                return;
            }

            try {
                const userStr = sessionStorage.getItem('user');
                if (!userStr) {
                    setError("Could not load your profile. Please log in again.");
                    setLoading(false);
                    return;
                }
                const sessionUser = JSON.parse(userStr);
                const user: UserData | null = await findUserById(sessionUser.userId) as UserData;
                
                if (!user) {
                     setError("Could not load your profile from the database.");
                     setLoading(false);
                     return;
                }

                const userAvatar = localStorage.getItem(`userAvatar-${user.userId}`);
                const completedTasks = (user.tasks || []).filter(t => t.completed);
                const suggestionTitle = user.suggestion?.title || "Personalized Strategic Plan";
                const suggestionIntro = user.suggestion?.introduction || "A plan for success, tailored to the student's unique strengths and goals.";

                setPortfolio({
                    user: { ...user, avatarUrl: userAvatar || undefined },
                    tasks: completedTasks,
                    suggestionTitle,
                    suggestionIntro,
                });

            } catch (e) {
                console.error("Failed to load portfolio:", e);
                setError("A problem occurred while trying to load your portfolio data.");
            } finally {
                setLoading(false);
            }
        };
        
        loadPortfolio();
    }, []);

    const handleSharePortfolio = () => {
        if (!portfolio?.user?.userId) {
            toast({ variant: "destructive", title: "Could not generate link", description: "Your User ID could not be found." });
            return;
        };
        const url = `${window.location.origin}/portfolio/${portfolio.user.userId}`;
        navigator.clipboard.writeText(url);
        toast({ title: "Portfolio link copied to clipboard!" });
    }

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
             <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4 bg-muted rounded-lg">
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
        return (
             <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4 bg-muted rounded-lg">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Error Loading Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">Could not find your user data to display.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }
    
    const { user, tasks, suggestionTitle, suggestionIntro } = portfolio;
    const avatarFallback = user.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-border">
                 <div className="flex-1">
                    <h1 className="text-4xl font-bold">Your Public Portfolio</h1>
                    <p className="text-lg text-muted-foreground">This is how your profile will appear when shared.</p>
                </div>
                <Button onClick={handleSharePortfolio}>
                    <Share2 className="w-4 h-4 mr-2"/>
                    Share My Portfolio
                </Button>
            </header>

            <div className="bg-muted p-4 sm:p-8 rounded-xl">
                 <div className="max-w-4xl mx-auto">
                    <header className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-border/50">
                        <Avatar className="w-24 h-24 text-3xl border-4 border-primary">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-4xl font-bold">{user.name}</h1>
                            <p className="text-lg text-muted-foreground">Grade {user.grade} | {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan Member</p>
                        </div>
                         <div className="ml-auto flex items-center gap-2 text-primary shrink-0">
                            <BrainCircuit className="w-6 h-6" />
                            <span className="font-bold">AI School Mentor</span>
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
                            This portfolio was generated by AI School Mentor to showcase this student's unique journey and achievements.
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
