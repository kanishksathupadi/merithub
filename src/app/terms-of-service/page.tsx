
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { AppLogo } from "@/components/logo";

export default function TermsOfServicePage() {
    const router = useRouter();

    return (
        <div className="bg-muted min-h-screen">
            <MarketingHeader />
            <div className="container mx-auto py-12 px-4 max-w-4xl bg-background mt-8 rounded-lg border">
                 <header className="mb-8 text-center border-b pb-8">
                    <h2 className="text-4xl font-bold tracking-tight">Terms of Service</h2>
                    <p className="text-muted-foreground mt-2">Last Updated: 09/03/2025</p>
                </header>

                <div className="prose prose-invert prose-lg mx-auto text-foreground/80 text-sm space-y-6">
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">1. Agreement to Terms</h3>
                        <p>Welcome to AI School Mentor. These Terms of Service ("Terms") govern your use of the AI School Mentor website, applications, and services (collectively, the "Services"), provided by AI School Mentor Inc. ("AI School Mentor", "we", "us", or "our"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, do not use our Services.</p>
                    </section>

                     <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">2. Age Restrictions & Parental Consent</h3>
                         <p>Our Services are intended for users who are at least 13 years old. If you are under the age of 18, you must have your parent or legal guardian’s permission to use the Services, and they must agree to these Terms on your behalf. By using the Services, you represent and warrant that you meet these age and consent requirements.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">3. Privacy and Data Protection</h3>
                        <p>Your privacy is critically important to us. Our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> explains how we collect, use, and protect your personal information, including data from minor users, in compliance with applicable laws. The Privacy Policy is incorporated by reference into these Terms. Please review it carefully.</p>
                    </section>
                    
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">4. User Accounts</h3>
                         <p>To access most features of the Service, you must register for an account. You agree that the information you provide is accurate and that you will keep it up-to-date. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.</p>
                    </section>
                    
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">5. Payments, Subscriptions, and Refunds</h3>
                         <p>Our core Services are currently provided free of charge. We reserve the right to introduce fees for certain features in the future. We will notify you before any services you use begin to carry a fee, and you will have the opportunity to accept the new terms or discontinue use. Any transactions will be processed through a secure third-party payment processor.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">6. Intellectual Property Rights</h3>
                        <p>The Services and all of their original content, features, and functionality are owned by AI School Mentor and are protected by international copyright, trademark, and other intellectual property laws. You are granted a limited license to use the Services for personal, non-commercial purposes only.</p>
                    </section>
                     
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">7. Termination and Suspension</h3>
                        <p>We may terminate or suspend your account and access to the Services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason. You may terminate your account at any time.</p>
                    </section>
                    
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">8. Disclaimer of Warranties</h3>
                        <p>The Services are provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">9. Limitation on Liability</h3>
                        <p>In no event shall AI School Mentor, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Services.</p>
                    </section>
                    
                     <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">10. Indemnification</h3>
                        <p>You agree to defend, indemnify, and hold harmless AI School Mentor and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not to attorney's fees), resulting from or arising out of your use and access of the Service, or a breach of these Terms.</p>
                    </section>
                    
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">11. Governing Law & Dispute Resolution</h3>
                        <p>All matters relating to the Service and these Terms and any dispute or claim arising therefrom or related thereto shall be governed by and construed in accordance with the internal laws of the State of California without giving effect to any choice or conflict of law provision or rule. Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Service shall be instituted exclusively in the federal courts of the United States or the courts of the State of California.</p>
                        <p>At our sole discretion, we may require you to submit any disputes arising from the use of these Terms or the Service, including disputes arising from or concerning their interpretation, violation, invalidity, non-performance, or termination, to final and binding arbitration under the Rules of Arbitration of the American Arbitration Association applying California law.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">12. Miscellaneous</h3>
                        <p><strong>Severability:</strong> If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p>
                        <p><strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy, constitute the entire agreement between you and us regarding our Service, and supersede and replace any prior agreements we might have had between us regarding the Service.</p>
                    </section>
                </div>
            </div>
            <footer className="bg-muted/50 border-t border-border mt-8">
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
