

"use client";

import { Button } from "@/components/ui/button";
import { Rocket, LogIn, TrendingUp, Zap, Target, Star, ShieldCheck, BarChart, BrainCircuit, Check, Award, Smile, DollarSign, ArrowUpCircle, BookOpen, ListChecks, PenSquare, MessageSquare, Users, UserCheck, FileText, X, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard icon={<UserCheck className="w-8 h-8" />} value={stats.students} label="Students Guided" isLoading={loading} />
            <StatCard icon={<BrainCircuit className="w-8 h-8" />} value={stats.colleges} label="College Matches Found" isLoading={loading} />
            <StatCard icon={<Award className="w-8 h-8" />} value={stats.scholarships} label="Scholarships Found" isLoading={loading} />
            <StatCard icon={<FileText className="w-8 h-8" />} value={stats.essays} label="Essays Reviewed" isLoading={loading} />
        </div>
    );
}

const allFeatures = [
    { 
        icon: BrainCircuit, 
        title: "Hyper-Personalized Roadmap", 
        description: "Our system builds a dynamic, multi-year strategy based on deep analysis of your goals and passions."
    },
    { 
        icon: BrainCircuit, 
        title: "Intelligent College Finder", 
        description: "Discover universities that perfectly match your academic profile, interests, and learning preferences."
    },
    { 
        icon: BookOpen, 
        title: "Smart Study Buddy", 
        description: "Instantly generate flashcards and quizzes, or find the web's best resource for any topic."
    },
    { 
        icon: TrendingUp, 
        title: "Progress Tracker", 
        description: "Visualize your journey, track completed tasks, and watch your long-term goals get closer every day."
    },
    { 
        icon: Share2, 
        title: "Shareable Portfolio", 
        description: "Generate a professional, public portfolio page to showcase your achievements to colleges and counselors."
    },
    { 
        icon: Award, 
        title: "Personalized Scholarship Finder", 
        description: "Let our system find financial aid opportunities tailored to your unique skills and background."
    },
    { 
        icon: PenSquare, 
        title: "Instant Essay Review", 
        description: "Get instant, actionable feedback on your college essays to improve clarity, structure, and impact."
    },
    { 
        icon: Users, 
        title: "Q&A Forum", 
        description: "Connect with experienced mentors and collaborate with peers in our exclusive Q&A community."
    },
];


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">AI School Mentor</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-12 pb-16 md:pt-24 md:pb-32 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl mx-auto">
               <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold mb-4 border border-primary/20 text-primary">
                Your Co-Pilot for Academic & Career Victory
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                Your Path to Academic Victory
              </h2>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                AI School Mentor is your dedicated co-pilot, building a unique strategy that sharpens your skills and crafts a standout profile to get you into your dream college.
              </p>
              <div className="mt-8 space-x-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30">
                    <Link href="/signup">
                        <Rocket className="mr-2 h-5 w-5" />
                        Start Your Journey
                    </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-border hover:bg-primary/10">
                  <Link href="#features">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            <div className="max-w-6xl mx-auto">
              <LiveStats />
            </div>
          </div>
        </section>
        
        {/* Who Is This For? Section */}
        <section id="who-is-this-for" className="py-24 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">Built For Every Stage of the Journey</h3>
                    <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Whether you're just starting high school or you're a parent supporting your child, AI School Mentor is your strategic partner.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="p-8 text-center">
                        <Avatar className="w-20 h-20 mx-auto mb-4"><AvatarFallback className="text-2xl">9th</AvatarFallback></Avatar>
                        <h4 className="text-xl font-semibold">The Ambitious 9th Grader</h4>
                        <p className="text-muted-foreground mt-2">Lay the perfect foundation. We'll help you explore your interests, build foundational skills, and choose extracurriculars that will grow with you, setting you up for long-term success.</p>
                    </Card>
                    <Card className="p-8 text-center border-primary ring-2 ring-primary">
                        <Avatar className="w-20 h-20 mx-auto mb-4"><AvatarFallback className="text-2xl">11th</AvatarFallback></Avatar>
                        <h4 className="text-xl font-semibold">The Stressed-Out 11th Grader</h4>
                        <p className="text-muted-foreground mt-2">Turn stress into strategy. It's crunch time. We'll help you sharpen your "spike," prepare for standardized tests, and start crafting a compelling narrative for your college applications.</p>
                    </Card>
                    <Card className="p-8 text-center">
                        <Avatar className="w-20 h-20 mx-auto mb-4"><AvatarFallback><Users/></AvatarFallback></Avatar>
                        <h4 className="text-xl font-semibold">The Supportive Parent</h4>
                        <p className="text-muted-foreground mt-2">Be their best advocate. Get clarity on your child's progress with our visual trackers and provide them with the best tools to succeed, from essay reviews to on-demand study help.</p>
                    </Card>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">Your Unfair Advantage</h3>
                    <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Our platform is engineered with a powerful suite of tools to give you an unparalleled edge.</p>
                </div>
                
                <Card className="p-8 md:p-12 border-border bg-card">
                     <h4 className="text-3xl font-bold text-center mb-8">All Features Included</h4>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                        {allFeatures.map((feature, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit h-fit">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-lg">{feature.title}</h5>
                                    <p className="text-muted-foreground mt-1">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </section>

        {/* Feature Spotlight Section */}
        <section id="feature-spotlight" className="py-24 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <Badge variant="outline" className="border-primary/50 text-primary">Feature Spotlight</Badge>
                        <h3 className="text-4xl font-bold tracking-tight">Go Beyond Checklists with a Dynamic Strategic Roadmap</h3>
                        <p className="text-muted-foreground text-lg">A simple to-do list isn't enough. Your AI School Mentor Roadmap is a living, intelligent plan that adapts to your growth and helps you build a compelling, unique narrative for college admissions.</p>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h4 className="font-semibold">Narrative-Driven Tasks</h4>
                                    <p className="text-muted-foreground text-sm">Every task is designed to build upon your "spike," turning your interests into a powerful story of leadership and impact.</p>
                                </div>
                            </li>
                             <li className="flex gap-3">
                                <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h4 className="font-semibold">Intelligently-Sourced Resources</h4>
                                    <p className="text-muted-foreground text-sm">Each academic and skill-building task comes with a validated, high-quality online resource to help you learn effectively.</p>
                                </div>
                            </li>
                             <li className="flex gap-3">
                                <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h4 className="font-semibold">Adapts With You</h4>
                                    <p className="text-muted-foreground text-sm">Tell us about new interests or challenges in a weekly check-in, and your plan will be intelligently modified, adding new tasks and refining your strategy.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                     <Image
                        src="https://images.unsplash.com/photo-1542744095-291d1f67b221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxzdHVkZW50JTIwcGxhbm5pbmclMjBvbiUyMGNvbXB1dGVyfGVufDB8fHx8MTc0NTM5MjM5OHww&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="A screenshot of the AI School Mentor dashboard showing the personalized roadmap."
                        width={800}
                        height={600}
                        className="rounded-xl shadow-2xl ring-1 ring-border/10 object-cover"
                        data-ai-hint="student planning computer"
                    />
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold tracking-tight">Your Path to Excellence in 3 Steps</h3>
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
                        src="https://images.unsplash.com/photo-1501250987900-211872d97eaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBjb21wbGV0aW5nJTIwb25saW5lJTIwZ29vZ2xlJTIwZm9ybXxlbnwwfHx8fDE3NTcwNDkwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="A student filling out a detailed form on a laptop."
                        width={800}
                        height={600}
                        className="rounded-xl shadow-xl ring-1 ring-border/10 object-cover"
                        data-ai-hint="person form"
                    />
                </div>
                 <div className="grid md:grid-cols-2 gap-12 items-center">
                     <Image
                        src="https://images.unsplash.com/photo-1727434032792-c7ef921ae086?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8QUl8ZW58MHx8fHwxNzU3MDQ5MDU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="AI dashboard showing a strategic plan."
                        width={800}
                        height={600}
                        className="rounded-xl shadow-xl ring-1 ring-border/10 object-cover md:order-2"
                        data-ai-hint="AI"
                    />
                    <div className="md:order-1">
                        <Badge variant="outline" className="mb-4">Step 2</Badge>
                        <h4 className="text-3xl font-bold tracking-tight">Receive Your Personal Strategy</h4>
                        <p className="text-muted-foreground mt-4">With your profile complete, our system gets to work. It analyzes your unique data to generate a bespoke, long-term roadmap filled with hyper-specific, actionable milestones. This isn't a generic checklist; it's a strategic plan designed to maximize your potential.</p>
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <Badge variant="outline" className="mb-4">Step 3</Badge>
                        <h4 className="text-3xl font-bold tracking-tight">Execute and Achieve</h4>
                        <p className="text-muted-foreground mt-4">Your plan is set. Now, it's time to execute. Follow your roadmap, track your progress, and leverage our powerful suite of tools—from the Study Buddy to your Shareable Portfolio—to overcome challenges and reach your goals.</p>
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
                    <h3 className="text-4xl font-bold tracking-tight">Why AI School Mentor?</h3>
                    <p className="text-muted-foreground mt-3 max-w-3xl mx-auto">While traditional methods offer generic advice, AI School Mentor provides a hyper-personalized, data-driven engine for your success. Here’s how we compare:</p>
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
                            AI School Mentor
                        </CardTitle>
                        <ul className="space-y-3 text-left text-muted-foreground text-sm">
                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0"/>24/7 personal co-pilot, available anytime, anywhere.</li>
                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0"/>Hyper-personalized strategy based on your unique profile.</li>
                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0"/>Dynamic roadmap that evolves as you grow.</li>
                            <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0"/>Completely free to use.</li>
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
                            <AccordionTrigger>How does the AI personalization work?</AccordionTrigger>
                            <AccordionContent>
                            Our system uses the information you provide during onboarding—your strengths, interests, and goals—to power a large language model. This model is trained to think like an expert educational strategist. It doesn't just match keywords; it understands the underlying skills and potential in your profile to create a truly unique and expansive strategic plan, complete with validated resources for each step.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Is AI School Mentor suitable for my child's age?</AccordionTrigger>
                            <AccordionContent>
                            Yes! AI School Mentor is designed for students from middle school through high school. For younger students, our system focuses on exploration, skill-building, and discovering new interests. As students get older, the recommendations become more focused on college preparation, leadership, and building a standout profile.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>What features are included?</AccordionTrigger>
                            <AccordionContent>
                            AI School Mentor is completely free and includes everything we have to offer: the personalized roadmap, college finder, progress tracker, study buddy, shareable portfolio, AI Essay Reviewer, Scholarship Finder, and the student Q&A Forum. We believe in providing all our tools to every user.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>How is this different from a traditional college counselor?</AccordionTrigger>
                            <AccordionContent>
                            AI School Mentor acts as a 24/7 personal co-pilot that complements the work of human counselors. We provide instant, data-driven strategic planning, on-demand study tools, and continuous progress tracking that a human counselor typically cannot offer at scale. 
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-5">
                            <AccordionTrigger>Is there any cost to use AI School Mentor?</AccordionTrigger>
                            <AccordionContent>
                            No, AI School Mentor is completely free to use. All features are available to all users without any charge.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-6">
                            <AccordionTrigger>Is my personal and academic data secure?</AccordionTrigger>
                            <AccordionContent>
                            Data privacy and security are our top priorities. We use industry-standard encryption and security protocols to protect your information. Your data is used solely to personalize your experience and is never sold to third parties. Please see our Privacy Policy for full details.
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
                        <BrainCircuit className="w-8 h-8 text-primary" />
                        <h1 className="text-2xl font-bold tracking-tight">AI School Mentor</h1>
                    </Link>
                    <p className="text-muted-foreground text-sm">Your co-pilot for academic and career victory.</p>
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
                 © {new Date().getFullYear()} AI School Mentor. All Rights Reserved.
             </div>
        </div>
      </footer>
    </div>
  );
}
