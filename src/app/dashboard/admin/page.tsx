
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, LineChart, Star, Crown, Settings, LogOut, MessageSquareWarning, Mail, Briefcase } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getGlobalStats, getRecentSignups, getContactMessages, getJobApplications, getSupportRequests } from "@/lib/data-client-admin";

function AdminHeader() {
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            setUserName(JSON.parse(userStr).name);
        }
    }, []);

    const handleLogout = () => {
        router.push('/');
    };

    const displayName = userName || "Admin";
    const avatarFallback = displayName.charAt(0).toUpperCase();

    return (
        <header className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-foreground/80">Site-wide analytics and user management.</p>
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
                <DropdownMenuContent align="end" className="w-56 glass-card">
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
        dailyActive: 0,
    });
    const [supportRequests, setSupportRequests] = useState(0);
    const [contactMessages, setContactMessages] = useState(0);
    const [jobApplications, setJobApplications] = useState(0);
    const [featureEngagementData, setFeatureEngagementData] = useState([]);
    const [recentSignups, setRecentSignups] = useState([]);
    const router = useRouter();

    const updateAllStats = useCallback(async () => {
        try {
            const [globalStats, supportReqs, contactMsgs, jobApps, recent] = await Promise.all([
                getGlobalStats(),
                getSupportRequests(),
                getContactMessages(),
                getJobApplications(),
                getRecentSignups()
            ]);

            setUserStats({
                totalUsers: globalStats.students,
                dailyActive: globalStats.students, // Simplified for prototype
            });
            setSupportRequests(supportReqs.filter((r: any) => r.status === 'pending').length);
            setContactMessages(contactMsgs.filter((m: any) => m.status === 'New').length);
            setJobApplications(jobApps.filter((a: any) => a.status === 'New').length);

            const signupsWithAvatars = recent.map((user: any) => ({
                ...user,
                avatar: user.name.charAt(0).toUpperCase(),
                hint: "student face",
            }));
            setRecentSignups(signupsWithAvatars as any);

            // Feature engagement still uses localStorage for simplicity in this prototype
            const engagementData = JSON.parse(localStorage.getItem('featureEngagement') || '{}');
            const chartData = Object.entries(engagementData).map(([name, usage]) => ({
                name: formatFeatureName(name),
                usage: usage as number,
            }));
            setFeatureEngagementData(chartData as any);
        } catch (error) {
            console.error("Failed to fetch admin dashboard data:", error);
        }
    }, []);

    useEffect(() => {
        updateAllStats();
    }, [updateAllStats]);

    const handleCardClick = (path: string) => {
        router.push(path);
    }


  return (
    <div className="space-y-8">
      <AdminHeader />
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors glass-card" onClick={() => handleCardClick('/dashboard/admin/users')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors glass-card" onClick={() => handleCardClick('/dashboard/admin/active-users')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.dailyActive.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors glass-card" onClick={() => handleCardClick('/dashboard/admin/support-requests')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Requests</CardTitle>
            <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportRequests}</div>
          </CardContent>
        </Card>
         <Card className="cursor-pointer hover:border-primary/50 transition-colors glass-card" onClick={() => handleCardClick('/dashboard/admin/contact-messages')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactMessages}</div>
          </CardContent>
        </Card>
         <Card className="cursor-pointer hover:border-primary/50 transition-colors glass-card" onClick={() => handleCardClick('/dashboard/admin/applications')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobApplications}</div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1 lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle>Feature Engagement</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureEngagementData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{
                        backgroundColor: "hsl(var(--background) / 0.5)",
                        borderColor: "hsl(var(--border))",
                        backdropFilter: "blur(4px)",
                    }}
                    cursor={{fill: "hsl(var(--accent) / 0.3)"}}
                />
                <Legend iconSize={10} />
                <Bar dataKey="usage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSignups.map((user: any, index: number) => (
                  <TableRow key={`${user.email}-${index}`} className="border-white/10">
                    <TableCell className="font-medium flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatarUrl} data-ai-hint={user.hint}/>
                            <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
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
