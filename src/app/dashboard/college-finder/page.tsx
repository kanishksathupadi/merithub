
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { findMatchingColleges } from '@/ai/flows/find-matching-colleges';
import { generateCollegeImage } from '@/ai/flows/generate-college-image';
import type { FindMatchingCollegesOutput, FindMatchingCollegesInput, College } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GraduationCap, Loader2, Search, Sparkles, Image as ImageIcon, Target, TrendingUp, ShieldCheck, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { differenceInDays, formatDistanceToNow, addDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const filterSchema = z.object({
  filterQuery: z.string().optional(),
});

type CollegeWithImage = College & { imageUrl?: string; imageLoading?: boolean };
type CategorizedColleges = {
    reach: CollegeWithImage[];
    target: CollegeWithImage[];
    safety: CollegeWithImage[];
}

function CollegeCard({ college }: { college: CollegeWithImage }) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
                 {college.imageUrl ? (
                    <Image
                        src={college.imageUrl}
                        alt={`An AI-generated scenic view of the ${college.name} campus`}
                        width={600}
                        height={400}
                        className="rounded-t-lg object-cover aspect-[3/2]"
                        data-ai-hint="college campus"
                    />
                 ) : (
                    <div className="relative rounded-t-lg aspect-[3/2] bg-secondary flex flex-col items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">Generating image...</p>
                        <Loader2 className="absolute top-4 right-4 animate-spin"/>
                    </div>
                 )}
            </CardHeader>
            <CardContent className="p-6">
                <CardTitle className="text-xl">{college.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{college.location}</p>
                <p className="mt-4 text-sm">{college.reasoning}</p>
            </CardContent>
        </Card>
    )
}

function CollegeCategorySection({ title, description, icon, colleges }: { title: string, description: string, icon: React.ReactNode, colleges: CollegeWithImage[] }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                {icon}
                <div>
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {colleges.map((college) => <CollegeCard key={college.name} college={college} />)}
            </div>
        </div>
    )
}


export default function CollegeFinderPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [colleges, setColleges] = useState<CategorizedColleges | null>(null);
    const [studentProfile, setStudentProfile] = useState<Omit<FindMatchingCollegesInput, 'filterQuery'> | null>(null);
    const [isLocked, setIsLocked] = useState(true);
    const [unlocksIn, setUnlocksIn] = useState("");

    useEffect(() => {
        const onboardingDataStr = localStorage.getItem('onboardingData');
        const signupDataStr = localStorage.getItem('signupData');
        if (onboardingDataStr && signupDataStr) {
            const onboardingData = JSON.parse(onboardingDataStr);
            const signupData = JSON.parse(signupDataStr);
            setStudentProfile({ ...onboardingData, grade: signupData.grade });

            const signupDate = new Date(signupData.signupTimestamp);
            const daysSinceSignup = differenceInDays(new Date(), signupDate);
            const daysToUnlock = 7;
            
            if (daysSinceSignup >= daysToUnlock) {
                setIsLocked(false);
            } else {
                const unlockDate = addDays(signupDate, daysToUnlock);
                setUnlocksIn(formatDistanceToNow(unlockDate, { addSuffix: true }));
            }
        } else {
             toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load your profile. Please complete onboarding.",
            });
        }
    }, [toast]);
    
    const startImageGeneration = useCallback(async (categorizedColleges: CategorizedColleges) => {
        const allColleges = [...categorizedColleges.reach, ...categorizedColleges.target, ...categorizedColleges.safety];

        for (const college of allColleges) {
            try {
                const result = await generateCollegeImage({ collegeName: college.name });
                setColleges(prev => {
                    if (!prev) return null;
                    const updateCategory = (cat: CollegeWithImage[]) => cat.map(c => c.name === college.name ? { ...c, imageUrl: result.imageUrl } : c);
                    return {
                        reach: updateCategory(prev.reach),
                        target: updateCategory(prev.target),
                        safety: updateCategory(prev.safety),
                    }
                });
            } catch (error) {
                console.error(`Failed to generate image for ${college.name}`, error);
                 toast({
                    variant: "destructive",
                    title: "Image Generation Failed",
                    description: `Could not create an image for ${college.name}.`,
                });
            }
        }
    }, [toast]);


    const form = useForm<z.infer<typeof filterSchema>>({
        resolver: zodResolver(filterSchema),
        defaultValues: { filterQuery: "" },
    });

    const trackCollegeStat = (collegesFound: FindMatchingCollegesOutput) => {
        try {
            const count = collegesFound.reachSchools.length + collegesFound.targetSchools.length + collegesFound.safetySchools.length;
            if (count > 0) {
                const stats = JSON.parse(localStorage.getItem('collegeFinderStats') || '{"count": 0}');
                stats.count += count;
                localStorage.setItem('collegeFinderStats', JSON.stringify(stats));
                window.dispatchEvent(new StorageEvent('storage', { key: 'collegeFinderStats' }));
            }
        } catch (error) {
            console.error("Failed to track college finder stats:", error);
        }
    };

    const onSubmit = async (values: z.infer<typeof filterSchema>) => {
        if (!studentProfile) {
             toast({ variant: "destructive", title: "Missing Profile", description: "Your student profile is not available." });
             return;
        }
        setIsLoading(true);
        setColleges(null);
        try {
            const result = await findMatchingColleges({
                ...studentProfile,
                filterQuery: values.filterQuery || "best overall fit based on the student's profile",
            });
            
            trackCollegeStat(result);

            const collegesWithImageState: CategorizedColleges = {
                reach: result.reachSchools.map(c => ({...c, imageUrl: undefined})),
                target: result.targetSchools.map(c => ({...c, imageUrl: undefined})),
                safety: result.safetySchools.map(c => ({...c, imageUrl: undefined})),
            };

            setColleges(collegesWithImageState);
            await startImageGeneration(collegesWithImageState);

        } catch (error) {
            console.error("College finder failed:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "We couldn't find colleges at this time. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">AI College Finder</h1>
                <p className="text-muted-foreground">Discover colleges and universities that align with your profile and interests.</p>
            </header>

            {isLocked ? (
                <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertTitle>Feature Locked</AlertTitle>
                    <AlertDescription>
                        To ensure our AI has enough data for the best recommendations, the College Finder will unlock {unlocksIn}. This gives the system time to learn your unique profile.
                    </AlertDescription>
                </Alert>
            ) : (
                 <Card>
                    <CardHeader>
                        <CardTitle>Find Your Fit</CardTitle>
                        <CardDescription>Enter keywords to filter your recommendations (e.g., "small liberal arts colleges in California", "universities with strong engineering programs"). Leave it blank for general recommendations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
                                <FormField
                                control={form.control}
                                name="filterQuery"
                                render={({ field }) => (
                                    <FormItem className="relative flex-1">
                                    <FormControl>
                                        <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input placeholder="Filter by location, size, program, etc..." className="pl-10" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="absolute" />
                                    </FormItem>
                                )}
                                />
                                <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                                    {isLoading ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-2" />Find Colleges</>}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}

            {isLoading && !colleges && (
                 <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                             <Skeleton className="h-8 w-1/4" />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Array.from({ length: 2 }).map((_, j) => (
                                <Card key={j}>
                                    <Skeleton className="h-48 w-full" />
                                    <CardContent className="p-6 space-y-4">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-16 w-full" />
                                    </CardContent>
                                </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {colleges && (
                 <div className="space-y-12">
                    {colleges.reach.length > 0 && (
                        <CollegeCategorySection 
                            title="Reach Schools"
                            description="These are ambitious choices where your profile is competitive, but admission is still challenging."
                            icon={<TrendingUp className="w-8 h-8 text-primary" />}
                            colleges={colleges.reach}
                        />
                    )}
                     {colleges.target.length > 0 && (
                        <CollegeCategorySection 
                            title="Target Schools"
                            description="Your academic profile is a strong match for the typical student at these schools."
                            icon={<Target className="w-8 h-8 text-green-500" />}
                            colleges={colleges.target}
                        />
                    )}
                     {colleges.safety.length > 0 && (
                        <CollegeCategorySection 
                            title="Safety Schools"
                            description="You have a strong chance of admission to these schools, providing a solid foundation for your application list."
                            icon={<ShieldCheck className="w-8 h-8 text-blue-500" />}
                            colleges={colleges.safety}
                        />
                    )}
                </div>
            )}
           
        </div>
    );
}
