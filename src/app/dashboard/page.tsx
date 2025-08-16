
"use client";

import { useEffect, useState } from "react";
import { suggestNextStep, type SuggestNextStepInput, type SuggestNextStepOutput } from "@/ai/flows/suggest-next-step";
import { NextStepCard } from "@/components/dashboard/next-step-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ListChecks, MessageSquare, TrendingUp, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import type { RoadmapTask } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

const mockOnboardingData: Omit<SuggestNextStepInput, 'grade'> = {
  academicStrengths: "Creative Writing, History",
  academicWeaknesses: "Calculus, Chemistry",
  subjectsOfInterest: "Learning about ancient civilizations, writing poetry, and maybe something in law?",
  collegeEnvironment: "A smaller liberal arts college with a strong sense of community and accessible professors.",
  preferredLearningStyle: "reading-writing",
  currentExtracurriculars: "School newspaper, debate club",
  weeklyTimeAvailable: "8",
};

const dashboardTiles = [
    { title: "My Roadmap", description: "View your personalized tasks.", icon: ListChecks, href: "/dashboard/roadmap" },
    { title: "Progress Tracker", description: "Visualize your achievements.", icon: TrendingUp, href: "/dashboard/progress" },
    { title: "Mentor Match", description: "Connect with experienced mentors.", icon: MessageSquare, href: "#" },
    { title: "Study Resources", description: "Find guides and materials.", icon: BookOpen, href: "#" },
    { title: "Q&A Forum", description: "Ask questions and get answers.", icon: Users, href: "#" },
]

function generateTasksFromSuggestion(suggestion: SuggestNextStepOutput): RoadmapTask[] {
    const tasks: RoadmapTask[] = [];
    suggestion.plan.forEach(planItem => {
        const createTasks = (items: string[] | string, category: RoadmapTask['category']) => {
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


export default function DashboardPage() {
  const [suggestion, setSuggestion] = useState<SuggestNextStepOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Adding uuid dependency for task generation
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    const getSuggestion = async () => {
      let onboardingData: Omit<SuggestNextStepInput, 'grade'> | null = null;
      let signupData: { name: string, age: number, grade: number } | null = null;
      let suggestionData: SuggestNextStepOutput | null = null;
      
      if (typeof window !== 'undefined') {
        const storedOnboardingData = localStorage.getItem('onboardingData');
        const storedSignupData = localStorage.getItem('signupData');
        const storedSuggestionData = localStorage.getItem('nextStepSuggestion');
        
        if (storedOnboardingData) {
          onboardingData = JSON.parse(storedOnboardingData);
        }
        if (storedSignupData) {
          signupData = JSON.parse(storedSignupData);
        }
        if (storedSuggestionData) {
            suggestionData = JSON.parse(storedSuggestionData);
            setSuggestion(suggestionData);
        }
      }

      // If we have a suggestion, we don't need to call the AI again.
      // We can just generate tasks and set loading to false.
      if (suggestionData) {
        if (localStorage.getItem('roadmapTasks') === null) {
            const tasks = generateTasksFromSuggestion(suggestionData);
            localStorage.setItem('roadmapTasks', JSON.stringify(tasks));
        }
        setSuggestion(suggestionData);
        setLoading(false);
        return;
      }

      const effectiveOnboardingData = onboardingData || mockOnboardingData;
      // Grade from signup is a string, needs to be a number.
      const effectiveGrade = signupData ? Number(signupData.grade) : 10;
      
      const dataToSuggest: SuggestNextStepInput = {
        ...effectiveOnboardingData,
        grade: effectiveGrade
      };

      try {
        const result = await suggestNextStep(dataToSuggest);
        setSuggestion(result);
        if (typeof window !== 'undefined') {
            localStorage.setItem('nextStepSuggestion', JSON.stringify(result));
            // Generate and save tasks right after getting the suggestion
            const tasks = generateTasksFromSuggestion(result);
            localStorage.setItem('roadmapTasks', JSON.stringify(tasks));
        }
      } catch (error) {
        console.error("Error fetching suggestion:", error);
      } finally {
        setLoading(false);
      }
    };

    getSuggestion();
  }, []);

  return (
    <div className="space-y-8">
      <DashboardHeader />

      {loading ? (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                     <div className="flex gap-4 mt-2">
                        <Skeleton className="h-10 w-36" />
                        <Skeleton className="h-10 w-36" />
                    </div>
                </div>
            </CardContent>
        </Card>
      ) : suggestion ? (
        <NextStepCard suggestion={suggestion} />
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardTiles.map((tile) => (
            <Card key={tile.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                           <tile.icon className="w-6 h-6 text-primary"/>
                           {tile.title}
                        </CardTitle>
                        <CardDescription>{tile.description}</CardDescription>
                    </div>
                     <Button variant="ghost" size="icon" asChild>
                        <Link href={tile.href}><ArrowRight className="w-5 h-5"/></Link>
                     </Button>
                </CardHeader>
            </Card>
        ))}
      </div>
    </div>
  );
}
