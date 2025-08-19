
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
      const storedSignupData = localStorage.getItem('signupData');
      
      if (storedSignupData) {
        try {
            const signupData = JSON.parse(storedSignupData);
            // Direct check against the currently logged-in or last-signed-up user's data
            if (signupData.email === values.email && signupData.password === values.password) {
              localStorage.setItem('userName', signupData.name);
              localStorage.setItem('userPlan', signupData.plan);
              
              const onboardingComplete = !!localStorage.getItem('onboardingData');
              const paymentComplete = !!localStorage.getItem('paymentComplete');

              if (!onboardingComplete) {
                router.push("/onboarding");
              } else if (!paymentComplete) {
                router.push("/payment");
              } else {
                router.push("/dashboard");
              }
              return;
            }
        } catch(e) {
            console.error("Failed to parse signup data", e);
        }
      }

      // Fallback for returning users if `signupData` is not the correct one
      // NOTE: This part still iterates, but it's a fallback, not the primary path.
      // The primary path for a user who just signed up or logged in will be fast.
      const allSignups = JSON.parse(localStorage.getItem('allSignups') || '[]');
      const foundUser = allSignups.find((u: any) => u.email === values.email && u.password === values.password);

      if (foundUser) {
        // Since we found them, let's set their data as the primary `signupData` for next time
        localStorage.setItem('signupData', JSON.stringify(foundUser));
        localStorage.setItem('userName', foundUser.name);
        localStorage.setItem('userPlan', foundUser.plan);
        // We assume a returning user has completed these steps. This could be improved.
        // A more robust system would store completion status per user.
        router.push("/dashboard");
        return;
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
