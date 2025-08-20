
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ListChecks, Star, Trophy, Activity, BrainCircuit, Calendar, BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { RoadmapTask } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { subDays, format } from "date-fns";

// Mock data for completion timeline
const generateTimelineData = (tasks: RoadmapTask[]) => {
    const data: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
        const date = format(subDays(new Date(), i), "MMM d");
        data[date] = 0;
    }
    // This is a mock; in a real app, you'd check task completion dates.
    // For now, let's randomly assign some completions.
    const completedTasks = tasks.filter(t => t.completed);
    completedTasks.forEach((_, index) => {
        const dateKey = Object.keys(data)[index % 7];
        if (dateKey) {
            data[dateKey]++;
        }
    })

    return Object.entries(data).map(([name, completed]) => ({ name, completed }));
};


export function ProgressView() {
    const [tasks, setTasks] = useState<RoadmapTask[]>([]);
    const [timelineData, setTimelineData] = useState<any[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);

    useEffect(() => {
        const storedTasks = localStorage.getItem('roadmapTasks');
        if (storedTasks) {
            const parsedTasks: RoadmapTask[] = JSON.parse(storedTasks);
            setTasks(parsedTasks);
            setTimelineData(generateTimelineData(parsedTasks));
            
            const points = parsedTasks
                .filter(t => t.completed && t.points)
                .reduce((sum, task) => sum + (task.points || 0), 0);
            setTotalPoints(points);
        }
    }, []);

    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const getTasksByCategory = (category: RoadmapTask['category']) => tasks.filter(t => t.category === category);

    const categories: RoadmapTask['category'][] = ['Academics', 'Extracurriculars', 'Skill Building'];

    const categoryProgress = categories.map(category => {
        const categoryTasks = getTasksByCategory(category);
        const completed = categoryTasks.filter(t => t.completed).length;
        const total = categoryTasks.length;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        return {
            title: category,
            progress,
            completedSteps: completed,
            totalSteps: total,
        };
    });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>You are making great strides towards your goals!</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-4" />
          <p className="text-right mt-2 font-bold text-primary">{Math.round(overallProgress)}% Complete</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4 text-center">
        <Card>
            <CardHeader><CardTitle className="flex items-center justify-center gap-2 text-xl"><CheckCircle className="text-green-500"/>Completed Tasks</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold">{completedTasks}</p></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="flex items-center justify-center gap-2 text-xl"><ListChecks className="text-blue-500"/>Total Tasks</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold">{totalTasks}</p></CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle className="flex items-center justify-center gap-2 text-xl"><Star className="text-yellow-400"/>Points Earned</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold">{totalPoints.toLocaleString()}</p></CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart2/>Task Completion Timeline</CardTitle>
            <CardDescription>Tasks completed over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                    <Bar dataKey="completed" name="Tasks Completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity/>Category Breakdown</CardTitle>
            <CardDescription>A breakdown of your progress across different areas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {categoryProgress.map((cat, index) => (
                <div key={index}>
                    <div className="flex justify-between mb-1">
                        <p className="font-medium flex items-center gap-2">
                           {cat.title === 'Academics' && <BrainCircuit className="w-5 h-5 text-primary"/>}
                           {cat.title === 'Extracurriculars' && <Trophy className="w-5 h-5 text-primary"/>}
                           {cat.title === 'Skill Building' && <Star className="w-5 h-5 text-primary"/>}
                           {cat.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{cat.completedSteps} / {cat.totalSteps} tasks</p>
                    </div>
                    <Progress value={cat.progress} />
                </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
