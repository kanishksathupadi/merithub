
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { AppLogo } from "@/components/logo";

export default function CareersPage() {

    return (
        <div className="bg-background text-foreground">
            <MarketingHeader />
            
            <main>
                 {/* Hero Section */}
                <section className="relative py-20 md:py-32 text-center bg-muted/50">
                    <div className="container relative mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            Join Our Mission
                        </h2>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                            We're building the future of personalized education, and we're always looking for passionate, innovative people to help us achieve our goal.
                        </p>
                        </div>
                    </div>
                </section>

                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-4xl">
                         <div className="text-center">
                            <h3 className="text-4xl font-bold tracking-tight">Current Openings</h3>
                            <div className="flex flex-col items-center mt-8 text-center">
                                <Card className="w-full max-w-lg">
                                    <CardHeader>
                                        <CardTitle>Thank You for Your Interest</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">
                                            While we don't have any open positions at the moment, we're always on the lookout for exceptional talent to join our mission. We encourage you to check back in the future.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-muted/50 border-t border-border">
                <div className="container mx-auto py-12 px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <AppLogo className="w-8 h-8 text-primary" />
                                <h1 className="text-2xl font-bold tracking-tight">AI School Mentor</h1>
                            </Link>
                            <p className="text-muted-foreground text-sm">Your AI co-pilot for academic and career victory.</p>
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
