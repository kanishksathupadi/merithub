
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function PayPalIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M10 13H1.4c-.5 0-.9.3-1 .8-.5 2.4.2 4.9 2.5 6.5s5.7 1.7 8 .7c.6-.3 1-1 1-1.6l-1.9-9.4z" />
            <path d="m11.2 3.3-1.6 7.9-1.9-9.4c-.1-.4-.5-.8-1-.8H1.4c-.5 0-.9.3-1 .8-.5 2.4.2 4.9 2.5 6.5s5.7 1.7 8 .7c.6-.3 1-1 1-1.6L10 13h5.1c.4 0 .8-.3.9-.7l2.1-9.2c.1-.4 0-.8-.4-1-.4-.3-.9-.2-1.2.2S13 8.1 13 8.1H9.8z" />
        </svg>
    )
}

export default function PaymentPage() {
    const router = useRouter();
    const [plan, setPlan] = useState<'standard' | 'elite' | null>(null);

    useEffect(() => {
        const userPlan = localStorage.getItem('userPlan') as 'standard' | 'elite' | null;
        setPlan(userPlan);
    }, []);

    const handleBypass = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('paymentComplete', 'true');
            
            const signupDataStr = localStorage.getItem('signupData');
            if (signupDataStr) {
                const signupData = JSON.parse(signupDataStr);
                 // Persist payment status for this specific user for future logins
                localStorage.setItem(`payment-${signupData.email}`, 'true');
            }
        }
        router.push('/dashboard');
    };

    const planDetails = {
        standard: { name: "Standard Plan", price: "$7.00/mo" },
        elite: { name: "Elite Plan", price: "$12.00/mo" }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background relative">
             <header className="absolute top-0 left-0 w-full p-4 sm:p-6">
                <Link href="/" className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">PinnaclePath</h1>
                </Link>
            </header>
            <Card className="w-full max-w-md shadow-xl border-border">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Complete Your Purchase</CardTitle>
                    <CardDescription>Secure your access to PinnaclePath.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {plan && (
                        <div className="rounded-lg border bg-muted p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold">{planDetails[plan].name}</p>
                                <p className="text-sm text-muted-foreground">Billed monthly</p>
                            </div>
                            <p className="text-xl font-bold">{planDetails[plan].price}</p>
                        </div>
                    )}
                    <Tabs defaultValue="card" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="card"><CreditCard className="mr-2"/>Card</TabsTrigger>
                            <TabsTrigger value="paypal"><PayPalIcon className="mr-2"/>PayPal</TabsTrigger>
                        </TabsList>
                        <TabsContent value="card" className="pt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input id="card-number" placeholder="1234 5678 9101 1121" disabled />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expires</Label>
                                        <Input id="expiry" placeholder="MM/YY" disabled/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="123" disabled/>
                                    </div>
                                </div>
                                <Button className="w-full" disabled>Pay {plan && planDetails[plan].price}</Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="paypal" className="pt-4">
                            <div className="flex flex-col items-center justify-center text-center space-y-4 h-full py-8">
                                <p className="text-muted-foreground text-sm">You will be redirected to PayPal to complete your purchase securely.</p>
                                <Button className="w-full bg-[#0070BA] hover:bg-[#005ea6]" disabled>
                                    Pay with PayPal
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="p-2 bg-muted/50 rounded-lg flex items-center justify-center gap-2 text-center">
                        <ShieldCheck className="w-5 h-5 text-green-500"/>
                        <p className="text-xs text-muted-foreground">All transactions are secure and encrypted.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                     <button onClick={handleBypass} className="text-sm text-primary hover:underline font-medium">
                        Bypass payment for demo
                     </button>
                </CardFooter>
            </Card>
        </div>
    );
}

    

    
