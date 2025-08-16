
import { Suspense } from "react";
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
    { title: "Mentor Match", description: "Connect with experienced mentors.", icon: MessageSquare, href: "/dashboard/mentor-match" },
    { title: "Study Resources", description: "Find guides and materials.", icon: BookOpen, href: "/dashboard/study-resources" },
    { title: "Q&A Forum", description: "Ask questions and get answers.", icon: Users, href: "/dashboard/q-and-a-forum" },
]

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

async function SuggestionView() {
    // This is a server component, so we can't use localStorage directly.
    // In a real app, this data would come from a database.
    // For now, we will call the AI every time, which might be slow.
    // A more advanced implementation would use caching or a database.
    
    const dataToSuggest: SuggestNextStepInput = {
        ...mockOnboardingData,
        grade: 10 // Mock grade
    };

    try {
        const result = await suggestNextStep(dataToSuggest);
        // We can't save to localStorage here, but we can pass tasks to a client component
        // which can then save them.
        const tasks = generateTasksFromSuggestion(result);
        
        // This is a simplified approach. In a real app, you'd likely want to avoid
        // passing large data blobs as props and would have a more robust
        // state management solution for client-side task storage.
        return <NextStepCard suggestion={result} />;

    } catch (error) {
        console.error("Failed to fetch suggestion:", error);
        return <Card><CardContent><p>Failed to load suggestion. Please try again later.</p></CardContent></Card>;
    }
}


export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <section>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <SuggestionView />
        </Suspense>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Your Dashboard</h2>
            <Button variant="ghost">View All <ArrowRight className="w-4 h-4 ml-2"/></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {dashboardTiles.map((tile) => (
                <Link href={tile.href} key={tile.title}>
                    <Card className="hover:border-primary/50 hover:bg-primary/5 transition-colors h-full">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                <tile.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">{tile.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <CardDescription>{tile.description}</CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
