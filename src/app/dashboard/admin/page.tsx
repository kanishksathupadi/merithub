
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, LineChart, Star, Crown, Settings, LogOut } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Link from "next/link";

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
    // Reads an array of all users who signed up in this browser.
    return getFromLocalStorage('allSignups', []);
}

function AdminHeader() {
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const name = localStorage.getItem('userName');
        if (name) {
            setUserName(name);
        }
    }, []);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('signupData');
            localStorage.removeItem('onboardingData');
            localStorage.removeItem('paymentComplete');
            localStorage.removeItem('userAvatar');
            localStorage.removeItem('welcomeEmailSent');
            localStorage.removeItem('aiSuggestion');
            localStorage.removeItem('roadmapTasks');
            localStorage.removeItem('forumPosts');
            localStorage.removeItem('userName');
            localStorage.removeItem('userPlan');
        }
        router.push('/');
    };

    const displayName = userName || "Admin";
    const avatarFallback = displayName.charAt(0).toUpperCase();

    return (
        <header className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Site-wide analytics and user management.</p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                            <AvatarFallback>{avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <p className="font-medium">{displayName}</p>
                            <p className="text-xs text-muted-foreground">Admin</p>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                     <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

const formatFeatureName = (name: string) => {
    if (name === 'qaForum') return 'Q&A Forum';
    if (name === 'mentorMatch') return 'Mentor Match';
    if (name === 'myRoadmap') return 'My Roadmap';
    if (name === 'progressTracker') return 'Progress Tracker';
    if (name === 'aiStudyBuddy') return 'AI Study Buddy';
    const spaced = name.replace(/([A-Z])/g, ' $1');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};


export default function AdminPage() {
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        dailyActive: 0, // This remains a mock value as tracking this is complex without a backend
        standardUsers: 0,
        eliteUsers: 0,
    });
    const [featureEngagementData, setFeatureEngagementData] = useState([]);
    const [recentSignups, setRecentSignups] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // --- User Stats ---
        const allUsers = getAllUsers();
        const standardUsers = allUsers.filter(u => u.plan === 'standard').length;
        const eliteUsers = allUsers.filter(u => u.plan === 'elite').length;
        setUserStats({
            totalUsers: allUsers.length,
            dailyActive: allUsers.length > 0 ? allUsers.length : 0, // Simplified: count all users in localstorage as active
            standardUsers,
            eliteUsers
        });

        // --- Recent Signups ---
        const signupsWithAvatars = [...allUsers].reverse().slice(0, 4).map((user: any) => ({
            ...user,
            avatar: user.name.charAt(0).toUpperCase(),
            hint: "student face", // generic hint
        }));
        setRecentSignups(signupsWithAvatars as any);

        // --- Feature Engagement ---
        const engagementData = getFromLocalStorage('featureEngagement', {});
        const chartData = Object.entries(engagementData).map(([name, usage]) => ({
            name: formatFeatureName(name), // Format name for display
            usage: usage as number,
        }));
        setFeatureEngagementData(chartData as any);
        
    }, []);

    const handleCardClick = (path: string) => {
        router.push(path);
    }


  return (
    <div className="space-y-8">
      <AdminHeader />
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => handleCardClick('/dashboard/admin/users')}>
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
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => handleCardClick('/dashboard/admin/users?plan=standard')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Standard Plans</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.standardUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => handleCardClick('/dashboard/admin/users?plan=elite')}>
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
                {recentSignups.map((user: any, index: number) => (
                  <TableRow key={`${user.email}-${index}`}>
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

    