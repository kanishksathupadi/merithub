
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

export default function TermsOfServiceContent() {
    return (
        <div className="space-y-6 text-foreground/80 text-sm">
            <section className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">1. Introduction & Agreement to Terms</h3>
                <p>These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and AI School Mentor (“we,” “us,” or “our”), concerning your access to and use of the AI School Mentor website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Service”).</p>
                <p>By accessing the Service, you acknowledge that you have read, understood, and agree to be bound by all of these Terms. If you do not agree with all of these Terms, then you are expressly prohibited from using the Service and you must discontinue use immediately. We reserve the right, in our sole discretion, to make changes or modifications to these Terms at any time and for any reason. We will alert you about any changes by updating the “Last Updated” date of these Terms, and you waive any right to receive specific notice of each such change.</p>
            </section>

            <section className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">2. User Accounts and Security</h3>
                <p>To access most features of the Service, you must register for an account. When you register for an account, you may be required to provide us with some information about yourself, such as your email address or other contact information. You agree that the information you provide to us is accurate and that you will keep it accurate and up-to-date at all times. You are solely responsible for maintaining the confidentiality of your account and password, and you accept responsibility for all activities that occur under your account. If you have reason to believe that your account is no longer secure, then you must immediately notify us.</p>
            </section>

            <section className="space-y-2">
                <h3 className="text-xl font-semibold text/foreground">3. Payment, Subscriptions, and Refunds</h3>
                <p>Certain features of the Service may require you to pay fees. Before you pay any fees, you will have an opportunity to review and accept the fees that you will be charged. All fees are in U.S. Dollars and are non-refundable, except as required by law.</p>
                <p>The Service may include automatically recurring payments for periodic charges (“Subscription Service”). If you activate a Subscription Service, you authorize us to periodically charge, on a going-forward basis and until cancellation of either the recurring payments or your account, all accrued sums on or before the payment due date for the accrued sums. The “Subscription Billing Date” is the date when you purchase your first subscription to the Service. Your account will be charged automatically on the Subscription Billing Date all applicable fees for the next subscription period. The subscription will continue unless and until you cancel your subscription or we terminate it.</p>
            </section>

            <section className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">4. Intellectual Property Rights</h3>
                <p>The Service and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by AI School Mentor, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. These Terms permit you to use the Service for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service, except as it is created and owned by you (such as your own data).</p>
            </section>

            <section className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">5. Prohibited Activities & User Conduct</h3>
                <p>You may not access or use the Service for any purpose other than that for which we make the Service available. The Service may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. As a user of the Service, you agree not to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Systematically retrieve data or other content from the Service to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                    <li>Make any unauthorized use of the Service, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</li>
                    <li>Circumvent, disable, or otherwise interfere with security-related features of the Service.</li>
                    <li>Engage in unauthorized framing of or linking to the Service.</li>
                    <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
                    <li>Interfere with, disrupt, or create an undue burden on the Service or the networks or services connected to the Service.</li>
                    <li>Attempt to impersonate another user or person or use the username of another user.</li>
                    <li>Use any information obtained from the Service in order to harass, abuse, or harm another person.</li>
                    <li>Use the Service as part of any effort to compete with us or otherwise use the Service and/or the Content for any revenue-generating endeavor or commercial enterprise.</li>
                    <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Service.</li>
                </ul>
            </section>

             <section className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">6. User Generated Contributions</h3>
                <p>The Service may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Service, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the Service and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make available any Contributions, you thereby represent and warrant that you are the creator and owner of your Contributions and have all necessary rights to grant us the license to use them.</p>
            </section>

            <section className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">7. Copyright Infringement (DMCA Policy)</h3>
                <p>We respect the intellectual property rights of others. If you believe that any material available on or through the Service infringes upon any copyright you own or control, please immediately notify our designated Copyright Agent using the contact information provided below (a “Notification”). A copy of your Notification will be sent to the person who posted or stored the material addressed in the Notification.</p>
            </section>

            <section className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">8. Termination of Use</h3>
                <p>We may, in our sole discretion, suspend or terminate your account and your ability to use the Service, at any time, for any reason, including for any breach of these Terms. You may terminate your account at any time by contacting customer service. Upon termination, you will remain liable for all amounts due through the date of termination.</p>
            </section>

            <section className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">9. Disclaimer of Warranties</h3>
                <p>YOUR USE OF THE SERVICE, ITS CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICE IS AT YOUR OWN RISK. THE SERVICE, ITS CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICE ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. NEITHER AI School Mentor NOR ANY PERSON ASSOCIATED WITH AI School Mentor MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICE.</p>
            </section>

            <section className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">10. Limitation on Liability</h3>
                <p>TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL AI School Mentor, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE SERVICE OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</p>
            </section>

             <section className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">11. Indemnification</h3>
                <p>You agree to defend, indemnify, and hold harmless AI School Mentor, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service, including, but not limited to, your User Contributions, any use of the Service's content, services, and products other than as expressly authorized in these Terms.</p>
            </section>

            <section className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">12. Governing Law and Dispute Resolution</h3>
                <p>All matters relating to the Service and these Terms and any dispute or claim arising therefrom or related thereto shall be governed by and construed in accordance with the internal laws of the State of Delaware without giving effect to any choice or conflict of law provision or rule. Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Service shall be instituted exclusively in the federal courts of the United States or the courts of the State of Delaware.</p>
                <p>At our sole discretion, we may require you to submit any disputes arising from the use of these Terms or the Service, including disputes arising from or concerning their interpretation, violation, invalidity, non-performance, or termination, to final and binding arbitration under the Rules of Arbitration of the American Arbitration Association applying Delaware law.</p>
            </section>

            <section className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">13. Miscellaneous</h3>
                <p>These Terms and any policies or operating rules posted by us on the Service or in respect to the Service constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Terms shall not operate as a waiver of such right or provision. If any provision or part of a provision of these Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Terms and does not affect the validity and enforceability of any remaining provisions.</p>
            </section>
        </div>
    );
}
