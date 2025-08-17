
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { GenerateStudyGuideOutput } from "@/ai/flows/generate-study-guide";
import { Flashcard } from '@/components/dashboard/flashcard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function FlashcardsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const topic = searchParams.get('topic');

    const [studyGuide, setStudyGuide] = useState<GenerateStudyGuideOutput | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (topic && typeof window !== 'undefined') {
            const storedGuide = localStorage.getItem(`studyGuide-${topic}`);
            if (storedGuide) {
                setStudyGuide(JSON.parse(storedGuide));
            } else {
                // If no guide is found, redirect back to the main page
                router.push('/dashboard/study-resources');
            }
        }
    }, [topic, router]);

    const keyConcepts = useMemo(() => studyGuide?.keyConcepts || [], [studyGuide]);

    if (!studyGuide) {
        return <div className="text-center p-8">Loading flashcards...</div>;
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % keyConcepts.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + keyConcepts.length) % keyConcepts.length);
    };
    
    return (
        <div className="space-y-8">
            <header>
                <Button variant="ghost" asChild>
                    <Link href="/dashboard/study-resources">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Buddy
                    </Link>
                </Button>
                <div className="mt-4 text-center">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-2"><BookOpen/> Flashcards: {studyGuide.title}</h1>
                    <p className="text-muted-foreground mt-1">{studyGuide.introduction}</p>
                </div>
            </header>
            
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
                    <Button variant="outline" onClick={goToNext} disabled={keyConcepts.length <= 1}>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
