
"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateStudyGuide, type GenerateStudyGuideOutput } from "@/ai/flows/generate-study-guide";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, HelpCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { PracticeQuiz } from '@/components/dashboard/practice-quiz';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const generationSchema = z.object({
  numQuestions: z.number().min(1).max(100),
});

function PracticeQuizGenerator() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const topic = searchParams.get('topic');

    const [studyGuide, setStudyGuide] = useState<GenerateStudyGuideOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generationForm = useForm<z.infer<typeof generationSchema>>({
        resolver: zodResolver(generationSchema),
        defaultValues: { numQuestions: 5 },
    });

    if (!topic) {
        router.push('/dashboard/study-resources');
        return <div className="text-center p-8">No topic specified. Redirecting...</div>;
    }

    const handleGeneration = async (values: z.infer<typeof generationSchema>) => {
        setLoading(true);
        setError(null);
        try {
            const result = await generateStudyGuide({ topic, numConcepts: 0, numQuestions: values.numQuestions });
            setStudyGuide(result);
        } catch (err) {
            console.error("AI generation failed:", err);
            setError("Sorry, we couldn't generate a practice quiz for that topic. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center gap-6">
                <div className="text-center space-y-2">
                    <p className="font-semibold text-primary">Generating your quiz...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment.</p>
                </div>
                 <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
            </div>
        );
    }
    
    if (error) {
         return (
            <Alert variant="destructive">
                <AlertTitle>Generation Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button onClick={() => setError(null)} className="mt-4">Try Again</Button>
            </Alert>
        );
    }
    
    if (!studyGuide) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Customize Your Practice Quiz</CardTitle>
                    <CardDescription>You're creating a quiz for: <span className="font-bold text-primary">{topic}</span></CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...generationForm}>
                        <form onSubmit={generationForm.handleSubmit(handleGeneration)} className="space-y-8">
                            <FormField
                                control={generationForm.control}
                                name="numQuestions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-between">
                                            <span>Number of Practice Questions</span>
                                            <span className="text-primary font-bold">{field.value}</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Slider
                                                min={1}
                                                max={100}
                                                step={1}
                                                value={[field.value]}
                                                onValueChange={(vals) => field.onChange(vals[0])}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                <Sparkles className="w-4 h-4 mr-2"/>
                                Generate Quiz
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        );
    }

     if (!studyGuide.practiceQuestions || studyGuide.practiceQuestions.length === 0) {
        return (
             <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold">No practice questions were generated.</h2>
                <p>Try generating again with a different topic or number of questions.</p>
                 <Button onClick={() => setStudyGuide(null)}>Try Again</Button>
            </div>
        )
    }

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2"><HelpCircle/> Practice Quiz: {studyGuide.title}</h1>
                <p className="text-muted-foreground mt-1">{studyGuide.introduction}</p>
            </div>
            <PracticeQuiz studyGuide={studyGuide} onRestart={() => setStudyGuide(null)} />
        </>
    );
}


export default function PracticeQuizPage() {
    return (
        <div className="space-y-8">
            <header>
                <Button variant="ghost" asChild>
                    <Link href="/dashboard/study-resources">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Buddy
                    </Link>
                </Button>
            </header>
            <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
                <PracticeQuizGenerator />
            </Suspense>
        </div>
    );
}
