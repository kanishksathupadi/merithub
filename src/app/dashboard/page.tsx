
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

const mockOnboardingData: SuggestNextStepInput = {
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

export default function DashboardPage() {
  const [suggestion, setSuggestion] = useState<SuggestNextStepOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSuggestion = async () => {
      let onboardingData: SuggestNextStepInput | null = null;
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('onboardingData');
        if (storedData) {
          onboardingData = JSON.parse(storedData);
        }
      }
      
      // Use mock data if no real data is found
      const dataToSuggest = onboardingData || mockOnboardingData;

      try {
        const result = await suggestNextStep(dataToSuggest);
        setSuggestion(result);
      } catch (error) {
        console.error("Error fetching suggestion:", error);
        // Fallback suggestion in case of error
        setSuggestion({
            nextStep: "Explore our Study Resources",
            reasoning: "There was an issue generating your personalized next step. Please try again later."
        })
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
