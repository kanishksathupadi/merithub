
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
    const router = useRouter();

    const handleBypass = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('paymentComplete', 'true');
        }
        router.push('/dashboard');
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background relative">
             <header className="absolute top-0 left-0 w-full p-4 sm:p-6">
                <Link href="/" className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">Dymera</h1>
                </Link>
            </header>
            <Card className="w-full max-w-md shadow-xl border-border">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 border border-primary/20 text-primary rounded-full p-3 w-fit mb-4">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-3xl">Final Step: Payment</CardTitle>
                    <CardDescription>Secure your access to Dymera.</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p>This is where a real payment form (like Stripe or PayPal) would be integrated.</p>
                    <div className="p-4 bg-muted rounded-lg flex items-center justify-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-500"/>
                        <p className="text-sm text-muted-foreground">All transactions are secure and encrypted.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                     <Button className="w-full" disabled>Proceed to Payment (Placeholder)</Button>
                     <button onClick={handleBypass} className="text-sm text-primary hover:underline font-medium">
                        Bypass payment as admin
                     </button>
                </CardFooter>
            </Card>
        </div>
    );
}
