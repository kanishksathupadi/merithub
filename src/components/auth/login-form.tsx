
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

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.356-11.303-7.918l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.016,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
    )
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
  
  const handleGoogleLogin = () => {
    // This is a mock login for demo purposes.
    // In a real app, this would use Firebase Auth `signInWithPopup`.
    const googleUser = {
        name: 'Gia Lee',
        email: 'gia.lee@example.com',
        plan: 'elite',
        grade: 12
    };
    const googleOnboarding = {
        academicStrengths: "Physics, Creative Writing",
        academicWeaknesses: "Memorization",
        subjectsOfInterest: "Astrophysics, poetry",
        collegeEnvironment: "A small liberal arts college with a strong physics program.",
        preferredLearningStyle: "visual",
        currentExtracurriculars: "Astronomy Club, Literary Magazine",
        weeklyTimeAvailable: "8",
    };

    localStorage.setItem('userName', googleUser.name);
    localStorage.setItem('userPlan', googleUser.plan);
    localStorage.setItem('signupData', JSON.stringify(googleUser));
    localStorage.setItem('onboardingData', JSON.stringify(googleOnboarding));
    localStorage.setItem('paymentComplete', 'true');
    router.push("/dashboard");
  }


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
              
              // CRITICAL FIX: Restore onboarding and payment data for existing users
              const onboardingData = localStorage.getItem(`onboarding-${values.email}`);
              const paymentComplete = !!localStorage.getItem(`payment-${values.email}`);

              if (onboardingData) {
                localStorage.setItem('onboardingData', onboardingData);
              }
              if (paymentComplete) {
                localStorage.setItem('paymentComplete', 'true');
              }

              // Now check where to send them.
              if (!onboardingData) {
                router.push("/onboarding");
              } else if (!paymentComplete) {
                router.push("/payment");
              } else {
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
