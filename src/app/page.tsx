import { Button } from "@/components/ui/button";
import { Rocket, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Rocket className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">PinnaclePath</h1>
        </Link>
        <nav className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <section className="w-full max-w-4xl">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tighter">
              Your journey to the top starts here — one step at a time.
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              PinnaclePath gives you a personalized, step-by-step action plan.
              Stop guessing, start achieving.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90">
                <Link href="/signup">
                  <Rocket className="mr-2 h-5 w-5" />
                  Get Started
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-5 w-5" />
                  Log In
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-12">
            <Image
              src="https://placehold.co/1200x600.png"
              alt="Students collaborating and achieving goals"
              width={1200}
              height={600}
              className="rounded-xl shadow-2xl mx-auto"
              data-ai-hint="students learning"
            />
          </div>
        </section>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} PinnaclePath. All rights reserved.
      </footer>
    </div>
  );
}
