
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, CheckCircle, ArrowRight, Link as LinkIcon, Sparkles, Loader2, Target, BrainCircuit, ListChecks, Lock } from "lucide-react";
import type { RoadmapTask } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { addNotification } from "@/lib/tracking";
import { useState }from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { StrategicBriefingOutput } from "@/ai/flows/get-strategic-briefing";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


type NextStepCardProps = {
  briefing: StrategicBriefingOutput;
  tasks: RoadmapTask[];
  onTaskToggle: (taskId: string, proof?: string) => void;
};

export function NextStepCard({ briefing, tasks, onTaskToggle }: NextStepCardProps) {
    const [isCompleting, setIsCompleting] = useState(false);
    const [showProofDialog, setShowProofDialog] = useState(false);
    const [completionProof, setCompletionProof] = useState("");
    
    if (!briefing || briefing.priorityMission.id === 'completed') {
        return (
            <Card className="bg-gradient-to-br from-green-500/10 via-background to-background border-green-500/20 glass-card">
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
                            Review Your Action Plan <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    const { bigPicture, priorityMission, mentorInsight } = briefing;
    const missionTask = tasks.find(t => t.id === priorityMission.id);
    const resource = missionTask?.relatedResources?.[0];
    const requiresProof = missionTask?.requiresProof && !missionTask?.completed;

    const handleCompleteClick = () => {
        if (!missionTask || missionTask.completed) return;

        if (requiresProof) {
            setShowProofDialog(true);
        } else {
            handleComplete(missionTask.id);
        }
    }

    const handleProofSubmit = () => {
        if (!missionTask) return;
        handleComplete(missionTask.id, completionProof);
        setShowProofDialog(false);
        setCompletionProof("");
    }

    const handleComplete = (taskId: string, proof?: string) => {
        if (!missionTask || missionTask.completed) return; 
        setIsCompleting(true);
        addNotification({
            title: "Task Completed!",
            description: `You earned ${missionTask.points || 10} points for "${missionTask.title}".`
        });
        
        setTimeout(() => {
            onTaskToggle(taskId, proof);
            setIsCompleting(false);
        }, 500); // Wait for animation
    }
  
    return (
        <>
        <Card className="glass-card bg-gradient-to-br from-primary/10 via-transparent to-transparent border-primary/20 overflow-hidden flex flex-col">
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
                    <CardTitle className="text-xl flex items-center gap-2">
                         <Target className="text-primary w-6 h-6" />
                         Your Priority Mission
                    </CardTitle>
                     <CardDescription className="!mt-2">
                        Here's the most important task to focus on right now to build your unique story.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 flex flex-col">
                    <div className="flex-1 space-y-4">
                        <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                            <p className="font-bold mt-2 text-lg text-foreground">{priorityMission.title}</p>
                            <p className="text-muted-foreground text-sm mt-1">{priorityMission.description}</p>
                             {missionTask?.requiresProof && (
                                <Badge variant="outline" className="mt-2 flex items-center gap-2 w-fit border-primary/30 text-primary/80">
                                    <Lock className="w-3 h-3"/> Proof Required to Complete
                                </Badge>
                            )}
                        </div>
                        
                         <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" className="border-none">
                                <AccordionTrigger className="text-sm p-2 hover:no-underline hover:bg-white/10 rounded-md">Why is this important? View AI Insights</AccordionTrigger>
                                <AccordionContent className="pt-2 space-y-3">
                                     <div className="p-3 rounded-lg bg-black/20">
                                        <h4 className="font-semibold flex items-center gap-2 text-sm text-primary/90">
                                            <Lightbulb className="w-4 h-4"/>
                                            The Big Picture
                                        </h4>
                                        <p className="text-muted-foreground text-xs mt-1">{bigPicture}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-black/20">
                                        <h4 className="font-semibold flex items-center gap-2 text-sm text-primary/90">
                                            <BrainCircuit className="w-4 h-4"/>
                                            Mentor's Insight
                                        </h4>
                                        <p className="text-muted-foreground text-xs mt-1 italic">"{mentorInsight}"</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                    </div>
                     
                    <div className="space-y-2">
                        {resource && (
                            <Button asChild variant="outline" size="sm">
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    View Resource for Mission
                                </a>
                            </Button>
                        )}
                        <Button onClick={handleCompleteClick} disabled={isCompleting || !missionTask} size="lg" className="w-full">
                            {isCompleting ? <Loader2 className="animate-spin"/> : <><CheckCircle className="mr-2 h-5 w-5" /> Complete Mission</>}
                        </Button>
                    </div>

                </CardContent>
            </motion.div>
        </AnimatePresence>
        </Card>
        
         <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Proof of Completion</DialogTitle>
                    <DialogDescription>
                        This task requires proof. Please provide a link to your work or a brief description of the outcome.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <Label htmlFor="completion-proof">Proof</Label>
                    <Textarea
                        id="completion-proof"
                        value={completionProof}
                        onChange={(e) => setCompletionProof(e.target.value)}
                        placeholder="e.g., https://github.com/my-project or 'I presented my project at the school science fair...'"
                        rows={5}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowProofDialog(false)}>Cancel</Button>
                    <Button onClick={handleProofSubmit} disabled={!completionProof.trim()}>Submit and Complete Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
