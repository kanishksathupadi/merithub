
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ListChecks, Star, Trophy, Activity, BrainCircuit } from "lucide-react";
import { useEffect, useState } from "react";
import type { RoadmapTask } from "@/lib/types";

export function ProgressView() {
    const [tasks, setTasks] = useState<RoadmapTask[]>([]);

    useEffect(() => {
        const storedTasks = localStorage.getItem('roadmapTasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
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

      <div className="grid md:grid-cols-2 gap-4 text-center">
        <Card>
            <CardHeader><CardTitle className="flex items-center justify-center gap-2"><CheckCircle className="text-green-500"/>Completed Tasks</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold">{completedTasks}</p></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="flex items-center justify-center gap-2"><ListChecks className="text-blue-500"/>Total Tasks</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold">{totalTasks}</p></CardContent>
        </Card>
      </div>

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
