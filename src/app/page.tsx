
"use client";

import { Button } from "@/components/ui/button";
import { Rocket, LogIn, TrendingUp, Zap, Target, Star, ShieldCheck, BarChart, BrainCircuit, Check, GraduationCap, Award, Smile, DollarSign, ArrowUpCircle, BookOpen, ListChecks, PenSquare, MessageSquare, Users, UserCheck, FileText, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";


function LiveStats() {
    const [stats, setStats] = useState({ students: 0, colleges: 0, essays: 0, scholarships: 0 });
    const [loading, setLoading] = useState(true);

    const getRealStats = useCallback(() => {
        if (typeof window === 'undefined') {
            return { students: 0, colleges: 0, essays: 0, scholarships: 0 };
        }
        try {
            const allUsers = JSON.parse(localStorage.getItem('allSignups') || '[]');
            const collegeStats = JSON.parse(localStorage.getItem('collegeFinderStats') || '{"count": 0}');
            const essayStats = JSON.parse(localStorage.getItem('essayReviewStats') || '{"count": 0}');
            const scholarshipStats = JSON.parse(localStorage.getItem('scholarshipFinderStats') || '{"count": 0}');
            
            return {
                students: allUsers.length,
                colleges: collegeStats.count,
                essays: essayStats.count,
                scholarships: scholarshipStats.count,
            };
        } catch (error) {
            console.error("Error reading stats from localStorage:", error);
            return { students: 0, colleges: 0, essays: 0, scholarships: 0 };
        }
    }, []);

    useEffect(() => {
        setStats(getRealStats());
        setLoading(false);

        const handleStorageChange = (event: StorageEvent) => {
            if (['allSignups', 'collegeFinderStats', 'essayReviewStats', 'scholarshipFinderStats'].includes(event.key!)) {
                setStats(getRealStats());
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [getRealStats]);

    const StatCard = ({ icon, value, label, isLoading }: { icon: React.ReactNode, value: number, label: string, isLoading: boolean }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center p-6 bg-card rounded-xl shadow-lg border border-border"
        >
            <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mb-4">
                {icon}
            </div>
            <p className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-foreground/80">
                 {isLoading ? "..." : value.toLocaleString()}
            </p>
            <p className="text-muted-foreground mt-2 text-sm text-center h-10 flex items-center">{label}</p>
        </motion.div>
    );

    return (
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <StatCard icon={<UserCheck className="w-8 h-8" />} value={stats.students} label="Students Guided" isLoading={loading} />
            <StatCard icon={<GraduationCap className="w-8 h-8" />} value={stats.colleges} label="College Matches Found" isLoading={loading} />
            <StatCard icon={<Award className="w-8 h-8" />} value={stats.scholarships} label="Scholarships Found" isLoading={loading} />
            <StatCard icon={<FileText className="w-8 h-8" />} value={stats.essays} label="Essays Reviewed" isLoading={loading} />
        </div>
    );
}

function PricingModal({ children }: { children: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-4xl p-8">
                <DialogHeader>
                    <DialogTitle className="text-4xl font-bold tracking-tight text-center">Invest in Your Future</DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-2 text-center max-w-2xl mx-auto">
                        Choose the plan that aligns with your ambition. A small investment today for a future of limitless opportunities.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <PricingCard 
                        plan="Standard"
                        price="$7"
                        features={[
                            "AI-Personalized Roadmap",
                            "AI College Finder",
                            "Detailed Progress Tracking",
                            "AI Study Buddy (Quizzes & Flashcards)",
                            "AI Resource Finder"
                        ]}
                        buttonVariant="secondary"
                        href="/signup?plan=standard"
                    />
                    <PricingCard 
                        plan="Elite"
                        price="$12"
                        features={[
                            "Everything in Standard, plus:",
                            "AI Essay Review Tool",
                            "AI Scholarship Finder",
                            "Mentor Match Directory",
                            "Community Q&A Forum",
                            "Priority Support"
                        ]}
                        buttonVariant="secondary"
                        href="/signup?plan=elite"
                        isPopular
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface PricingCardProps {
    plan: string;
    price: string;
    features: string[];
    href: string;
    buttonVariant: "default" | "outline" | "secondary";
    isPopular?: boolean;
}

const PricingCard = ({ plan, price, features, href, buttonVariant, isPopular = false }: PricingCardProps) => (
    <div className={cn(
        "p-8 bg-card rounded-xl shadow-lg border border-border flex flex-col h-full bg-grid-primary/5",
        isPopular && "border-primary"
    )}>
        <h4 className={cn("text-2xl font-semibold", isPopular && "text-primary")}>{plan}</h4>
        <p className="text-4xl font-bold my-4">{price}<span className="text-lg font-medium text-muted-foreground">/mo</span></p>
        <ul className="space-y-3 text-muted-foreground flex-1">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0"/>
                    <span className={cn(feature.includes("Everything in Standard, plus:") && "text-foreground/90 font-semibold")}>
                        {feature}
                    </span>
                </li>
            ))}
        </ul>
        <Button asChild variant={buttonVariant} className="w-full mt-8">
           <Link href={href}>Choose {plan}</Link>
        </Button>
    </div>
);


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">PinnaclePath</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="#testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
             <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-2 ml-auto">
             <Button asChild variant="secondary">
                <Link href="/login">Member Login</Link>
            </Button>
             <PricingModal>
                <Button>Get Started</Button>
            </PricingModal>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-12 pb-16 md:pt-24 md:pb-32 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl mx-auto">
               <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold mb-4 border border-primary/20 text-primary">
                Your Personal AI Mentor for Academic Success
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                Smarter Prep, Brighter Future.
              </h2>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                PinnaclePath uses AI to build a personalized roadmap, find best-fit colleges, provide instant essay feedback, and generate on-demand study help to ensure you stand out.
              </p>
              <div className="mt-8 space-x-4">
                 <PricingModal>
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30">
                        <Rocket className="mr-2 h-5 w-5" />
                        Start Your Journey
                    </Button>
                </PricingModal>
                <Button variant="outline" size="lg" asChild className="border-border hover:bg-primary/10">
                  <Link href="#features">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            <LiveStats />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">Your Unfair Advantage</h3>
                    <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Our platform is engineered to give you an unparalleled edge on your academic journey.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="p-8 bg-card rounded-xl shadow-lg border border-border transition-all hover:border-primary/50 hover:scale-105">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                            <BrainCircuit className="w-8 h-8"/>
                        </div>
                        <h4 className="text-xl font-semibold">Hyper-Personalized Roadmap</h4>
                        <p className="text-muted-foreground mt-2">Our AI builds a dynamic, multi-year strategy based on deep analysis of your goals, strengths, and weaknesses.</p>
                    </div>
                     <div className="p-8 bg-card rounded-xl shadow-lg border border-border transition-all hover:border-primary/50 hover:scale-105">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                            <GraduationCap className="w-8 h-8"/>
                        </div>
                        <h4 className="text-xl font-semibold">AI College Finder</h4>
                        <p className="text-muted-foreground mt-2">Discover universities that perfectly match your academic profile, interests, and learning preferences.</p>
                    </div>
                    <div className="p-8 bg-card rounded-xl shadow-lg border border-border transition-all hover:border-primary/50 hover:scale-105">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                            <BookOpen className="w-8 h-8"/>
                        </div>
                        <h4 className="text-xl font-semibold">AI Study Buddy</h4>
                        <p className="text-muted-foreground mt-2">Instantly generate flashcards and quizzes, or find the web's best resource for a specific question.</p>
                    </div>
                    <div className="p-8 bg-card rounded-xl shadow-lg border border-border transition-all hover:border-primary/50 hover:scale-105">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                            <TrendingUp className="w-8 h-8"/>
                        </div>
                        <h4 className="text-xl font-semibold">Progress Tracker</h4>
                        <p className="text-muted-foreground mt-2">Visualize your journey, track completed tasks, and watch your long-term goals get closer every day.</p>
                    </div>
                    <div className="p-8 bg-card rounded-xl shadow-lg border border-border transition-all hover:border-primary/50 hover:scale-105">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                            <PenSquare className="w-8 h-8"/>
                        </div>
                        <h4 className="text-xl font-semibold">AI Essay Review (Elite)</h4>
                        <p className="text-muted-foreground mt-2">Get instant, actionable feedback on your college and scholarship essays to improve clarity, structure, and impact.</p>
                    </div>
                    <div className="p-8 bg-card rounded-xl shadow-lg border border-border transition-all hover:border-primary/50 hover:scale-105">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                            <Users className="w-8 h-8"/>
                        </div>
                        <h4 className="text-xl font-semibold">Mentor Match & Forum (Elite)</h4>
                        <p className="text-muted-foreground mt-2">Connect with experienced mentors and collaborate with peers in our exclusive Q&A community.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* The PinnaclePath Difference Section */}
        <section className="py-24 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                     <Image
                        src="https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjb2xsYWJvcmF0aXZlJTIwdGVhbXxlbnwwfHx8fDE3MjQ1NjA0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="A diverse group of students collaborating and planning their future."
                        width={800}
                        height={600}
                        className="rounded-xl shadow-xl ring-1 ring-border/10 object-cover"
                        data-ai-hint="collaborative team"
                    />
                    <div className="space-y-6">
                        <h3 className="text-4xl font-bold tracking-tight">The PinnaclePath Difference</h3>
                        <p className="text-muted-foreground">We go beyond checklists and deadlines. Our philosophy is built on the belief that a successful academic journey is about building a unique and compelling story, not just being well-rounded.</p>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold"><Target /></div>
                                <div>
                                    <h4 className="text-lg font-semibold">Develop Your "Spike"</h4>
                                    <p className="text-muted-foreground mt-1 text-sm">Top colleges don't look for well-rounded students; they look for specialists who will contribute a unique talent to their campus. Our AI helps you identify and cultivate a "spike"—a deep, impressive talent that makes you stand out.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold"><BrainCircuit /></div>
                                <div>
                                    <h4 className="text-lg font-semibold">AI as Your Personal Mentor</h4>
                                    <p className="text-muted-foreground mt-1 text-sm">Our platform isn't just a task manager. It's a strategic partner that analyzes your profile, suggests expansive new opportunities, and provides proactive guidance, acting as your personal mentor 24/7.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>


        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold tracking-tight">Your Path to Excellence</h3>
               <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Our streamlined process makes it simple to get started on your journey to success.</p>
            </div>
            <div className="space-y-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <Badge variant="outline" className="mb-4">Step 1</Badge>
                        <h4 className="text-3xl font-bold tracking-tight">Build Your Profile</h4>
                        <p className="text-muted-foreground mt-4">Begin by telling us about yourself. Our comprehensive onboarding process captures your academic strengths, personal passions, extracurricular activities, and future aspirations. This detailed profile is the foundation of your entire personalized experience.</p>
                    </div>
                    <Image
                        src="https://images.unsplash.com/photo-1622117515670-fcb02499491f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyMHx8c3R1ZGVudCUyMGZpbGxpbmclMjBvdXQlMjBmb3JtfGVufDB8fHx8MTc1NzAyODQxMnww&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="A student filling out a detailed form on a laptop."
                        width={800}
                        height={600}
                        className="rounded-xl shadow-xl ring-1 ring-border/10 object-cover"
                        data-ai-hint="student form"
                    />
                </div>
                 <div className="grid md:grid-cols-2 gap-12 items-center">
                     <Image
                        src="https://images.unsplash.com/photo-1516542076529-1ea3854896f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxzdHVkZW50JTIwdXNpbmclMjBjb21wdXRlcnxlbnwwfHx8fDE3MjM4MjQxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="AI dashboard showing a strategic plan."
                        width={800}
                        height={600}
                        className="rounded-xl shadow-xl ring-1 ring-border/10 object-cover md:order-2"
                        data-ai-hint="student computer"
                    />
                    <div className="md:order-1">
                        <Badge variant="outline" className="mb-4">Step 2</Badge>
                        <h4 className="text-3xl font-bold tracking-tight">Receive Your AI Strategy</h4>
                        <p className="text-muted-foreground mt-4">With your profile complete, our AI gets to work. It analyzes your unique data to generate a bespoke, long-term roadmap filled with hyper-specific, actionable milestones. This isn't a generic checklist; it's a strategic plan designed to maximize your potential.</p>
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <Badge variant="outline" className="mb-4">Step 3</Badge>
                        <h4 className="text-3xl font-bold tracking-tight">Execute and Achieve</h4>
                        <p className="text-muted-foreground mt-4">Your plan is set. Now, it's time to execute. Follow your roadmap, track your progress in real-time, and leverage our powerful suite of AI tools—from the Study Buddy to the Essay Reviewer—to overcome any academic challenge and reach your goals.</p>
                    </div>
                     <Image
                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzdHVkZW50cyUyMGluJTIwbGVjdHVyZSUyMGhsbCUyMGNlZWxlYnJhdGluZ3xlbnwwfHx8fDE3MjUwNDg5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Students celebrating their academic success."
                        width={800}
                        height={600}
                        className="rounded-xl shadow-xl ring-1 ring-border/10 object-cover"
                        data-ai-hint="students celebrating"
                    />
                </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">Why PinnaclePath?</h3>
                    <p className="text-muted-foreground mt-3 max-w-3xl mx-auto">While traditional methods offer generic advice, PinnaclePath provides a hyper-personalized, data-driven engine for your success. Here’s how we compare:</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <Card className="p-8">
                        <CardTitle className="mb-4 text-xl">Traditional Counseling</CardTitle>
                        <ul className="space-y-3 text-left text-muted-foreground text-sm">
                            <li className="flex items-start gap-2"><X className="w-4 h-4 text-destructive mt-1 shrink-0"/>Limited availability, often by appointment only.</li>
                            <li className="flex items-start gap-2"><X className="w-4 h-4 text-destructive mt-1 shrink-0"/>Advice is based on general experience, not your specific data.</li>
                            <li className="flex items-start gap-2"><X className="w-4 h-4 text-destructive mt-1 shrink-0"/>Static plans that are hard to adapt to new interests.</li>
                            <li className="flex items-start gap-2"><X className="w-4 h-4 text-destructive mt-1 shrink-0"/>High cost, often thousands of dollars per year.</li>
                        </ul>
                    </Card>
                     <Card className="p-8 border-primary ring-2 ring-primary">
                        <CardTitle className="mb-4 text-xl flex items-center justify-center gap-2 text-primary">
                            <Star className="w-5 h-5"/>
                            PinnaclePath
                        </CardTitle>
                        <ul className="space-y-3 text-left text-muted-foreground text-sm">
                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0"/>24/7 AI mentor, available anytime, anywhere.</li>
                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0"/>Hyper-personalized strategy based on your unique profile.</li>
                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0"/>Dynamic roadmap that evolves as you grow.</li>
                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0"/>Affordable monthly subscription.</li>
                        </ul>
                    </Card>
                     <Card className="p-8">
                        <CardTitle className="mb-4 text-xl">Self-Guided</CardTitle>
                         <ul className="space-y-3 text-left text-muted-foreground text-sm">
                            <li className="flex items-start gap-2"><X className="w-4 h-4 text-destructive mt-1 shrink-0"/>Information overload from endless online searching.</li>
                            <li className="flex items-start gap-2"><X className="w-4 h-4 text-destructive mt-1 shrink-0"/>No clear path or strategy, leading to confusion.</li>
                            <li className="flex items-start gap-2"><X className="w-4 h-4 text-destructive mt-1 shrink-0"/>Difficult to stay motivated and track progress effectively.</li>
                            <li className="flex items-start gap-2"><X className="w-4 h-4 text-destructive mt-1 shrink-0"/>Risk of missing key opportunities and deadlines.</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <h3 className="text-4xl font-bold tracking-tight">Built for Ambitious Students</h3>
                <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Our platform empowers students to take control of their future, build a compelling profile, and achieve their biggest goals.</p>
                <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
                    <Card className="p-6 bg-card">
                        <p className="text-muted-foreground mb-4">"The AI roadmap helped me identify a 'spike' in computational biology I never would have found on my own. I went from just liking science to presenting my own research project at the state science fair."</p>
                        <div className="flex items-center gap-3">
                            <Avatar><AvatarFallback>S</AvatarFallback></Avatar>
                            <div>
                                <p className="font-semibold">Sarah L.</p>
                                <p className="text-sm text-muted-foreground">11th Grade Student</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 bg-card">
                        <p className="text-muted-foreground mb-4">"As a parent, seeing my son's progress tracked visually gave me so much peace of mind. The AI essay reviewer was like having an expert writing coach available 24/7. It was a game-changer for his college applications."</p>
                         <div className="flex items-center gap-3">
                            <Avatar><AvatarFallback>M</AvatarFallback></Avatar>
                            <div>
                                <p className="font-semibold">Mark T.</p>
                                <p className="text-sm text-muted-foreground">Parent of a 12th Grader</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">Invest in Your Future</h3>
                    <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Choose the plan that aligns with your ambition. A small investment today for a future of limitless opportunities.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="p-8 bg-card rounded-xl shadow-lg border border-border flex flex-col h-full bg-grid-primary/5">
                        <h4 className="text-2xl font-semibold">Standard</h4>
                        <p className="text-4xl font-bold my-4">$7<span className="text-lg font-medium text-muted-foreground">/mo</span></p>
                        <ul className="space-y-3 text-muted-foreground flex-1">
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>AI-Personalized Roadmap</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>AI College Finder</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>Detailed Progress Tracking</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>AI Study Buddy (Quizzes &amp; Flashcards)</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>AI Resource Finder</li>
                        </ul>
                        <Button asChild variant="secondary" className="w-full mt-8">
                           <Link href="/signup?plan=standard">Choose Standard</Link>
                        </Button>
                    </div>
                    <div className="p-8 bg-card rounded-xl shadow-lg border border-primary flex flex-col h-full relative bg-grid-primary/5">
                        <h4 className="text-2xl font-semibold text-primary">Elite</h4>
                        <p className="text-4xl font-bold my-4">$12<span className="text-lg font-medium text-muted-foreground">/mo</span></p>
                        <ul className="space-y-3 text-muted-foreground flex-1">
                             <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/><span className="text-foreground/90 font-semibold">Everything in Standard, plus:</span></li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary font-semibold text-foreground/90"/>AI Essay Review Tool</li>
                             <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary font-semibold text-foreground/90"/>AI Scholarship Finder</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary font-semibold text-foreground/90"/>Mentor Match Directory</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary font-semibold text-foreground/90"/>Community Q&amp;A Forum</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>Priority Support</li>
                        </ul>
                        <Button asChild variant="secondary" className="w-full mt-8">
                            <Link href="/signup?plan=elite">Choose Elite</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h3 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h3>
                    <p className="text-muted-foreground mt-3">Have questions? We have answers.</p>
                </div>
                <div className="AccordionFAQ w-full">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Is PinnaclePath suitable for elementary school students?</AccordionTrigger>
                            <AccordionContent>
                            Yes! PinnaclePath is designed for students from elementary school through high school. For younger students, our AI focuses on exploration, skill-building, and discovering new interests. As students get older, the AI's recommendations become more focused on college preparation, leadership, and building a standout profile.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>How is this different from a traditional college counselor?</AccordionTrigger>
                            <AccordionContent>
                            PinnaclePath acts as a 24/7 AI mentor that complements the work of human counselors. We provide instant, data-driven strategic planning, on-demand study tools, and continuous progress tracking. Our Elite plan also includes a directory to connect with human mentors, offering the best of both worlds.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Can I cancel my subscription at any time?</AccordionTrigger>
                            <AccordionContent>
                            Absolutely. You can cancel your subscription at any time through your account settings. You will retain access to your plan's features until the end of your current billing period.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Is my personal and academic data secure?</AccordionTrigger>
                            <AccordionContent>
                            Data privacy and security are our top priorities. We use industry-standard encryption and security protocols to protect your information. Your data is used solely to power the AI and personalize your experience. We do not sell your data to third parties. Please see our Privacy Policy for full details.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
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
