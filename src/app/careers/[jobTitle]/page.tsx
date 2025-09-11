
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
import { BrainCircuit, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { validateJobApplication } from "@/ai/flows/validate-job-application";


const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  linkedin: z.string().url({ message: "Please enter a valid LinkedIn URL." }).optional().or(z.literal('')),
  portfolio: z.string().url({ message: "Please enter a valid portfolio URL." }).optional().or(z.literal('')),
  resume: z.any().refine(files => files?.length == 1, "Resume is required."),
  coverLetter: z.string().min(50, { message: "Cover letter must be at least 50 characters." }),
});

function ApplicationForm() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const jobTitle = decodeURIComponent(params.jobTitle as string);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            linkedin: "",
            portfolio: "",
            coverLetter: "",
        },
    });

    const resumeRef = form.register("resume");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
             // AI Validation Step
            const validationResult = await validateJobApplication({
                name: values.name,
                email: values.email,
                coverLetter: values.coverLetter,
            });

            if (validationResult.isGenuine) {
                const newApplication = {
                    id: uuidv4(),
                    jobTitle,
                    ...values,
                    resume: values.resume[0]?.name || 'N/A', // Store filename for demo
                    status: 'New',
                    submittedAt: new Date().toISOString(),
                };

                const existingApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
                existingApplications.push(newApplication);
                localStorage.setItem('jobApplications', JSON.stringify(existingApplications));
            } else {
                // If it's not genuine, we don't save it, but we don't tell the user.
                console.log(`Spam application detected and blocked. Reason: ${validationResult.reasoning}`);
            }
            
            // Show success toast regardless of validation outcome to not alert spammers
            toast({
                title: "Application Submitted!",
                description: "Thank you for your interest. We will review your application and be in touch.",
            });
            form.reset();
            
            // Redirect after a short delay to allow toast to be seen
            setTimeout(() => {
                router.push("/careers");
            }, 2000);

        } catch (error) {
            console.error("Failed to process application", error);
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: "There was an error submitting your application. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-background text-foreground min-h-screen">
             <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center">
                <Link href="/" className="flex items-center gap-2 mr-6">
                    <BrainCircuit className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">AI School Mentor</h1>
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
                            <div className="grid md:grid-cols-2 gap-6">
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
                            </div>
                             <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="(123) 456-7890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <div className="grid md:grid-cols-2 gap-6">
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
                            </div>
                             <FormField
                                control={form.control}
                                name="resume"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resume/CV</FormLabel>
                                        <FormControl>
                                            <Input type="file" {...resumeRef} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="coverLetter"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Cover Letter</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us why you're a great fit for this role..." className="resize-y" rows={8} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Application"}
                            </Button>
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
