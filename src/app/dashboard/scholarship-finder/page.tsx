
"use client";

import React, { useState, useEffect } from 'react';
import { findScholarships } from '@/ai/flows/find-scholarships';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Award, Loader2, Sparkles, Calendar, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { FindScholarshipsOutput, FindScholarshipsInput } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


const trackScholarshipStat = (scholarshipsFound: FindScholarshipsOutput) => {
    try {
        const count = scholarshipsFound.scholarships.length;
        if (count > 0) {
            const stats = JSON.parse(localStorage.getItem('scholarshipFinderStats') || '{"count": 0}');
            stats.count += count;
            localStorage.setItem('scholarshipFinderStats', JSON.stringify(stats));
            window.dispatchEvent(new StorageEvent('storage', { key: 'scholarshipFinderStats' }));
        }
    } catch (error) {
        console.error("Failed to track scholarship finder stats:", error);
    }
};

export default function ScholarshipFinderPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<FindScholarshipsOutput | null>(null);
    const [studentProfile, setStudentProfile] = useState<FindScholarshipsInput | null>(null);

    useEffect(() => {
        // Automatically load the user's profile from localStorage on component mount.
        const onboardingDataStr = localStorage.getItem('onboardingData');
        const signupDataStr = localStorage.getItem('signupData');

        if (onboardingDataStr && signupDataStr) {
            const onboardingData = JSON.parse(onboardingDataStr);
            const signupData = JSON.parse(signupDataStr);
            
            // Map the existing data to the format expected by the scholarship AI.
            setStudentProfile({
                academicProfile: `Strengths: ${onboardingData.academicStrengths}. Weaknesses: ${onboardingData.academicWeaknesses}.`,
                extracurriculars: onboardingData.currentExtracurriculars,
                interests: onboardingData.subjectsOfInterest,
                background: `Grade ${signupData.grade}. Learning Style: ${onboardingData.preferredLearningStyle}. College Environment: ${onboardingData.collegeEnvironment}.`,
            });
        } else {
             toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load your profile. Please complete onboarding first.",
            });
        }
    }, [toast]);

    const handleFindScholarships = async () => {
        if (!studentProfile) {
             toast({ variant: "destructive", title: "Missing Profile", description: "Your student profile is not available." });
             return;
        }
        setIsLoading(true);
        setResults(null);
        try {
            const result = await findScholarships(studentProfile);
            setResults(result);
            trackScholarshipStat(result);
             toast({
                title: "Matches Found!",
                description: "We've found scholarships tailored to your profile.",
            });
        } catch (error) {
            console.error("Scholarship finder failed:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "We couldn't find scholarships at this time. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">AI Scholarship Finder</h1>
                <p className="text-muted-foreground">Discover financial aid opportunities tailored to your unique profile.</p>
            </header>

            <Alert>
                <Award className="h-4 w-4" />
                <AlertTitle>Ready to Find Scholarships?</AlertTitle>
                <AlertDescription>
                    We'll use the information from your onboarding profile to find the best matches. Click the button below to start the search.
                </AlertDescription>
            </Alert>
            
            <Button onClick={handleFindScholarships} disabled={isLoading || !studentProfile} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-2" />Find Scholarships For Me</>}
            </Button>

            {isLoading && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Finding Your Matches...</h2>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-12 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {results && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Your Scholarship Matches</h2>
                    {results.scholarships.map((scholarship, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{scholarship.name}</CardTitle>
                                <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                                    <span className="font-bold text-primary">{scholarship.amount}</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> Deadline: {scholarship.deadline}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{scholarship.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild>
                                    <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                                        Learn More & Apply <ExternalLink className="ml-2"/>
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

    