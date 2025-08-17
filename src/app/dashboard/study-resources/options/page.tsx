
"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';

function OptionsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const topic = searchParams.get('topic');

    if (!topic) {
        // This should ideally not happen if navigation is correct
        router.push('/dashboard/study-resources');
        return <div className="text-center">No topic found, redirecting...</div>;
    }

    return (
        <div className="space-y-8">
             <header>
                <Button variant="ghost" asChild>
                    <Link href="/dashboard/study-resources">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Start Over
                    </Link>
                </Button>
            </header>
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Study Topic: <span className="text-primary">{topic}</span></CardTitle>
                    <CardDescription>What would you like to generate?</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href={`/dashboard/study-resources/flashcards?topic=${encodeURIComponent(topic)}`} passHref>
                        <Card className="hover:border-primary/50 hover:bg-primary/5 transition-colors h-full flex flex-col items-center justify-center p-6 text-center">
                            <BookOpen className="w-12 h-12 text-primary mb-2" />
                            <h3 className="text-xl font-semibold">Flashcards</h3>
                            <p className="text-muted-foreground">Review key concepts</p>
                        </Card>
                    </Link>
                    <Link href={`/dashboard/study-resources/practice-quiz?topic=${encodeURIComponent(topic)}`} passHref>
                        <Card className="hover:border-primary/50 hover:bg-primary/5 transition-colors h-full flex flex-col items-center justify-center p-6 text-center">
                            <HelpCircle className="w-12 h-12 text-primary mb-2" />
                            <h3 className="text-xl font-semibold">Practice Quiz</h3>
                            <p className="text-muted-foreground">Test your knowledge</p>
                        </Card>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}

export default function OptionsPage() {
    return (
        // Suspense is required here because useSearchParams is a client-side hook
        // that needs to read from the URL after the page has loaded.
        <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
            <OptionsContent />
        </Suspense>
    );
}

