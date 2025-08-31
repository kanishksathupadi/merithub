
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.356-11.303-7.918l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.016,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
    );
}

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleLogin = async () => {
    const googleUser = {
      name: 'Elena Rodriguez',
      email: 'elena.rodriguez@example.com',
    };

    try {
        let allSignups = JSON.parse(localStorage.getItem('allSignups') || '[]');
        let user = allSignups.find((u: any) => u.email === googleUser.email);

        if (user) {
            // Existing user, log them in and check their progress
            localStorage.setItem('signupData', JSON.stringify(user));
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userPlan', user.plan);
            
            const onboardingComplete = localStorage.getItem(`onboarding-${user.email}`);
            const paymentComplete = localStorage.getItem(`payment-${user.email}`);

            if (onboardingComplete) localStorage.setItem('onboardingData', onboardingComplete);
            if (paymentComplete) localStorage.setItem('paymentComplete', 'true');

            if (!onboardingComplete) {
                router.push('/onboarding');
            } else if (!paymentComplete) {
                router.push('/payment');
            } else {
                router.push('/dashboard');
            }

        } else {
            // This is a new user via Google. Create a full profile for them.
            const newUser = {
                userId: uuidv4(),
                name: googleUser.name,
                email: googleUser.email,
                plan: 'elite', // Default new Google signups to the elite plan
                password: 'google_user_password', // Mock password for the prototype
                age: 17, 
                grade: 11,
                signupTimestamp: new Date().toISOString(),
            };

            allSignups.push(newUser);
            localStorage.setItem('allSignups', JSON.stringify(allSignups));
            localStorage.setItem('signupData', JSON.stringify(newUser));
            localStorage.setItem('userName', newUser.name);
            localStorage.setItem('userPlan', newUser.plan);
            router.push('/onboarding');
        }
    } catch (error) {
         console.error("Local Storage Error:", error);
         toast({
            variant: "destructive",
            title: "Prototype Error",
            description: "Could not perform Google Sign-In simulation. Your browser might be blocking local storage.",
        });
    }
  };


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (typeof window === 'undefined') return;

    if (values.email === 'admin@dymera.com' && values.password === 'admin123') {
        const adminData = {
            name: 'Admin',
            email: 'admin@dymera.com',
            plan: 'elite',
            userId: 'admin-user-id',
        };
        localStorage.setItem('signupData', JSON.stringify(adminData));
        localStorage.setItem('userName', 'Admin');
        localStorage.setItem('userPlan', 'elite');
        localStorage.setItem('onboardingData', JSON.stringify({})); 
        localStorage.setItem('paymentComplete', 'true');
        router.push('/dashboard/admin');
        return;
    }

    try {
        const allSignupsStr = localStorage.getItem('allSignups');
        if (allSignupsStr) {
            let allSignups = JSON.parse(allSignupsStr);
            let user = allSignups.find((u: any) => u.email === values.email && u.password === values.password);

            if (user) {
                // Ensure the user has a userId, assign one if missing (for backwards compatibility with older stored users)
                if (!user.userId) {
                    user.userId = uuidv4();
                    allSignups = allSignups.map((u: any) => u.email === user.email ? user : u);
                    localStorage.setItem('allSignups', JSON.stringify(allSignups));
                }

                localStorage.setItem('signupData', JSON.stringify(user));
                localStorage.setItem('userName', user.name);
                localStorage.setItem('userPlan', user.plan);

                localStorage.removeItem('onboardingData');
                localStorage.removeItem('paymentComplete');

                const onboardingComplete = localStorage.getItem(`onboarding-${user.email}`);
                const paymentComplete = localStorage.getItem(`payment-${user.email}`);

                 if (onboardingComplete) {
                    localStorage.setItem('onboardingData', onboardingComplete);
                 }
                 if (paymentComplete) {
                    localStorage.setItem('paymentComplete', 'true');
                 }

                if (!onboardingComplete) {
                    router.push('/onboarding');
                } else if (!paymentComplete) {
                    router.push('/payment');
                } else {
                    router.push('/dashboard');
                }
            } else {
                 toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "Invalid email or password. Please try again.",
                });
            }
        } else {
             toast({
                variant: "destructive",
                title: "Login Failed",
                description: "No users found. Please sign up first.",
            });
        }
    } catch (error) {
         console.error("Login Error:", error);
        toast({
            variant: "destructive",
            title: "An Error Occurred",
            description: "Something went wrong during login.",
        });
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-border">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 border border-primary/20 text-primary rounded-full p-3 w-fit mb-4">
          <Rocket className="w-8 h-8" />
        </div>
        <CardTitle className="text-3xl">Welcome Back!</CardTitle>
        <CardDescription>Log in to continue your journey.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Password</FormLabel>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full !mt-8 bg-primary text-primary-foreground hover:bg-primary/90">Log In</Button>
          </form>
        </Form>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          <GoogleIcon className="mr-2 h-5 w-5"/>
          Sign in with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
