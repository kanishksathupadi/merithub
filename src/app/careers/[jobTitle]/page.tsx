
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";


const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  linkedin: z.string().url({ message: "Please enter a valid LinkedIn URL." }).optional().or(z.literal('')),
  portfolio: z.string().url({ message: "Please enter a valid portfolio URL." }).optional().or(z.literal('')),
  comments: z.string().min(10, { message: "Comments must be at least 10 characters long." }),
});

function ApplicationForm() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const jobTitle = decodeURIComponent(params.jobTitle as string);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            linkedin: "",
            portfolio: "",
            comments: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const newApplication = {
            id: uuidv4(),
            jobTitle,
            ...values,
            status: 'New',
            submittedAt: new Date().toISOString(),
        };

        try {
            const existingApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
            existingApplications.push(newApplication);
            localStorage.setItem('jobApplications', JSON.stringify(existingApplications));
            
            toast({
                title: "Application Submitted!",
                description: "Thank you for your interest. We will review your application and be in touch.",
            });
            form.reset();
            router.push("/careers");
        } catch (error) {
            console.error("Failed to save application", error);
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: "There was an error submitting your application. Please try again.",
            });
        }
    }

    return (
        <div className="bg-background text-foreground min-h-screen">
             <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center">
                <Link href="/" className="flex items-center gap-2 mr-6">
                    <GraduationCap className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">PinnaclePath</h1>
                </Link>
                </div>
            </header>
            
            <main className="container mx-auto py-12 px-4 max-w-2xl">
                 <Button variant="ghost" asChild className="mb-8">
                    <Link href="/careers">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Openings
                    </Link>
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Apply for {jobTitle}</CardTitle>
                        <CardDescription>We're excited to learn more about you. Please fill out the form below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="linkedin"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>LinkedIn Profile URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="portfolio"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Portfolio/Website URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://yourportfolio.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="comments"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Additional Comments</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us why you're a great fit for this role..." className="resize-none" rows={5} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit Application</Button>
                        </form>
                        </Form>
                    </CardContent>
                </Card>
            </main>
             <Toaster />
        </div>
    );
}

export default function ApplicationPage() {
    return (
        <Suspense fallback={<div>Loading application form...</div>}>
            <ApplicationForm/>
        </Suspense>
    )
}
