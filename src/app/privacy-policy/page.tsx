
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { AppLogo } from "@/components/logo";

export default function PrivacyPolicyPage() {
    const router = useRouter();

    return (
        <div className="bg-muted min-h-screen">
            <MarketingHeader />
            <div className="container mx-auto py-12 px-4 max-w-4xl bg-background mt-8 rounded-lg border">
                 <header className="mb-8 text-center border-b pb-8">
                    <h2 className="text-4xl font-bold tracking-tight">Privacy Policy</h2>
                    <p className="text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
                </header>

                <div className="prose prose-invert prose-lg mx-auto text-foreground/80 text-sm space-y-6">
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">1. Introduction</h3>
                        <p>AI School Mentor ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (collectively, the "Services"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the services.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">2. Collection of Your Information</h3>
                        <p>We may collect information about you in a variety of ways. The information we may collect via the Services includes:</p>
                        <p><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, grade level, and school, that you voluntarily give to us when you register with the Services or when you choose to participate in various activities related to the Services (such as our onboarding questionnaire).</p>
                        <p><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Services, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Services. This also includes data generated from your use of the platform, such as roadmap tasks and AI interactions, which are stored to personalize your experience.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">3. Use of Your Information</h3>
                        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Services to:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                           <li>Create and manage your account.</li>
                           <li>Personalize your experience and deliver a hyper-personalized roadmap.</li>
                           <li>Power our AI features, such as the Study Buddy, College Finder, and Essay Reviewer.</li>
                           <li>Email you regarding your account or order.</li>
                           <li>Monitor and analyze usage and trends to improve your experience with the Services.</li>
                           <li>Notify you of updates to the Services.</li>
                        </ul>
                    </section>
                    
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">4. Disclosure of Your Information</h3>
                        <p>We do not share your personally identifiable information with any third parties for marketing purposes. We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                        <p><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</p>
                        <p><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, and customer service. Our AI features are powered by third-party providers (e.g., Google AI). While the content you submit (like essays or queries) is sent to these services for processing, it is governed by their enterprise-grade privacy and security policies.</p>
                     </section>
                     
                     <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">5. Security of Your Information</h3>
                        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
                     </section>

                     <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">6. Policy for Children</h3>
                        <p>We are in compliance with the requirements of COPPA (Children's Online Privacy Protection Act). We do not knowingly collect any personally identifiable information from children under the age of 13 without parental consent. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>
                     </section>

                     <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">7. Contact Us</h3>
                        <p>If you have questions or comments about this Privacy Policy, please contact us at: kanishk.sathupadi@gmail.com</p>
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
