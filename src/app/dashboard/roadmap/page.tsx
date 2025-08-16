import { RoadmapView } from "@/components/dashboard/roadmap-view";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Roadmap</h1>
          <p className="text-muted-foreground">Your personalized list of tasks and milestones.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
            <PlusCircle className="w-4 h-4 mr-2"/>
            Add Custom Task
        </Button>
      </header>
      <RoadmapView />
    </div>
  );
}
