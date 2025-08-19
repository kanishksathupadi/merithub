
"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateStudyGuide, type GenerateStudyGuideOutput } from "@/ai/flows/generate-study-guide";
import { Flashcard } from '@/components/dashboard/flashcard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const generationSchema = z.object({
  numConcepts: z.number().min(1).max(100),
});

function FlashcardsGenerator() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const topic = searchParams.get('topic');

    const [studyGuide, setStudyGuide] = useState<GenerateStudyGuideOutput | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generationForm = useForm<z.infer<typeof generationSchema>>({
        resolver: zodResolver(generationSchema),
        defaultValues: { numConcepts: 10 },
    });

    if (!topic) {
        router.push('/dashboard/study-resources');
        return <div className="text-center p-8">No topic specified. Redirecting...</div>;
    }

    const handleGeneration = async (values: z.infer<typeof generationSchema>) => {
        setLoading(true);
        setError(null);
        try {
            const result = await generateStudyGuide({ topic, numConcepts: values.numConcepts, numQuestions: 0 });
            setStudyGuide(result);
        } catch (err) {
            console.error("AI generation failed:", err);
            setError("Sorry, we couldn't generate flashcards for that topic. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <div className="flex flex-col items-center gap-6">
                <div className="text-center space-y-2">
                    <p className="font-semibold text-primary">Generating your flashcards...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment.</p>
                </div>
                <Skeleton className="w-full max-w-lg h-80" />
                <div className="flex items-center justify-between w-full max-w-lg">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-24" />
                </div>
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
                    <CardTitle>Customize Your Flashcards</CardTitle>
                    <CardDescription>You're creating flashcards for: <span className="font-bold text-primary">{topic}</span></CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...generationForm}>
                        <form onSubmit={generationForm.handleSubmit(handleGeneration)} className="space-y-8">
                            <FormField
                                control={generationForm.control}
                                name="numConcepts"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-between">
                                            <span>Number of Flashcards</span>
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
                                Generate Flashcards
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        );
    }

    const keyConcepts = studyGuide.keyConcepts || [];
     if (keyConcepts.length === 0) {
        return (
             <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold">No flashcards were generated.</h2>
                <p>Try generating again with a different topic or number of cards.</p>
                 <Button onClick={() => setStudyGuide(null)}>Try Again</Button>
            </div>
        )
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % keyConcepts.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + keyConcepts.length) % keyConcepts.length);
    };
    
    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2"><BookOpen/> Flashcards: {studyGuide.title}</h1>
                <p className="text-muted-foreground mt-1">{studyGuide.introduction}</p>
            </div>
            <div className="flex flex-col items-center gap-6">
                <Flashcard 
                    key={currentIndex}
                    term={keyConcepts[currentIndex].concept}
                    definition={keyConcepts[currentIndex].definition}
                />
                <div className="flex items-center justify-between w-full max-w-lg">
                    <Button variant="outline" onClick={goToPrevious} disabled={keyConcepts.length <= 1}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <p className="text-sm font-medium text-muted-foreground">
                        {currentIndex + 1} / {keyConcepts.length}
                    </p>
                    <Button onClick={goToNext} disabled={keyConcepts.length <= 1}>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </>
    );
}


export default function FlashcardsPage() {
    return (
        <div className="space-y-8">
            <header>
                <Button variant="ghost" asChild>
                    <Link href="/dashboard/study-resources">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to AI Study Buddy
                    </Link>
                </Button>
            </header>
             <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
                <FlashcardsGenerator />
            </Suspense>
        </div>
    );
}
