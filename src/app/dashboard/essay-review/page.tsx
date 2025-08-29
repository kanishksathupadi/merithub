
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { reviewEssay, type ReviewEssayOutput } from '@/ai/flows/review-essay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Wand2, Lightbulb, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const essaySchema = z.object({
  prompt: z.string().min(10, "Please enter the full essay prompt."),
  essay: z.string().min(50, "Essay must be at least 50 characters long."),
});

const FeedbackCard = ({ title, content, icon }: { title: string, content: string, icon: React.ReactNode }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                {icon}
                <span>{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
        </CardContent>
    </Card>
);

const trackEssayReviewStat = () => {
    try {
        const stats = JSON.parse(localStorage.getItem('essayReviewStats') || '{"count": 0}');
        stats.count += 1;
        localStorage.setItem('essayReviewStats', JSON.stringify(stats));
        window.dispatchEvent(new StorageEvent('storage', { key: 'essayReviewStats' }));
    } catch (error) {
        console.error("Failed to track essay review stats:", error);
    }
};

export default function EssayReviewPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<ReviewEssayOutput | null>(null);

    const form = useForm<z.infer<typeof essaySchema>>({
        resolver: zodResolver(essaySchema),
        defaultValues: { prompt: "", essay: "" },
    });

    const onSubmit = async (values: z.infer<typeof essaySchema>) => {
        setIsLoading(true);
        setFeedback(null);
        try {
            const result = await reviewEssay(values);
            setFeedback(result);
            trackEssayReviewStat(); // Track the successful review
            toast({ title: "Feedback Generated!", description: "Your essay review is ready." });
        } catch (error) {
            console.error("Essay review failed:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "We couldn't review your essay at this time. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">AI Writing Coach</h1>
                <p className="text-muted-foreground">Get supportive, constructive feedback to strengthen your writing.</p>
            </header>

            {!feedback ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Submit Your Essay</CardTitle>
                        <CardDescription>Paste the essay prompt and your response below. Our AI coach will provide feedback to help you improve.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="prompt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Essay Prompt</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="e.g., 'Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time...'" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="essay"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Essay</FormLabel>
                                            <FormControl>
                                                <Textarea rows={15} placeholder="Paste your full essay text here." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-2" />Get Feedback</>}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                     <Alert className="bg-primary/5 border-primary/20">
                        <Wand2 className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-primary flex justify-between items-center">
                           <span>{feedback.reviewTitle}</span>
                           <Button variant="secondary" onClick={() => setFeedback(null)}>Review Another Essay</Button>
                        </AlertTitle>
                        <AlertDescription className="mt-2 text-primary/80">
                           {feedback.concludingThought}
                        </AlertDescription>
                    </Alert>
                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                        <FeedbackCard 
                            title="What's Working Well" 
                            content={feedback.whatIsWorkingWell}
                            icon={<ThumbsUp className="text-green-500"/>}
                        />
                         <FeedbackCard 
                            title="Ideas for Your Next Draft" 
                            content={feedback.ideasForNextDraft}
                            icon={<Lightbulb className="text-yellow-400"/>}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
