
"use client";
import { RoadmapView } from "@/components/dashboard/roadmap-view";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function RoadmapPage() {
  // This state is to ensure the component re-renders when localStorage changes.
  const [, setUpdate] = useState(0);

  useEffect(() => {
    const handleStorageChange = () => {
      setUpdate(u => u + 1);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
