
"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { GenerateStudyGuideOutput } from "@/ai/flows/generate-study-guide";
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { PracticeQuiz } from '@/components/dashboard/practice-quiz';

export default function PracticeQuizPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const topic = searchParams.get('topic');

    const [studyGuide, setStudyGuide] = useState<GenerateStudyGuideOutput | null>(null);

    useEffect(() => {
        if (topic && typeof window !== 'undefined') {
            const storedGuide = localStorage.getItem(`studyGuide-${topic}`);
            if (storedGuide) {
                setStudyGuide(JSON.parse(storedGuide));
            } else {
                router.push('/dashboard/study-resources');
            }
        } else {
             router.push('/dashboard/study-resources');
        }
    }, [topic, router]);

    if (!studyGuide) {
        return <div className="text-center p-8">Loading quiz...</div>;
    }

    if (!studyGuide.practiceQuestions || studyGuide.practiceQuestions.length === 0) {
        return (
             <div className="space-y-8 text-center">
                 <header>
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard/study-resources">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Buddy
                        </Link>
                    </Button>
                </header>
                <h2 className="text-2xl font-bold">No practice questions available for this topic.</h2>
                <p>Try generating a new study guide with questions.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <header>
                <Button variant="ghost" asChild>
                    <Link href="/dashboard/study-resources">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Buddy
                    </Link>
                </Button>
                <div className="mt-4 text-center">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-2"><HelpCircle/> Practice Quiz: {studyGuide.title}</h1>
                    <p className="text-muted-foreground mt-1">{studyGuide.introduction}</p>
                </div>
            </header>
            
            <PracticeQuiz studyGuide={studyGuide} />
        </div>
    );
}
