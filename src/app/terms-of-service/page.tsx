
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GraduationCap, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
    return (
        <div className="bg-muted min-h-screen">
            <div className="container mx-auto py-12 px-4 max-w-4xl">
                 <header className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <GraduationCap className="w-8 h-8 text-primary" />
                        <h1 className="text-2xl font-bold tracking-tight">PinnaclePath</h1>
                    </Link>
                    <h2 className="text-4xl font-bold tracking-tight">Terms of Service</h2>
                    <p className="text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
                </header>

                <Alert variant="destructive" className="mb-8">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Legal Disclaimer</AlertTitle>
                    <AlertDescription>
                        The following document is a placeholder and not a legally binding agreement. It is for demonstration purposes only. You must consult with a qualified legal professional to draft a Terms of Service agreement that is appropriate for your specific situation and jurisdiction.
                    </AlertDescription>
                </Alert>

                <div className="space-y-6 text-foreground/80 text-sm">
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">1. Introduction</h3>
                        <p>Welcome to PinnaclePath. These Terms of Service ("Terms") govern your use of the PinnaclePath website, applications, and services (collectively, the "Services"), provided by PinnaclePath Inc. ("PinnaclePath", "we", "us", or "our"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, do not use our Services.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">2. Use of Our Services</h3>
                        <p>You must be of legal age to form a binding contract to use our Services, or have the consent of a parent or legal guardian who agrees to be bound by these Terms on your behalf. You agree to use our Services only for lawful purposes and in accordance with these Terms. You are responsible for all activity that occurs under your account. You agree not to:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Use the Services in any way that violates any applicable federal, state, local, or international law or regulation.</li>
                            <li>Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which, as determined by us, may harm PinnaclePath or users of the Services.</li>
                            <li>Use any robot, spider, or other automatic device, process, or means to access the Services for any purpose, including monitoring or copying any of the material on the Services.</li>
                            <li>Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">3. Intellectual Property Rights</h3>
                        <p>The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by PinnaclePath, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. You are not permitted to reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services, except as follows: you may store files that are automatically cached by your Web browser for display enhancement purposes.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">4. User Contributions</h3>
                        <p>The Services may contain message boards, forums, and other interactive features that allow users to post, submit, publish, display, or transmit to other users or other persons content or materials (collectively, "User Contributions") on or through the Services. All User Contributions must comply with these Terms. Any User Contribution you post to the site will be considered non-confidential and non-proprietary. By providing any User Contribution on the Services, you grant us and our affiliates and service providers, and each of their and our respective licensees, successors, and assigns the right to use, reproduce, modify, perform, display, distribute, and otherwise disclose to third parties any such material.</p>
                    </section>
                     
                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">5. Disclaimer of Warranties</h3>
                        <p>YOUR USE OF THE SERVICES, ITS CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES IS AT YOUR OWN RISK. THE SERVICES, ITS CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. NEITHER PINNACLEPATH NOR ANY PERSON ASSOCIATED WITH PINNACLEPATH MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICES.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">6. Limitation on Liability</h3>
                        <p>TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL PINNACLEPATH, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICES, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE SERVICES OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.</p>
                    </section>

                     <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">7. Governing Law and Jurisdiction</h3>
                        <p>All matters relating to the Services and these Terms and any dispute or claim arising therefrom or related thereto (in each case, including non-contractual disputes or claims), shall be governed by and construed in accordance with the internal laws of the State of Delaware without giving effect to any choice or conflict of law provision or rule. Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Services shall be instituted exclusively in the federal courts of the United States or the courts of the State of Delaware.</p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">8. Changes to the Terms of Service</h3>
                        <p>We may revise and update these Terms of Service from time to time in our sole discretion. All changes are effective immediately when we post them. Your continued use of the Services following the posting of revised Terms of Service means that you accept and agree to the changes. You are expected to check this page frequently so you are aware of any changes, as they are binding on you.</p>
                    </section>
                </div>

                <div className="mt-12 text-center">
                    <Button asChild>
                        <Link href="/signup">Back to Signup</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
