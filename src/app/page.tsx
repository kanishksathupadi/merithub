
import { Button } from "@/components/ui/button";
import { Rocket, LogIn, TrendingUp, Zap, Target, Star, ShieldCheck, BarChart, BrainCircuit, Check, GraduationCap, Award, Smile, DollarSign, ArrowUpCircle, BookOpen, ListChecks, PenSquare, MessageSquare, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          </nav>
          <div className="flex items-center gap-2 ml-auto">
            <Button asChild variant="ghost">
                <Link href="/login">Member Login</Link>
            </Button>
             <Button asChild className="bg-accent text-black hover:bg-accent/90">
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
                Your Personal AI Mentor for Academic Success
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                Smarter Prep, Brighter Future.
              </h2>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                PinnaclePath uses AI to build a personalized roadmap, find best-fit colleges, provide instant essay feedback, and generate on-demand study help to ensure you stand out.
              </p>
              <div className="mt-8 space-x-4">
                <Button size="lg" asChild className="bg-accent text-black hover:bg-accent/90 shadow-lg shadow-accent/30">
                  <Link href="/signup">
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Your Journey
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-border hover:bg-accent/10">
                  <Link href="#features">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-20">
               <Image
                src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzbGVlayUyMGRhcmslMjBtb2RlJTIwYXBwbGljYXRpb24lMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzIyMTQ5NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="A sleek application dashboard showing charts and data, representing the PinnaclePath platform."
                width={1200}
                height={400}
                className="rounded-xl shadow-2xl mx-auto ring-1 ring-border/10 object-cover"
                data-ai-hint="app dashboard"
              />
            </div>
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
            <div className="grid md:grid-cols-3 gap-12 items-start relative">
                <div className="absolute top-8 left-0 w-full h-px bg-border hidden md:block">
                    <div className="h-px bg-primary w-full"></div>
                </div>
              <div className="flex flex-col items-center text-center relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4 border-4 border-muted z-10">1</div>
                <h4 className="text-xl font-semibold mt-4">Complete Your Profile</h4>
                <p className="text-muted-foreground mt-2">Provide a comprehensive overview of your academic record, extracurriculars, and future aspirations.</p>
              </div>
              <div className="flex flex-col items-center text-center relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4 border-4 border-muted z-10">2</div>
                <h4 className="text-xl font-semibold mt-4">Receive Your AI Strategy</h4>
                <p className="text-muted-foreground mt-2">Our system analyzes your data to generate a bespoke, long-term roadmap with actionable milestones.</p>
              </div>
              <div className="flex flex-col items-center text-center relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4 border-4 border-muted z-10">3</div>
                <h4 className="text-xl font-semibold mt-4">Execute and Achieve</h4>
                <p className="text-muted-foreground mt-2">Follow your plan, track your progress, and use powerful AI tools to overcome any academic challenge.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">From Ambitious Students, For Ambitious Students</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src="https://images.unsplash.com/photo-1610012525054-b6ab57df6105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmZW1hbGUlMjBzdHVkZW50fGVufDB8fHx8MTc1NTM0NTY5N3ww&ixlib=rb-4.1.0&q=80&w=1080" data-ai-hint="female student" />
                                <AvatarFallback>JS</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">Jessica S.</p>
                                <p className="text-sm text-muted-foreground">High School Junior</p>
                            </div>
                        </div>
                        <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-accent fill-accent"/>)}</div>
                        <p className="text-foreground/80 italic">"The AI College Finder was incredible. It suggested schools I hadn't even heard of that were a perfect fit for my niche interest in historical linguistics."</p>
                    </div>
                     <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src="https://images.unsplash.com/photo-1624918479892-3e5df2910410?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYWxlJTIwc3R1ZGVudHxlbnwwfHx8fDE3NTUzNDU2OTd8MA&ixlib=rb-4.1.0&q=80&w=1080" data-ai-hint="male student" />
                                <AvatarFallback>MI</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">Michael I.</p>
                                <p className="text-sm text-muted-foreground">AP Student</p>
                            </div>
                        </div>
                        <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-accent fill-accent"/>)}</div>
                        <p className="text-foreground/80 italic">"The AI Study Buddy's Resource Finder is my go-to. It consistently finds the best, most relevant articles and videos, saving me hours of searching."</p>
                    </div>
                     <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src="https://images.unsplash.com/photo-1631304672439-f6ef24965cc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxzdHVkZW50JTIwZmFjZXxlbnwwfHx8fDE3NTU0MDkwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080" data-ai-hint="student face" />
                                <AvatarFallback>EA</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">Emily A.</p>
                                <p className="text-sm text-muted-foreground">Future Valedictorian</p>
                            </div>
                        </div>
                        <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-accent fill-accent"/>)}</div>
                        <p className="text-foreground/80 italic">"The AI Essay Review tool is a game-changer. My common app essay is so much stronger now after getting instant feedback on my structure and clarity."</p>
                    </div>
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
                    <div className="p-8 bg-card rounded-xl shadow-lg border border-border flex flex-col">
                        <h4 className="text-2xl font-semibold">Standard</h4>
                        <p className="text-4xl font-bold my-4">$29<span className="text-lg font-medium text-muted-foreground">/mo</span></p>
                        <ul className="space-y-3 text-muted-foreground flex-1">
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>AI-Personalized Roadmap</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>AI College Finder</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>Detailed Progress Tracking</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>AI Study Buddy (Quizzes & Flashcards)</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>AI Resource Finder</li>
                        </ul>
                        <Button asChild variant="outline" className="w-full mt-8 border-border hover:bg-accent/10">
                           <Link href="/signup?plan=standard">Choose Standard</Link>
                        </Button>
                    </div>
                    <div className="p-8 bg-primary/10 rounded-xl shadow-lg border border-primary flex flex-col relative">
                         <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                        </div>
                        <h4 className="text-2xl font-semibold text-primary">Elite</h4>
                        <p className="text-4xl font-bold my-4">$49<span className="text-lg font-medium text-muted-foreground">/mo</span></p>
                        <ul className="space-y-3 text-muted-foreground flex-1">
                             <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>Everything in Standard, plus:</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary font-semibold text-foreground/90"/>AI Essay Review Tool</li>
                             <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary font-semibold text-foreground/90"/>AI Scholarship Finder</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary font-semibold text-foreground/90"/>Mentor Match Directory</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary font-semibold text-foreground/90"/>Community Q&A Forum</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>Priority Support</li>
                        </ul>
                        <Button asChild className="w-full mt-8 bg-accent text-black hover:bg-accent/90 shadow-lg shadow-accent/30">
                            <Link href="/signup?plan=elite">Choose Elite</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>

      </main>

      <footer className="container mx-auto text-center p-8 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} PinnaclePath. All Rights Reserved. For the ambitious.
      </footer>
    </div>
  );
}
