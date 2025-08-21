
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, CheckCircle, ArrowRight, Link as LinkIcon, Sparkles, Loader2 } from "lucide-react";
import type { RoadmapTask } from "@/lib/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { addNotification } from "@/lib/tracking";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";


type NextStepCardProps = {
  tasks: RoadmapTask[];
  onTaskToggle: (taskId: string) => void;
};

const getCategoryColor = (category: RoadmapTask['category']) => {
    switch(category) {
        case 'Academics': return 'bg-blue-500';
        case 'Extracurriculars': return 'bg-green-500';
        case 'Skill Building': return 'bg-yellow-500';
        default: return 'bg-gray-500';
    }
}

export function NextStepCard({ tasks, onTaskToggle }: NextStepCardProps) {
    const [isCompleting, setIsCompleting] = useState(false);
    const nextTask = tasks.find(task => !task.completed);

    const handleComplete = () => {
        if (!nextTask) return;
        setIsCompleting(true);
        addNotification({
            title: "Task Completed!",
            description: `You earned ${nextTask.points || 10} points for "${nextTask.title}".`
        });
        
        setTimeout(() => {
            onTaskToggle(nextTask.id);
            setIsCompleting(false);
        }, 500); // Wait for animation
    }
  
    if (!nextTask) {
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
  
    const resource = nextTask.relatedResources && nextTask.relatedResources[0];

    return (
        <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 overflow-hidden">
        <AnimatePresence mode="wait">
            <motion.div
                key={nextTask.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Lightbulb className="text-primary w-6 h-6" />
                                Your Next Step
                            </CardTitle>
                        </div>
                        <Badge variant="outline">
                            <span className={`w-2 h-2 mr-2 rounded-full ${getCategoryColor(nextTask.category)}`}></span>
                            {nextTask.category}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-background/50">
                        <h3 className="font-bold text-lg text-primary">{nextTask.title}</h3>
                        <p className="text-muted-foreground mt-1">{nextTask.description}</p>
                    </div>
                    
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
                        {isCompleting ? <Loader2 className="animate-spin"/> : <><CheckCircle className="mr-2 h-5 w-5" /> Mark as Complete</>}
                    </Button>
                </CardContent>
            </motion.div>
        </AnimatePresence>
        </Card>
    );
}
