
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
import { GraduationCap, Mail, Building, Phone, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Toaster } from "@/components/ui/toaster";
import { v4 as uuidv4 } from "uuid";
import { validateContactMessage } from "@/ai/flows/validate-contact-message";
import { useState } from "react";


const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  inquiryType: z.string().min(1, { message: "Please select a reason for your inquiry." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters long." }),
});


export default function ContactPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            inquiryType: "",
            message: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // AI Validation Step
            const validationResult = await validateContactMessage(values);

            if (validationResult.isGenuine) {
                const newMessage = {
                    id: uuidv4(),
                    ...values,
                    status: 'New',
                    submittedAt: new Date().toISOString(),
                };
                const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                existingMessages.push(newMessage);
                localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
            } else {
                // If it's not genuine, we don't save it, but we don't tell the user.
                console.log(`Spam message detected and blocked. Reason: ${validationResult.reasoning}`);
            }

            // Show success toast regardless of validation outcome to not alert spammers
            toast({
                title: "Message Sent!",
                description: "Thanks for reaching out. We'll get back to you as soon as possible.",
            });
            form.reset();

        } catch (error) {
            console.error("Failed to send contact message", error);
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: "There was an error sending your message. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-background text-foreground">
             <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center">
                <Link href="/" className="flex items-center gap-2 mr-6">
                    <GraduationCap className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">PinnaclePath</h1>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/#features" className="hover:text-primary transition-colors">Features</Link>
                    <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                    <Link href="/careers" className="hover:text-primary transition-colors">Careers</Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                </nav>
                <div className="flex items-center gap-2 ml-auto">
                    <Button asChild variant="secondary">
                        <Link href="/login">Member Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Get Started</Link>
                    </Button>
                </div>
                </div>
            </header>
            
            <main>
                <section className="relative py-20 md:py-32 text-center bg-muted/50">
                    <div className="container relative mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            Get in Touch
                        </h2>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                            We're here to help. Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
                        </p>
                        </div>
                    </div>
                </section>

                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-16">
                            <div className="space-y-8">
                                <h3 className="text-3xl font-bold">Contact Information</h3>
                                <p className="text-muted-foreground">Fill out the form and our team will get back to you within 24 hours. You can also reach us via the details below.</p>
                                <ul className="space-y-4 text-muted-foreground">
                                    <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary"/> support@pinnaclepath.com</li>
                                    <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary"/> +1 (555) 123-4567</li>
                                    <li className="flex items-center gap-3"><Building className="w-5 h-5 text-primary"/> 123 Innovation Drive, Tech City, USA</li>
                                </ul>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Send us a Message</CardTitle>
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
                                            name="inquiryType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Reason for Inquiry</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a reason..." />
                                                        </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="general">General Question</SelectItem>
                                                            <SelectItem value="technical_support">Technical Support</SelectItem>
                                                            <SelectItem value="billing">Billing Inquiry</SelectItem>
                                                            <SelectItem value="partnership">Partnership</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Your message here..." className="resize-none" rows={5} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? <Loader2 className="animate-spin" /> : "Send Message"}
                                        </Button>
                                    </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-muted/50 border-t border-border">
                <div className="container mx-auto py-12 px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <GraduationCap className="w-8 h-8 text-primary" />
                                <h1 className="text-2xl font-bold tracking-tight">PinnaclePath</h1>
                            </Link>
                            <p className="text-muted-foreground text-sm">Your AI co-pilot for academic and career victory.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Platform</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/#features" className="hover:text-primary">Features</Link></li>
                                <li><Link href="/#pricing" className="hover:text-primary">Pricing</Link></li>
                                <li><Link href="/login" className="hover:text-primary">Login</Link></li>
                                <li><Link href="/signup" className="hover:text-primary">Get Started</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                                <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
                                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link></li>
                                <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} PinnaclePath. All Rights Reserved.
                    </div>
                </div>
            </footer>
             <Toaster />
        </div>
    );
}
