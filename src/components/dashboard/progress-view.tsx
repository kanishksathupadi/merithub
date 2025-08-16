"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ListChecks, Star, Trophy } from "lucide-react";

const progressData = {
    overallProgress: 65,
    majorGoals: [
        {
            title: "Build a Science Fair Project",
            progress: 80,
            completedSteps: 4,
            totalSteps: 5,
        },
        {
            title: "Prepare for SAT",
            progress: 50,
            completedSteps: 2,
            totalSteps: 4,
        },
        {
            title: "Launch a Community Service Project",
            progress: 25,
            completedSteps: 1,
            totalSteps: 4,
        },
    ],
    completedTasks: 12,
    skillsMastered: 4,
    competitionsWon: 1,
};

export function ProgressView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>You are making great strides towards your goals!</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressData.overallProgress} className="h-4" />
          <p className="text-right mt-2 font-bold text-primary">{progressData.overallProgress}% Complete</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4 text-center">
        <Card>
            <CardHeader><CardTitle className="flex items-center justify-center gap-2"><CheckCircle className="text-green-500"/>Completed Tasks</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold">{progressData.completedTasks}</p></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="flex items-center justify-center gap-2"><Star className="text-yellow-500"/>Skills Mastered</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold">{progressData.skillsMastered}</p></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="flex items-center justify-center gap-2"><Trophy className="text-accent"/>Competitions Won</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold">{progressData.competitionsWon}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListChecks/>Major Goal Progress</CardTitle>
            <CardDescription>A breakdown of your progress on significant milestones.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {progressData.majorGoals.map((goal, index) => (
                <div key={index}>
                    <div className="flex justify-between mb-1">
                        <p className="font-medium">{goal.title}</p>
                        <p className="text-sm text-muted-foreground">{goal.completedSteps} / {goal.totalSteps} steps</p>
                    </div>
                    <Progress value={goal.progress} />
                </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
