
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { findScholarships } from '@/ai/flows/find-scholarships';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Award, Loader2, Sparkles, Calendar, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { FindScholarshipsInputSchema, type FindScholarshipsOutput, type FindScholarshipsInput } from '@/lib/types';


export default function ScholarshipFinderPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<FindScholarshipsOutput | null>(null);

    const form = useForm<FindScholarshipsInput>({
        resolver: zodResolver(FindScholarshipsInputSchema),
        defaultValues: {
            academicProfile: "",
            extracurriculars: "",
            interests: "",
            background: "",
        },
    });

    const onSubmit = async (values: FindScholarshipsInput) => {
        setIsLoading(true);
        setResults(null);
        try {
            const result = await findScholarships(values);
            setResults(result);
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

            <Card>
                <CardHeader>
                    <CardTitle>Tell Us About Yourself</CardTitle>
                    <CardDescription>The more detail you provide, the better our AI can match you with relevant scholarships. Don't include sensitive personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                             <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="academicProfile"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Academic Profile</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="e.g., 3.8 GPA, 1450 SAT, strong in English and History..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="extracurriculars"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Extracurriculars & Achievements</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="e.g., Captain of the debate team, volunteer at animal shelter, won state science fair..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="interests"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Interests & Intended Major</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="e.g., Passionate about environmental science and filmmaking. Plan to major in Environmental Studies." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="background"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Personal Background</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="e.g., First-generation college student, specific heritage, reside in a rural area..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-2" />Find Scholarships</>}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {isLoading && (
                <div className="space-y-4">
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
