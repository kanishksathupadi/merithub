
import { Button } from "@/components/ui/button";
import { Rocket, LogIn, TrendingUp, Zap, Target, Star, ShieldCheck, BarChart, BrainCircuit, Check, GraduationCap, Award, Smile, DollarSign, ArrowUpCircle } from "lucide-react";
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
          <div className="flex items-center gap-4 ml-auto">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30">
              <Link href="/signup?plan=elite">Get Started</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl mx-auto">
               <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold mb-4 border border-primary/20 text-primary">
                Your Personal AI Mentor for College & Career Success
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                Chart Your Course to the Top.
              </h2>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                PinnaclePath leverages cutting-edge AI to provide elite, personalized guidance. We analyze your unique profile to build a strategic roadmap that maximizes your potential and paves the way to your dream university and beyond.
              </p>
              <div className="mt-8 space-x-4">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30">
                  <Link href="/signup?plan=elite">
                    <Rocket className="mr-2 h-5 w-5" />
                    Begin Your Ascent
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-border hover:bg-accent/10">
                  <Link href="/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Member Login
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-16">
               <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
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
                <Smile className="w-10 h-10 text-primary mb-2" />
                <h4 className="text-3xl lg:text-4xl font-bold text-foreground">95%</h4>
                <p className="text-muted-foreground mt-1">User Satisfaction</p>
              </div>
              <div className="flex flex-col items-center">
                <Award className="w-10 h-10 text-primary mb-2" />
                <h4 className="text-3xl lg:text-4xl font-bold text-foreground">80%</h4>
                <p className="text-muted-foreground mt-1">Top 50 School Acceptance</p>
              </div>
              <div className="flex flex-col items-center">
                <DollarSign className="w-10 h-10 text-primary mb-2" />
                <h4 className="text-3xl lg:text-4xl font-bold text-foreground">$50k+</h4>
                <p className="text-muted-foreground mt-1">Avg. Scholarships</p>
              </div>
              <div className="flex flex-col items-center">
                <ArrowUpCircle className="w-10 h-10 text-primary mb-2" />
                <h4 className="text-3xl lg:text-4xl font-bold text-foreground">4x</h4>
                <p className="text-muted-foreground mt-1">Increased Productivity</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">The PinnaclePath Advantage</h3>
                    <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Our platform is engineered to give you an unparalleled edge in the competitive landscape of college admissions.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 bg-card rounded-xl shadow-lg border border-border transition-all hover:border-primary/50 hover:scale-105">
                        <BrainCircuit className="w-12 h-12 text-primary mx-auto mb-4"/>
                        <h4 className="text-xl font-semibold">Hyper-Personalized Roadmap</h4>
                        <p className="text-muted-foreground mt-2">Our AI doesn't just suggest tasks; it builds a dynamic, multi-year strategy based on deep analysis of your goals and abilities.</p>
                    </div>
                    <div className="p-8 bg-card rounded-xl shadow-lg border border-border transition-all hover:border-primary/50 hover:scale-105">
                        <BarChart className="w-12 h-12 text-primary mx-auto mb-4"/>
                        <h4 className="text-xl font-semibold">Predictive Analytics</h4>
                        <p className="text-muted-foreground mt-2">Understand your admissions chances with our data-driven insights, helping you target the right schools with confidence.</p>
                    </div>
                    <div className="p-8 bg-card rounded-xl shadow-lg border border-border transition-all hover:border-primary/50 hover:scale-105">
                        <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4"/>
                        <h4 className="text-xl font-semibold">Elite Opportunity Network</h4>
                        <p className="text-muted-foreground mt-2">Gain access to a curated database of prestigious programs, internships, and competitions that make your application shine.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
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
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4 border-4 border-background z-10">1</div>
                <h4 className="text-xl font-semibold mt-4">Complete Your Profile</h4>
                <p className="text-muted-foreground mt-2">Provide a comprehensive overview of your academic record, extracurricular involvement, and future aspirations.</p>
              </div>
              <div className="flex flex-col items-center text-center relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4 border-4 border-background z-10">2</div>
                <h4 className="text-xl font-semibold mt-4">Receive Your AI Strategy</h4>
                <p className="text-muted-foreground mt-2">Our system analyzes your data to generate a bespoke, long-term roadmap with actionable milestones.</p>
              </div>
              <div className="flex flex-col items-center text-center relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4 border-4 border-background z-10">3</div>
                <h4 className="text-xl font-semibold mt-4">Execute and Dominate</h4>
                <p className="text-muted-foreground mt-2">Follow your tailored plan, track your progress with advanced tools, and adapt as you achieve and grow.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-background/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">From Ambitious Students, For Ambitious Students</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="female student" />
                                <AvatarFallback>JS</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">Jessica S.</p>
                                <p className="text-sm text-muted-foreground">Accepted to Stanford</p>
                            </div>
                        </div>
                        <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-accent fill-accent"/>)}</div>
                        <p className="text-foreground/80 italic">"PinnaclePath was my secret weapon. The AI-driven plan was more detailed than any counselor could provide. I knew exactly what to do and when."</p>
                    </div>
                     <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="male student" />
                                <AvatarFallback>MI</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">Michael I.</p>
                                <p className="text-sm text-muted-foreground">Future AI Researcher</p>
                            </div>
                        </div>
                        <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-accent fill-accent"/>)}</div>
                        <p className="text-foreground/80 italic">"I discovered a passion for AI ethics through a research opportunity PinnaclePath found for me. It changed the entire focus of my applications."</p>
                    </div>
                     <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="student face" />
                                <AvatarFallback>EA</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">Emily A.</p>
                                <p className="text-sm text-muted-foreground">Accepted to MIT</p>
                            </div>
                        </div>
                        <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-accent fill-accent"/>)}</div>
                        <p className="text-foreground/80 italic">"The roadmap kept me on track with my applications and I got into my dream school! The progress tracker was super motivating."</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
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
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>AI-Powered Roadmap</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>Progress Tracking</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>Basic Opportunity Matching</li>
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
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>Predictive Admissions Analytics</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>Elite Opportunity Network Access</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary"/>Priority Support</li>
                        </ul>
                        <Button asChild className="w-full mt-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30">
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
