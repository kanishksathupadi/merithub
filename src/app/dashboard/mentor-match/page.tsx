"use client";

import { HardHat } from "lucide-react";

export default function MentorMatchPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center rounded-lg bg-muted/50 border border-dashed">
        <HardHat className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold">Work in Progress</h1>
        <p className="text-muted-foreground mt-2 max-w-sm">
            We're currently building out this feature to connect you with the best mentors. Please check back soon!
        </p>
    </div>
  );
}
