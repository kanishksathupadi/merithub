import { Button } from "@/components/ui/button";
import { Rocket, LogIn, TrendingUp, Zap, Target, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Rocket className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">PinnaclePath</h1>
          </Link>
          <nav className="flex items-center gap-4 text-sm ml-auto">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary-foreground">
                Unlock Your Full Potential.
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                PinnaclePath is your AI-powered mentor, crafting a personalized roadmap to your dream college and career. Stop guessing, start achieving.
              </p>
              <div className="mt-8 space-x-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    <Rocket className="mr-2 h-5 w-5" />
                    Claim Your Future
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Member Login
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-16">
              <Image
                src="https://placehold.co/1200x600.png"
                alt="Dashboard preview"
                width={1200}
                height={600}
                className="rounded-xl shadow-2xl mx-auto ring-1 ring-white/10"
                data-ai-hint="futuristic dashboard"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary/20">
            <div className="container">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold">The PinnaclePath Advantage</h3>
                    <p className="text-muted-foreground mt-2">Everything you need to succeed, personalized for you.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-card rounded-lg shadow-md">
                        <Target className="w-12 h-12 text-primary mx-auto mb-4"/>
                        <h4 className="text-xl font-semibold">AI-Powered Roadmap</h4>
                        <p className="text-muted-foreground mt-2">Get a step-by-step action plan tailored to your unique goals, strengths, and interests.</p>
                    </div>
                    <div className="p-6 bg-card rounded-lg shadow-md">
                        <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4"/>
                        <h4 className="text-xl font-semibold">Progress Tracking</h4>
                        <p className="text-muted-foreground mt-2">Visualize your growth and celebrate milestones on your journey to success.</p>
                    </div>
                    <div className="p-6 bg-card rounded-lg shadow-md">
                        <Zap className="w-12 h-12 text-primary mx-auto mb-4"/>
                        <h4 className="text-xl font-semibold">Opportunity Matching</h4>
                        <p className="text-muted-foreground mt-2">Discover extracurriculars, competitions, and resources that match your profile.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold">Your Path in Three Simple Steps</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">1</div>
                <h4 className="text-xl font-semibold">Tell Us Your Story</h4>
                <p className="text-muted-foreground mt-2">Complete a brief onboarding questionnaire about your academics, interests, and aspirations.</p>
              </div>
              <div className="flex flex-col items-center text-center mt-8 md:mt-0">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">2</div>
                <h4 className="text-xl font-semibold">Get Your AI Roadmap</h4>
                <p className="text-muted-foreground mt-2">Our AI analyzes your profile to generate a personalized, actionable plan for you to follow.</p>
              </div>
              <div className="flex flex-col items-center text-center mt-8 md:mt-0">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">3</div>
                <h4 className="text-xl font-semibold">Achieve Your Goals</h4>
                <p className="text-muted-foreground mt-2">Follow your tasks, track your progress, and adapt your plan as you grow and your goals evolve.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-secondary/20">
            <div className="container">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold">Loved by Ambitious Students</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-card p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="female student" />
                                <AvatarFallback>JS</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">Jessica S.</p>
                                <p className="text-sm text-muted-foreground">11th Grade</p>
                            </div>
                        </div>
                        <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-accent fill-accent"/>)}</div>
                        <p className="text-muted-foreground">"PinnaclePath took the guesswork out of college prep. I finally have a clear plan!"</p>
                    </div>
                     <div className="bg-card p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="male student" />
                                <AvatarFallback>MI</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">Michael I.</p>
                                <p className="text-sm text-muted-foreground">10th Grade</p>
                            </div>
                        </div>
                        <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-accent fill-accent"/>)}</div>
                        <p className="text-muted-foreground">"I discovered a passion for coding through a summer program PinnaclePath recommended."</p>
                    </div>
                     <div className="bg-card p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="student face" />
                                <AvatarFallback>EA</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">Emily A.</p>
                                <p className="text-sm text-muted-foreground">12th Grade</p>
                            </div>
                        </div>
                        <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-accent fill-accent"/>)}</div>
                        <p className="text-muted-foreground">"The roadmap kept me on track with my applications and I got into my dream school!"</p>
                    </div>
                </div>
            </div>
        </section>

      </main>

      <footer className="text-center p-6 text-sm text-muted-foreground border-t border-border/40">
        © {new Date().getFullYear()} PinnaclePath. All rights reserved.
      </footer>
    </div>
  );
}
