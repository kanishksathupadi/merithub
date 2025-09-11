
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star } from "lucide-react";
import type { RoadmapTask } from "@/lib/types";

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

const getLeaderboardData = (): LeaderboardUser[] => {
    if (typeof window === 'undefined') return [];

    try {
        const allUsersStr = localStorage.getItem('allSignups');
        if (!allUsersStr) return [];
        
        const allUsers = JSON.parse(allUsersStr);

        // Deduplicate users by email before calculating points
        const uniqueUsers = allUsers.reduce((acc: any[], current: any) => {
            if (!acc.find(item => item.email === current.email)) {
                acc.push(current);
            }
            return acc;
        }, []);
        
        const usersWithPoints = uniqueUsers.map((user: any) => {
            const tasks: RoadmapTask[] = user.tasks || [];
            const points = calculateUserPoints(tasks);
            const avatarFallback = user.name ? user.name.charAt(0).toUpperCase() : 'U';

            return {
                name: user.name,
                avatar: avatarFallback,
                // In a real app, the avatar URL would be stored with the user object.
                // For this prototype, we can't access another session's stored avatar.
                avatarUrl: undefined, 
                points: points,
            };
        });

        // Sort users by points in descending order
        return usersWithPoints.sort((a: LeaderboardUser, b: LeaderboardUser) => b.points - a.points);
    } catch (error) {
        console.error("Failed to build leaderboard:", error);
        return [];
    }
};


export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

    useEffect(() => {
        setLeaderboard(getLeaderboardData());
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
