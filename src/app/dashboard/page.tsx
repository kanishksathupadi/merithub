import { suggestNextStep, type SuggestNextStepInput } from "@/ai/flows/suggest-next-step";
import { NextStepCard } from "@/components/dashboard/next-step-card";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ListChecks, MessageSquare, TrendingUp, Users, ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// This is mock data that would normally come from the database for the logged-in user.
const mockUserData = {
    name: "Emily"
};

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

export default async function DashboardPage() {
  const suggestion = await suggestNextStep(mockOnboardingData);

  return (
    <div className="space-y-8">
       <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {mockUserData.name}!</h1>
          <p className="text-muted-foreground">Here is your personalized dashboard.</p>
        </div>
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
                <Bell className="h-5 w-5"/>
                <span className="sr-only">Notifications</span>
            </Button>
            <Avatar>
                <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" />
                <AvatarFallback>{mockUserData.name.charAt(0)}</AvatarFallback>
            </Avatar>
        </div>
      </header>

      <NextStepCard suggestion={suggestion} />

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
