import { Button } from "@/components/ui/button";
import { Rocket, LogIn, TrendingUp, Zap, Target, Star, ShieldCheck, BarChart, BrainCircuit, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-body">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Rocket className="w-8 h-8 text-vivid-blue" />
            <h1 className="text-2xl font-bold tracking-tight">PinnaclePath</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium ml-auto">
            <Link href="#features" className="hover:text-vivid-blue transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-vivid-blue transition-colors">How It Works</Link>
            <Link href="#testimonials" className="hover:text-vivid-blue transition-colors">Testimonials</Link>
            <Link href="#pricing" className="hover:text-vivid-blue transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4 ml-auto md:ml-6">
            <Button variant="ghost" asChild className="hover:bg-white/10">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="bg-vivid-blue text-white hover:bg-vivid-blue/90 shadow-lg shadow-vivid-blue/30">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-40 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="container relative mx-auto">
            <div className="max-w-4xl mx-auto">
               <div className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-semibold mb-4 border border-white/20">
                Your Personal AI Mentor for College & Career Success
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                Chart Your Course to the Top.
              </h2>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-400">
                PinnaclePath leverages cutting-edge AI to provide elite, personalized guidance. We analyze your unique profile to build a strategic roadmap that maximizes your potential and paves the way to your dream university and beyond.
              </p>
              <div className="mt-8 space-x-4">
                <Button size="lg" asChild className="bg-vivid-blue text-white hover:bg-vivid-blue/90 shadow-lg shadow-vivid-blue/30">
                  <Link href="/signup">
                    <Rocket className="mr-2 h-5 w-5" />
                    Begin Your Ascent
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-white/20 hover:bg-white/10">
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
                alt="PinnaclePath platform screenshot"
                width={1200}
                height={600}
                className="rounded-xl shadow-2xl mx-auto ring-1 ring-white/10"
                data-ai-hint="dashboard user interface"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-900/50">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">The PinnaclePath Advantage</h3>
                    <p className="text-gray-400 mt-3 max-w-2xl mx-auto">Our platform is engineered to give you an unparalleled edge in the competitive landscape of college admissions.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 bg-gray-800/50 rounded-xl shadow-lg border border-white/10 transition-all hover:border-vivid-blue/50 hover:scale-105">
                        <BrainCircuit className="w-12 h-12 text-vivid-blue mx-auto mb-4"/>
                        <h4 className="text-xl font-semibold">Hyper-Personalized Roadmap</h4>
                        <p className="text-gray-400 mt-2">Our AI doesn't just suggest tasks; it builds a dynamic, multi-year strategy based on deep analysis of your goals and abilities.</p>
                    </div>
                    <div className="p-8 bg-gray-800/50 rounded-xl shadow-lg border border-white/10 transition-all hover:border-vivid-blue/50 hover:scale-105">
                        <BarChart className="w-12 h-12 text-vivid-blue mx-auto mb-4"/>
                        <h4 className="text-xl font-semibold">Predictive Analytics</h4>
                        <p className="text-gray-400 mt-2">Understand your admissions chances with our data-driven insights, helping you target the right schools with confidence.</p>
                    </div>
                    <div className="p-8 bg-gray-800/50 rounded-xl shadow-lg border border-white/10 transition-all hover:border-vivid-blue/50 hover:scale-105">
                        <ShieldCheck className="w-12 h-12 text-vivid-blue mx-auto mb-4"/>
                        <h4 className="text-xl font-semibold">Elite Opportunity Network</h4>
                        <p className="text-gray-400 mt-2">Gain access to a curated database of prestigious programs, internships, and competitions that make your application shine.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold tracking-tight">Your Path to Excellence in 3 Steps</h3>
               <p className="text-gray-400 mt-3 max-w-2xl mx-auto">Our streamlined process makes it simple to get started on your journey to success.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 items-start relative">
                <div className="absolute top-8 left-0 w-full h-1 bg-white/10 hidden md:block">
                    <div className="h-1 bg-vivid-blue w-1/2"></div>
                </div>
              <div className="flex flex-col items-center text-center relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-vivid-blue text-white text-2xl font-bold mb-4 border-4 border-gray-900 z-10">1</div>
                <h4 className="text-xl font-semibold mt-4">Complete Your Profile</h4>
                <p className="text-gray-400 mt-2">Provide a comprehensive overview of your academic record, extracurricular involvement, and future aspirations.</p>
              </div>
              <div className="flex flex-col items-center text-center relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-vivid-blue text-white text-2xl font-bold mb-4 border-4 border-gray-900 z-10">2</div>
                <h4 className="text-xl font-semibold mt-4">Receive Your AI Strategy</h4>
                <p className="text-gray-400 mt-2">Our system analyzes your data to generate a bespoke, long-term roadmap with actionable milestones.</p>
              </div>
              <div className="flex flex-col items-center text-center relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-vivid-blue text-white text-2xl font-bold mb-4 border-4 border-gray-900 z-10">3</div>
                <h4 className="text-xl font-semibold mt-4">Execute and Dominate</h4>
                <p className="text-gray-400 mt-2">Follow your tailored plan, track your progress with advanced tools, and adapt as you achieve and grow.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-gray-900/50">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">From Ambitious Students, For Ambitious Students</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-white/10">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="female student" />
                                <AvatarFallback>JS</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">Jessica S.</p>
                                <p className="text-sm text-gray-400">Accepted to Stanford</p>
                            </div>
                        </div>
                        <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-bright-orange fill-bright-orange"/>)}</div>
                        <p className="text-gray-300 italic">"PinnaclePath was my secret weapon. The AI-driven plan was more detailed than any counselor could provide. I knew exactly what to do and when."</p>
                    </div>
                     <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-white/10">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="male student" />
                                <AvatarFallback>MI</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">Michael I.</p>
                                <p className="text-sm text-gray-400">Future AI Researcher</p>
                            </div>
                        </div>
                        <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-bright-orange fill-bright-orange"/>)}</div>
                        <p className="text-gray-300 italic">"I discovered a passion for AI ethics through a research opportunity PinnaclePath found for me. It changed the entire focus of my applications."</p>
                    </div>
                     <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-white/10">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="student face" />
                                <AvatarFallback>EA</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">Emily A.</p>
                                <p className="text-sm text-gray-400">Accepted to MIT</p>
                            </div>
                        </div>
                        <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-bright-orange fill-bright-orange"/>)}</div>
                        <p className="text-gray-300 italic">"The roadmap kept me on track with my applications and I got into my dream school! The progress tracker was super motivating."</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">Invest in Your Future</h3>
                    <p className="text-gray-400 mt-3 max-w-2xl mx-auto">Choose the plan that aligns with your ambition. A small investment today for a future of limitless opportunities.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="p-8 bg-gray-800/50 rounded-xl shadow-lg border border-white/10 flex flex-col">
                        <h4 className="text-2xl font-semibold">Standard</h4>
                        <p className="text-4xl font-bold my-4">$29<span className="text-lg font-medium text-gray-400">/mo</span></p>
                        <ul className="space-y-3 text-gray-300 flex-1">
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-vivid-blue"/>AI-Powered Roadmap</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-vivid-blue"/>Progress Tracking</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-vivid-blue"/>Basic Opportunity Matching</li>
                        </ul>
                        <Button variant="outline" className="w-full mt-8 border-white/20 hover:bg-white/10">Get Started</Button>
                    </div>
                    <div className="p-8 bg-vivid-blue/10 rounded-xl shadow-lg border border-vivid-blue flex flex-col relative">
                         <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <div className="bg-vivid-blue text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                        </div>
                        <h4 className="text-2xl font-semibold text-vivid-blue">Elite</h4>
                        <p className="text-4xl font-bold my-4">$49<span className="text-lg font-medium text-gray-400">/mo</span></p>
                        <ul className="space-y-3 text-gray-300 flex-1">
                             <li className="flex items-center gap-2"><Check className="w-5 h-5 text-vivid-blue"/>Everything in Standard, plus:</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-vivid-blue"/>Predictive Admissions Analytics</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-vivid-blue"/>Elite Opportunity Network Access</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-vivid-blue"/>Priority Support</li>
                        </ul>
                        <Button className="w-full mt-8 bg-vivid-blue text-white hover:bg-vivid-blue/90 shadow-lg shadow-vivid-blue/30">Choose Elite</Button>
                    </div>
                </div>
            </div>
        </section>

      </main>

      <footer className="container mx-auto text-center p-8 text-sm text-gray-500 border-t border-white/10">
        © {new Date().getFullYear()} PinnaclePath. All Rights Reserved. For the ambitious.
      </footer>
    </div>
  );
}
