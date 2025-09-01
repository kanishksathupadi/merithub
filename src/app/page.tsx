
"use client";

import { Button } from "@/components/ui/button";
import { Rocket, LogIn, TrendingUp, Zap, Target, Star, ShieldCheck, BarChart, BrainCircuit, Check, GraduationCap, Award, Smile, DollarSign, ArrowUpCircle, BookOpen, ListChecks, PenSquare, MessageSquare, Users, UserCheck, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


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
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
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

        {/* Stats Section */}
        <section className="py-16 bg-muted/50 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <BrainCircuit className="w-10 h-10 text-primary mb-2" />
                <h4 className="text-3xl lg:text-4xl font-bold text-foreground">AI-Powered</h4>
                <p className="text-muted-foreground mt-1">Personalized Plans</p>
              </div>
              <div className="flex flex-col items-center">
                <GraduationCap className="w-10 h-10 text-primary mb-2" />
                <h4 className="text-3xl lg:text-4xl font-bold text-foreground">College Matches</h4>
                <p className="text-muted-foreground mt-1">AI-Powered Recs</p>
              </div>
              <div className="flex flex-col items-center">
                 <PenSquare className="w-10 h-10 text-primary mb-2" />
                <h4 className="text-3xl lg:text-4xl font-bold text-foreground">Instant</h4>
                <p className="text-muted-foreground mt-1">Essay Feedback</p>
              </div>
              <div className="flex flex-col items-center">
                 <TrendingUp className="w-10 h-10 text-primary mb-2" />
                <h4 className="text-3xl lg:text-4xl font-bold text-foreground">Trackable</h4>
                <p className="text-muted-foreground mt-1">Progress</p>
              </div>
            </div>
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

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold tracking-tight">Your Path to Excellence in 3 Steps</h3>
               <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Our streamlined process makes it simple to get started on your journey to success.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <Image
                    src="https://images.unsplash.com/photo-1516542076529-1ea3854896f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxzdHVkZW50JTIwdXNpbmclMjBjb21wdXRlcnxlbnwwfHx8fDE3MjM4MjQxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="A student using a laptop for their academic work, illustrating the PinnaclePath process."
                    width={800}
                    height={600}
                    className="rounded-xl shadow-xl ring-1 ring-border/10 object-cover"
                    data-ai-hint="student computer"
                />
                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold">1</div>
                        <div>
                            <h4 className="text-xl font-semibold">Complete Your Profile</h4>
                            <p className="text-muted-foreground mt-1">Provide a comprehensive overview of your academic record, extracurriculars, and future aspirations.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                         <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold">2</div>
                        <div>
                            <h4 className="text-xl font-semibold">Receive Your AI Strategy</h4>
                            <p className="text-muted-foreground mt-1">Our system analyzes your data to generate a bespoke, long-term roadmap with actionable milestones.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold">3</div>
                        <div>
                            <h4 className="text-xl font-semibold">Execute and Achieve</h4>
                            <p className="text-muted-foreground mt-1">Follow your plan, track your progress, and use powerful AI tools to overcome any academic challenge.</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-background">
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

      </main>

      <footer className="container mx-auto text-center p-8 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} PinnaclePath. All Rights Reserved. <Link href="/terms-of-service" className="hover:text-primary hover:underline">Terms of Service</Link>
      </footer>
    </div>
  );
}
