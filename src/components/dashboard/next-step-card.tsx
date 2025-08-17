
"use client";

import type { SuggestNextStepOutput } from "@/ai/flows/suggest-next-step";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, BookOpen, User, Star, CheckCircle } from "lucide-react";
import type { RoadmapTask } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react";

type NextStepCardProps = {
  suggestion: SuggestNextStepOutput;
  userGrade: number;
};

function generateTasksFromSuggestion(suggestion: SuggestNextStepOutput): RoadmapTask[] {
    const tasks: RoadmapTask[] = [];
    suggestion.plan.forEach(planItem => {
        const createTasks = (items: string | string[], category: RoadmapTask['category']) => {
            const itemsArray = Array.isArray(items) ? items : [items];
            itemsArray.forEach(item => {
                if (typeof item !== 'string') return;
                const [title, ...descriptionParts] = item.split(':');
                const description = descriptionParts.join(':').trim();
                tasks.push({
                    id: uuidv4(),
                    title: title.trim(),
                    description: description || `Complete the task: ${title.trim()}`,
                    category,
                    grade: planItem.grade,
                    completed: false,
                });
            });
        };

        createTasks(planItem.academics, 'Academics');
        createTasks(planItem.extracurriculars, 'Extracurriculars');
        createTasks(planItem.skillBuilding, 'Skill Building');
    });
    return tasks;
}

export function NextStepCard({ suggestion, userGrade }: NextStepCardProps) {
  const ensureArray = (items: string | string[] | undefined) => {
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') return [items];
    return [];
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && suggestion) {
        if (localStorage.getItem('roadmapTasks') === null) {
            const tasks = generateTasksFromSuggestion(suggestion);
            localStorage.setItem('roadmapTasks', JSON.stringify(tasks));
        }
    }
  }, [suggestion]);

  const currentGradeString = `${userGrade}th Grade`;
  const currentPlan = suggestion.plan.find(p => p.grade.startsWith(userGrade.toString()));

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Lightbulb className="text-primary w-7 h-7" />
                    Your Next Steps for {currentGradeString}
                </CardTitle>
                <CardDescription className="mt-2">{currentPlan?.focus || suggestion.introduction}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pl-8 pr-6">
        {!currentPlan ? (
            <p className="text-muted-foreground">Your detailed plan is being prepared. In the meantime, focus on your current studies!</p>
        ) : (
            <>
                <div className="flex items-start gap-4">
                  <BookOpen className="w-5 h-5 mt-1 text-primary"/>
                  <div>
                    <h4 className="font-semibold">Academics</h4>
                    <ul className="list-none space-y-1 mt-1 text-muted-foreground">
                        {ensureArray(currentPlan.academics).map((task, i) => <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-1 text-green-500 shrink-0"/><span>{task}</span></li>)}
                    </ul>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <User className="w-5 h-5 mt-1 text-primary"/>
                  <div>
                    <h4 className="font-semibold">Extracurriculars</h4>
                    <ul className="list-none space-y-1 mt-1 text-muted-foreground">
                        {ensureArray(currentPlan.extracurriculars).map((task, i) => <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-1 text-green-500 shrink-0"/><span>{task}</span></li>)}
                    </ul>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <Star className="w-5 h-5 mt-1 text-primary"/>
                  <div>
                    <h4 className="font-semibold">Skill Building</h4>
                    <ul className="list-none space-y-1 mt-1 text-muted-foreground">
                        {ensureArray(currentPlan.skillBuilding).map((task, i) => <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-1 text-green-500 shrink-0"/><span>{task}</span></li>)}
                    </ul>
                  </div>
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
}
