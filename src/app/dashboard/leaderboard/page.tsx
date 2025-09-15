
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star } from "lucide-react";
import type { RoadmapTask } from "@/lib/types";
import { getAllUsersForAdmin } from "@/lib/data";

interface LeaderboardUser {
    name: string;
    avatar: string; // Fallback letter
    avatarUrl?: string;
    points: number;
}

const calculateUserPoints = (tasks: RoadmapTask[]): number => {
    return tasks
        .filter(task => task.completed && task.points)
        .reduce((sum, task) => sum + (task.points || 0), 0);
};


export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

    useEffect(() => {
        const getLeaderboardData = async () => {
             try {
                const allUsers = await getAllUsersForAdmin();

                const usersWithPoints = allUsers.map((user: any) => {
                    const tasks: RoadmapTask[] = user.tasks || [];
                    const points = calculateUserPoints(tasks);
                    const avatarFallback = user.name ? user.name.charAt(0).toUpperCase() : 'U';

                    return {
                        name: user.name,
                        avatar: avatarFallback,
                        // In a real app, avatarUrl would be part of the user object.
                        // For this prototype, we'll leave it undefined.
                        avatarUrl: undefined, 
                        points: points,
                    };
                });

                // Sort users by points in descending order
                setLeaderboard(usersWithPoints.sort((a, b) => b.points - a.points));
            } catch (error) {
                console.error("Failed to build leaderboard:", error);
                setLeaderboard([]);
            }
        };

        getLeaderboardData();
    }, []);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Leaderboard</h1>
                <p className="text-muted-foreground">See how you stack up against other students on the path to success.</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="text-yellow-400" />
                        Top Performers
                    </CardTitle>
                    <CardDescription>
                        Points are earned by completing AI-generated tasks from your Action Plan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Rank</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="text-right">Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboard.map((user, index) => (
                                <TableRow key={user.name + index}>
                                    <TableCell className="font-bold text-lg text-center">{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatarUrl} />
                                                <AvatarFallback>{user.avatar}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-lg flex items-center justify-end gap-1">
                                        <Star className="w-4 h-4 text-yellow-400" />
                                        {user.points.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
