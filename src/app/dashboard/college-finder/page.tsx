
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { findMatchingColleges } from '@/ai/flows/find-matching-colleges';
import type { FindMatchingCollegesOutput, FindMatchingCollegesInput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GraduationCap, Loader2, Search, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const filterSchema = z.object({
  filterQuery: z.string().optional(),
});

function CollegeCard({ college }: { college: FindMatchingCollegesOutput[0] }) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
                 <Image
                    src={`https://placehold.co/600x400.png`}
                    alt={`A placeholder image representing ${college.name}`}
                    width={600}
                    height={400}
                    className="rounded-t-lg object-cover"
                    data-ai-hint="college campus"
                  />
            </CardHeader>
            <CardContent className="p-6">
                <CardTitle className="text-xl">{college.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{college.location}</p>
                <p className="mt-4 text-sm">{college.reasoning}</p>
            </CardContent>
        </Card>
    )
}


export default function CollegeFinderPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [colleges, setColleges] = useState<FindMatchingCollegesOutput | null>(null);
    const [studentProfile, setStudentProfile] = useState<Omit<FindMatchingCollegesInput, 'filterQuery'> | null>(null);

    useEffect(() => {
        const onboardingDataStr = localStorage.getItem('onboardingData');
        const signupDataStr = localStorage.getItem('signupData');
        if (onboardingDataStr && signupDataStr) {
            const onboardingData = JSON.parse(onboardingDataStr);
            const signupData = JSON.parse(signupDataStr);
            setStudentProfile({ ...onboardingData, grade: signupData.grade });
        } else {
             toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load your profile. Please complete onboarding.",
            });
        }
    }, [toast]);

    const form = useForm<z.infer<typeof filterSchema>>({
        resolver: zodResolver(filterSchema),
        defaultValues: { filterQuery: "" },
    });

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
            setColleges(result);
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
    
    const memoizedColleges = useMemo(() => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-16 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )
        }
        if (colleges) {
            return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {colleges.map((college, index) => <CollegeCard key={index} college={college} />)}
                </div>
            )
        }
        return null;
    }, [colleges, isLoading]);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">AI College Finder</h1>
                <p className="text-muted-foreground">Discover colleges and universities that align with your profile and interests.</p>
            </header>

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

            {memoizedColleges}
           
        </div>
    );
}
