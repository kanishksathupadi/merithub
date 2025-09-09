
"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export function MarketingHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center">
                <Link href="/" className="flex items-center gap-2 mr-6">
                    <GraduationCap className="w-8 h-8" />
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
    );
}
