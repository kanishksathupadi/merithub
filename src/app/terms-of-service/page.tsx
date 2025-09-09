
"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TermsOfServicePage() {
    const router = useRouter();

    return (
        <div className="bg-muted min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center">
                    <Link href="/" className="flex items-center gap-2 mr-6">
                        <GraduationCap className="w-8 h-8 text-primary" />
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
            <div className="container mx-auto py-12 px-4 max-w-4xl bg-background mt-8 rounded-lg border">
                 <header className="mb-8 text-center border-b pb-8">
                    <h2 className="text-4xl font-bold tracking-tight">Terms of Service</h2>
                    <p className="text-muted-foreground mt-2">Last Updated: 09/03/2025</p>
                </header>

                <div className="prose prose-invert prose-lg mx-auto text-foreground/80 text-sm space-y-6">
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">1. Agreement to Terms</h3>
                        <p>Welcome to PinnaclePath. These Terms of Service ("Terms") govern your use of the PinnaclePath website, applications, and services (collectively, the "Services"), provided by PinnaclePath Inc. ("PinnaclePath", "we", "us", or "our"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, do not use our Services.</p>
                    </section>

                     <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">2. Privacy Policy</h3>
                        <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal data. By using our Services, you agree to the collection and use of information in accordance with our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference. As our Services may be used by individuals under the age of 18, we handle data with strict adherence to privacy laws concerning minors.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">3. Use of Our Services & Age Restrictions</h3>
                         <p>You must have the consent of a parent or legal guardian who agrees to be bound by these Terms on your behalf if you are considered a minor in your jurisdiction. By using the Services, you represent and warrant that you have obtained such consent. You agree to use our Services only for lawful purposes and in accordance with these Terms. You are responsible for all activity that occurs under your account.</p>
                    </section>
                    
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">4. User Accounts</h3>
                         <p>To access most features of the Service, you must register for an account. You agree that the information you provide is accurate and that you will keep it up-to-date. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.</p>
                    </section>
                    
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">5. Payments and Refunds</h3>
                         <p>Our core Services are currently provided free of charge. We reserve the right to introduce fees for certain features or services in the future. We will notify you before any services you are using begin to carry a fee, and you will have the opportunity to accept the new terms or discontinue use of the service. All transactions for any paid services will be processed through a secure third-party payment processor.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">6. Intellectual Property Rights</h3>
                        <p>The Services and their entire contents, features, and functionality are owned by PinnaclePath, its licensors, or other providers of such material and are protected by international copyright, trademark, and other intellectual property laws. You are granted a limited license to access and use the Services for your personal, non-commercial use only.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">7. User Contributions</h3>
                        <p>The Services may contain interactive features that allow users to post content. Any content you post is your responsibility. By posting content, you grant us a license to use, display, and distribute it in connection with the Services. You agree not to post content that is illegal, obscene, defamatory, or infringes on the rights of others.</p>
                    </section>
                     
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">8. Termination and Suspension</h3>
                        <p>We may terminate or suspend your account and access to the Services at our sole discretion, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Services will immediately cease. You may terminate your account at any time through your account settings or by contacting us.</p>
                    </section>
                    
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">9. Disclaimer of Warranties</h3>
                        <p>THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. PINNACLEPATH EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">10. Limitation on Liability</h3>
                        <p>IN NO EVENT WILL PINNACLEPATH, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICES.</p>
                    </section>
                    
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">11. Indemnification</h3>
                        <p>You agree to indemnify, defend, and hold harmless PinnaclePath and its officers, directors, employees, agents, and affiliates from any and all claims, liabilities, damages, costs, and expenses, including reasonable attorneys' fees, in any way arising from, related to, or in connection with your use of the Services, your violation of these Terms, or your violation of any rights of another.</p>
                    </section>
                    
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">12. Governing Law and Dispute Resolution</h3>
                        <p>These Terms shall be governed by the laws of the State of Delaware, without regard to its conflict of law provisions. You agree that any legal action or proceeding between you and PinnaclePath will be brought exclusively in the federal or state courts located in Delaware. We may, at our sole discretion, require you to submit any disputes arising from these Terms to final and binding arbitration.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">13. Miscellaneous</h3>
                        <p><strong>Severability:</strong> If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions of these Terms will remain in full force and effect.</p>
                        <p><strong>Entire Agreement:</strong> These Terms and our Privacy Policy constitute the entire agreement between you and PinnaclePath regarding your use of the Services and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral.</p>
                        <p><strong>Changes to Terms:</strong> We may revise and update these Terms from time to time. All changes are effective immediately when we post them. Your continued use of the Services following the posting of revised Terms means that you accept and agree to the changes.</p>
                    </section>
                </div>
            </div>
            <footer className="bg-muted/50 border-t border-border mt-8">
                <div className="container mx-auto py-12 px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <GraduationCap className="w-8 h-8 text-primary" />
                                <h1 className="text-2xl font-bold tracking-tight">PinnaclePath</h1>
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
                        © {new Date().getFullYear()} PinnaclePath. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
