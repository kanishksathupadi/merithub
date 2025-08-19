
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

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (typeof window !== 'undefined') {
      // Admin User Check (special case)
      if (values.email === 'admin@dymera.com' && values.password === 'adminpassword') {
        const adminSignupData = { name: 'Admin User', email: values.email, plan: 'elite', grade: 11 };
        const adminOnboardingData = {
          academicStrengths: "Mathematics, Computer Science",
          academicWeaknesses: "Public Speaking, History",
          subjectsOfInterest: "Artificial Intelligence, Robotics, Quantum Physics",
          collegeEnvironment: "A large, collaborative research university with a strong engineering program.",
          preferredLearningStyle: "kinesthetic",
          currentExtracurriculars: "Robotics Club, Coding Competitions",
          weeklyTimeAvailable: "10",
        };
        localStorage.setItem('userName', 'Admin User');
        localStorage.setItem('userPlan', 'elite');
        localStorage.setItem('signupData', JSON.stringify(adminSignupData));
        localStorage.setItem('onboardingData', JSON.stringify(adminOnboardingData));
        localStorage.setItem('paymentComplete', 'true'); // Bypass payment
        router.push("/dashboard/admin");
        return; 
      }
      
      // Standard User Login
      const storedUserData = localStorage.getItem(`user-${values.email}`);
      
      if (storedUserData) {
        try {
            const userData = JSON.parse(storedUserData);
            if (userData.password === values.password) {
              // This is the user, log them in.
              // CRITICAL: Set the full user data object for the session.
              localStorage.setItem('signupData', JSON.stringify(userData));
              localStorage.setItem('userName', userData.name);
              localStorage.setItem('userPlan', userData.plan);
              
              // CRITICAL FIX: Restore onboarding data for existing users
              const onboardingData = localStorage.getItem(`onboarding-${values.email}`);
              if (onboardingData) {
                localStorage.setItem('onboardingData', onboardingData);
              }

              // Now check where to send them.
              const onboardingComplete = !!onboardingData;
              const paymentComplete = !!localStorage.getItem(`payment-${values.email}`);

              if (!onboardingComplete) {
                router.push("/onboarding");
              } else if (!paymentComplete) {
                 // Restore payment data if it exists
                localStorage.setItem('paymentComplete', 'true');
                router.push("/payment");
              } else {
                // Restore payment data if it exists
                localStorage.setItem('paymentComplete', 'true');
                router.push("/dashboard");
              }
              return;
            }
        } catch(e) {
            console.error("Failed to parse user data", e);
        }
      }

      // This code will only be reached if the login credentials are bad or the user doesn't exist.
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again or sign up.",
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
                    <Link href="#" className="text-sm text-primary hover:underline">
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
