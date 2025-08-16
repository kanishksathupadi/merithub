import { suggestNextStep, type SuggestNextStepInput } from "@/ai/flows/suggest-next-step";
import { NextStepCard } from "@/components/dashboard/next-step-card";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ListChecks, MessageSquare, TrendingUp, Users, ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// This is mock data that would normally come from the database for the logged-in user.
const mockOnboardingData: SuggestNextStepInput = {
  gradeLevel: "11th Grade",
  academicStrengths: "Mathematics, Computer Science",
  academicWeaknesses: "Essay Writing, Public Speaking",
  careerInterests: "Artificial Intelligence research and development",
  collegeInterests: "Top-tier universities with strong CS programs like MIT or Stanford",
  preferredLearningStyle: "Kinesthetic (hands-on projects)",
  currentExtracurriculars: "Robotics club, math team",
  weeklyTimeAvailable: "10",
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
          <h1 className="text-3xl font-bold">Welcome, Alex!</h1>
          <p className="text-muted-foreground">Here is your personalized dashboard.</p>
        </div>
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
                <Bell className="h-5 w-5"/>
                <span className="sr-only">Notifications</span>
            </Button>
            <Avatar>
                <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" />
                <AvatarFallback>A</AvatarFallback>
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
