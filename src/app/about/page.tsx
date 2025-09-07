
"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Lightbulb, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AboutUsPage() {
    const router = useRouter();

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
                 {/* Hero Section */}
                <section className="relative py-20 md:py-32 text-center bg-muted/50">
                    <div className="container relative mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            Our Mission is Your Success.
                        </h2>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                            We believe that every student, regardless of their background, deserves a personalized, strategic, and inspiring path to their educational goals. We're here to make that a reality.
                        </p>
                        </div>
                    </div>
                </section>

                <section className="py-24">
                    <div className="container mx-auto px-4">
                         <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <h3 className="text-4xl font-bold tracking-tight">The Story of PinnaclePath</h3>
                                <p className="text-muted-foreground">PinnaclePath was founded by a team of educators, technologists, and former admissions officers who saw a fundamental problem in educational guidance. The advice was often generic, the tools were disconnected, and the process was overwhelming for students and parents alike.</p>
                                <p className="text-muted-foreground">We knew there had to be a better way. We envisioned a single platform that could act as a true co-pilot for students—an intelligent, proactive mentor that understands their unique profile and crafts a hyper-personalized strategy for success. Using the power of generative AI, we built PinnaclePath to do just that.</p>
                            </div>
                            <Image
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxkaXZlcnNlJTIwdGVhbSUyMG9mJTIwZWR1Y2F0b3JzfGVufDB8fHx8MTc2MjE4ODg4OHww&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="A diverse team of professionals collaborating."
                                width={800}
                                height={600}
                                className="rounded-xl shadow-xl ring-1 ring-border/10 object-cover"
                                data-ai-hint="diverse team educators"
                            />
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-muted/50">
                    <div className="container mx-auto px-4">
                         <div className="text-center mb-16">
                            <h3 className="text-4xl font-bold tracking-tight">Our Core Values</h3>
                            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">These principles guide every feature we build and every decision we make.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="p-8 bg-card rounded-xl shadow-lg border border-border">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                                    <Users className="w-8 h-8"/>
                                </div>
                                <h4 className="text-xl font-semibold">Student-Centricity</h4>
                                <p className="text-muted-foreground mt-2">Our students are at the heart of everything. We are committed to building tools that empower them, build their confidence, and genuinely improve their outcomes.</p>
                            </div>
                            <div className="p-8 bg-card rounded-xl shadow-lg border border-border">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                                    <Lightbulb className="w-8 h-8"/>
                                </div>
                                <h4 className="text-xl font-semibold">Innovation with Purpose</h4>
                                <p className="text-muted-foreground mt-2">We leverage cutting-edge AI not as a gimmick, but as a powerful tool to provide personalized, insightful, and proactive guidance at a scale never before possible.</p>
                            </div>
                            <div className="p-8 bg-card rounded-xl shadow-lg border border-border">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                                    <Target className="w-8 h-8"/>
                                </div>
                                <h4 className="text-xl font-semibold">Strategic Thinking</h4>
                                <p className="text-muted-foreground mt-2">We believe success is born from strategy. Our platform is designed to help students think like strategists, focusing on building a unique "spike" and a compelling personal narrative.</p>
                            </div>
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
        </div>
    );
}
