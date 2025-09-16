
"use client";

import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/logo";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center">
                <Link href="/" className="flex items-center gap-2 mr-auto">
                    <AppLogo className="w-8 h-8 text-primary" />
                    <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">AI School Mentor</h1>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/#features" className="hover:text-primary transition-colors">Features</Link>
                    <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                </nav>
                <div className="hidden md:flex items-center gap-2 ml-6">
                    <Button asChild variant="secondary">
                        <Link href="/login">Member Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Get Started</Link>
                    </Button>
                </div>
                 <div className="md:hidden ml-4">
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>
            </div>
             {isMenuOpen && (
                <div className="md:hidden bg-background/95 border-t border-border/10">
                    <div className="container mx-auto flex flex-col items-center gap-4 py-4">
                        <Link href="/#features" className="hover:text-primary transition-colors w-full text-center py-2" onClick={() => setIsMenuOpen(false)}>Features</Link>
                        <Link href="/about" className="hover:text-primary transition-colors w-full text-center py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
                        <Link href="/contact" className="hover:text-primary transition-colors w-full text-center py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                        <div className="flex flex-col gap-4 w-full pt-4 border-t border-border/10">
                             <Button asChild variant="secondary" className="w-full">
                                <Link href="/login">Member Login</Link>
                            </Button>
                            <Button asChild className="w-full">
                                <Link href="/signup">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
