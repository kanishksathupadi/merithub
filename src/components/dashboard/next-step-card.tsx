
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, CheckCircle, ArrowRight, Link as LinkIcon, Sparkles, Loader2, Target, BrainCircuit } from "lucide-react";
import type { RoadmapTask } from "@/lib/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { addNotification } from "@/lib/tracking";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { StrategicBriefingOutput } from "@/ai/flows/get-strategic-briefing";


type NextStepCardProps = {
  briefing: StrategicBriefingOutput;
  tasks: RoadmapTask[];
  onTaskToggle: (taskId: string) => void;
};

export function NextStepCard({ briefing, tasks, onTaskToggle }: NextStepCardProps) {
    const [isCompleting, setIsCompleting] = useState(false);
    
    if (!briefing || briefing.priorityMission.id === 'completed') {
        return (
            <Card className="bg-gradient-to-br from-green-500/10 via-background to-background border-green-500/20">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                    <CheckCircle className="text-green-500 w-6 h-6" />
                    All Tasks Completed!
                    </CardTitle>
                    <CardDescription className="!mt-2">
                        You've completed all the steps in your current roadmap. Great job! You can add custom tasks or wait for your plan to be updated.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard/roadmap">
                            Review Your Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    const { bigPicture, priorityMission, mentorInsight } = briefing;
    const missionTask = tasks.find(t => t.id === priorityMission.id);
    const resource = missionTask?.relatedResources?.[0];

    const handleComplete = () => {
        if (!missionTask) return;
        setIsCompleting(true);
        addNotification({
            title: "Task Completed!",
            description: `You earned ${missionTask.points || 10} points for "${missionTask.title}".`
        });
        
        setTimeout(() => {
            onTaskToggle(missionTask.id);
            setIsCompleting(false);
        }, 500); // Wait for animation
    }
  
    return (
        <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
            <motion.div
                key={priorityMission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-1"
            >
                <CardHeader>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">The Big Picture</h3>
                    </div>
                    <p className="text-foreground/90">{bigPicture}</p>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="p-4 rounded-lg bg-background/50 border border-primary/30">
                            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                                <Target className="w-5 h-5"/>
                                Your Priority Mission
                            </h3>
                            <p className="font-bold mt-2">{priorityMission.title}</p>
                            <p className="text-muted-foreground text-sm mt-1">{priorityMission.description}</p>
                        </div>

                         <div className="mt-4 p-4 rounded-lg bg-muted">
                            <h4 className="font-semibold flex items-center gap-2 text-primary/90">
                                <BrainCircuit className="w-5 h-5"/>
                                Mentor's Insight
                            </h4>
                            <p className="text-muted-foreground text-sm mt-1 italic">"{mentorInsight}"</p>
                        </div>
                    </div>
                     
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {resource && (
                                <Button asChild variant="outline">
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                        <LinkIcon className="mr-2 h-4 w-4" />
                                        View Resource
                                    </a>
                                </Button>
                            )}
                            <Button asChild variant="secondary">
                                <Link href="/dashboard/roadmap">
                                    View Full Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <Button onClick={handleComplete} disabled={isCompleting} size="lg" className="w-full !mt-6">
                            {isCompleting ? <Loader2 className="animate-spin"/> : <><CheckCircle className="mr-2 h-5 w-5" /> Complete Mission</>}
                        </Button>
                    </div>

                </CardContent>
            </motion.div>
        </AnimatePresence>
        </Card>
    );
}
