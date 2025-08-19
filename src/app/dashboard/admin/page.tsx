
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, LineChart, Star, Crown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import type { ForumPost } from "@/lib/types";

// Helper to safely parse JSON from localStorage
const getFromLocalStorage = (key: string, defaultValue: any) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return defaultValue;
    }
};

const getAllUsers = () => {
    if (typeof window === 'undefined') return [];
    // This is a simplified example. A real app would have a better way to store/retrieve all users.
    // For this demo, we'll assume we can retrieve a list of signups if they were stored in an array.
    // We will simulate this by checking for a single `signupData` item.
    const signupData = getFromLocalStorage('signupData', null);
    if (signupData) {
        // In a real scenario, you'd fetch this from a database.
        // For now, we simulate a list of users based on what's available.
        // Let's create a few mock users plus the real one to make the dashboard look populated.
         const mockUsers = [
            { name: "Jessica S.", email: "jessica.s@example.com", plan: "elite" },
            { name: "Michael I.", email: "michael.i@example.com", plan: "standard" },
            { name: "Emily A.", email: "emily.a@example.com", plan: "elite" },
         ];
        const allUsers = [...mockUsers];
        // Ensure the current user isn't duplicated if their email matches a mock user
        if (!allUsers.some(u => u.email === signupData.email)) {
             allUsers.push(signupData)
        }
        return allUsers;
    }
    return [];
}


export default function AdminPage() {
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        dailyActive: 0, // This remains a mock value as tracking this is complex without a backend
        standardUsers: 0,
        eliteUsers: 0,
    });
    const [featureEngagementData, setFeatureEngagementData] = useState([]);
    const [recentSignups, setRecentSignups] = useState([]);

    useEffect(() => {
        // --- User Stats ---
        const allUsers = getAllUsers();
        const standardUsers = allUsers.filter(u => u.plan === 'standard').length;
        const eliteUsers = allUsers.filter(u => u.plan === 'elite').length;
        setUserStats({
            totalUsers: allUsers.length,
            dailyActive: allUsers.length > 0 ? 1 : 0, // Simplified: at least 1 active user if someone is logged in
            standardUsers,
            eliteUsers
        });

        // --- Recent Signups ---
        // Let's use a mock avatar generation logic for recent signups for visuals
        const signupsWithAvatars = allUsers.slice(-4).map(user => ({
            ...user,
            avatar: user.name.charAt(0).toUpperCase(),
            hint: "student face", // generic hint
        }));
        setRecentSignups(signupsWithAvatars as any);

        // --- Feature Engagement ---
        const engagementData = getFromLocalStorage('featureEngagement', {});
        const chartData = Object.entries(engagementData).map(([name, usage]) => ({
            name: name.replace(/([A-Z])/g, ' $1').trim(), // Format name for display
            usage: usage as number,
        }));
        setFeatureEngagementData(chartData as any);
        
    }, []);


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Site-wide analytics and user management.</p>
      </header>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.dailyActive.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Standard Plans</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.standardUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Elite Plans</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.eliteUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Feature Engagement</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))"
                    }}
                />
                <Legend iconSize={10} />
                <Bar dataKey="usage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSignups.map((user: any) => (
                  <TableRow key={user.email}>
                    <TableCell className="font-medium flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatarUrl} data-ai-hint={user.hint}/>
                            <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.plan === 'elite' ? 'default' : 'secondary'}
                           className={user.plan === 'elite' ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30' : ''}
                        >
                            {user.plan}
                        </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
