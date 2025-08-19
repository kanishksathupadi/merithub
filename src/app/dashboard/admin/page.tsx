
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, LineChart, Star, Crown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock Data
const userStats = {
  totalUsers: 1489,
  dailyActive: 312,
  standardUsers: 982,
  eliteUsers: 507,
};

const featureEngagementData = [
  { name: 'AI Study Buddy', usage: 4200 },
  { name: 'Roadmap', usage: 3800 },
  { name: 'Mentor Match', usage: 1500 },
  { name: 'Q&A Forum', usage: 1200 },
  { name: 'Progress', usage: 2900 },
];

const recentSignups = [
  { name: "Sarah J.", email: "sarah.j@example.com", plan: "Elite", avatar: "SJ", hint: "female student", avatarUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzdHVkZW50fGVufDB8fHx8MTc1NTU5OTY3NXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Kevin L.", email: "kevin.l@example.com", plan: "Standard", avatar: "KL", hint: "male student", avatarUrl: "https://images.unsplash.com/photo-1581005963836-8b02424b8156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxtYWxlJTIwc3R1ZGVudHxlbnwwfHx8fDE3NTU1OTk2NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Angela M.", email: "angela.m@example.com", plan: "Elite", avatar: "AM", hint: "student face", avatarUrl: "https://images.unsplash.com/photo-1628890920690-9e29d0019b9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzdHVkZW50JTIwZmFjZXxlbnwwfHx8fDE3NTU1OTk2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "David R.", email: "david.r@example.com", plan: "Standard", avatar: "DR", hint: "young man", avatarUrl: "https://images.unsplash.com/photo-1550750661-a73b4041ba43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx5b3VuZyUyMG1hbnxlbnwwfHx8fDE3NTU1OTk2Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080" },
];

export default function AdminPage() {
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
                {recentSignups.map((user) => (
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
                        <Badge variant={user.plan === 'Elite' ? 'default' : 'secondary'}
                           className={user.plan === 'Elite' ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30' : ''}
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
