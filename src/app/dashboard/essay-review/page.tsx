
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { reviewEssay, type ReviewEssayOutput } from '@/ai/flows/review-essay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Loader2, Sparkles, Star, CheckCircle, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const essaySchema = z.object({
  prompt: z.string().min(10, "Please enter the full essay prompt."),
  essay: z.string().min(50, "Essay must be at least 50 characters long."),
});

const FeedbackCard = ({ title, score, feedback }: { title: string, score: number, feedback: string }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex justify-between items-center">
                <span>{title}</span>
                <span className="text-primary">{score}/100</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Progress value={score} className="mb-4 h-2" />
            <p className="text-muted-foreground">{feedback}</p>
        </CardContent>
    </Card>
);


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
                <h1 className="text-3xl font-bold">AI Essay Review</h1>
                <p className="text-muted-foreground">Get instant, detailed feedback on your college and scholarship essays.</p>
            </header>

            {!feedback ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Submit Your Essay</CardTitle>
                        <CardDescription>Paste the essay prompt and your response below.</CardDescription>
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
                                    {isLoading ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-2" />Review My Essay</>}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                     <Alert>
                        <BarChart className="h-4 w-4" />
                        <AlertTitle className="flex justify-between items-center">
                           <span>Overall Score: {feedback.overall.score}/100</span>
                           <Button variant="secondary" onClick={() => setFeedback(null)}>Review Another Essay</Button>
                        </AlertTitle>
                        <AlertDescription className="mt-2">
                           {feedback.overall.feedback}
                        </AlertDescription>
                    </Alert>
                    <div className="grid md:grid-cols-3 gap-6">
                        <FeedbackCard title="Clarity" score={feedback.clarity.score} feedback={feedback.clarity.feedback} />
                        <FeedbackCard title="Grammar" score={feedback.grammar.score} feedback={feedback.grammar.feedback} />
                        <FeedbackCard title="Structure" score={feedback.structure.score} feedback={feedback.structure.feedback} />
                    </div>
                </div>
            )}
        </div>
    );
}
