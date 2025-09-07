
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, MapPin, Briefcase, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const jobOpenings = [
    {
        title: "Senior AI Engineer (Prompt Engineering)",
        location: "Remote",
        department: "Engineering",
        description: "Lead the development of our core AI mentor systems. You will be responsible for designing, testing, and refining the prompts that power our strategic planning and content generation features."
    },
    {
        title: "Full-Stack Developer (Next.js & Genkit)",
        location: "Remote",
        department: "Engineering",
        description: "Join our core product team to build and maintain the PinnaclePath platform. You'll work across the stack, from our Next.js frontend to our Genkit-powered AI backend services."
    },
    {
        title: "Product Marketing Manager",
        location: "Remote",
        department: "Marketing",
        description: "Own the go-to-market strategy for new PinnaclePath features. You will be responsible for user research, positioning, messaging, and campaign execution to drive user growth and engagement."
    },
    {
        title: "Lead UX/UI Designer",
        location: "Remote",
        department: "Design",
        description: "Define the user experience and visual design of the PinnaclePath platform. You will lead the design process from concept to execution, creating an intuitive and beautiful experience for students."
    }
]

export default function CareersPage() {
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
                            Join Our Mission
                        </h2>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                            We're building the future of personalized education, and we need passionate, innovative people to help us achieve our goal.
                        </p>
                        </div>
                    </div>
                </section>

                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-4xl">
                         <div className="text-center mb-16">
                            <h3 className="text-4xl font-bold tracking-tight">Current Openings</h3>
                            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Find your place at PinnaclePath. We're looking for talented individuals to join our fully remote team.</p>
                        </div>
                        <div className="space-y-6">
                            {jobOpenings.map((job, index) => (
                                <Card key={index} className="hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle>{job.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-4 pt-2">
                                            <span className="flex items-center gap-1.5"><Briefcase/> {job.department}</span>
                                            <span className="flex items-center gap-1.5"><MapPin/> {job.location}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{job.description}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild>
                                          <Link href={`/careers/${encodeURIComponent(job.title)}`}>Apply Now</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
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
