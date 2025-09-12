

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
import { getYear, setYear, isBefore } from "date-fns";
import { findUserByEmail } from "@/lib/data";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

// Automatically update grade based on school year cutoff (e.g., August 1st)
const updateUserGrade = (user: any) => {
    console.log("Checking for grade update for user:", user.email);
    if (typeof user.grade !== 'number' || !user.lastLoginTimestamp) {
        console.log("No grade or last login timestamp, skipping update.");
        return user;
    }
    
    const lastLogin = new Date(user.lastLoginTimestamp);
    const today = new Date();
    
    console.log(`Last login: ${lastLogin.toDateString()}, Current grade: ${user.grade}`);

    // Define the school year cutoff (August 1st)
    const lastLoginYear = getYear(lastLogin);
    const currentYear = getYear(today);

    // If a new school year has started since the last login
    if (currentYear > lastLoginYear) {
        const yearsPassed = currentYear - lastLoginYear;
        const newGrade = user.grade + yearsPassed;
        console.log(`New school year detected. ${yearsPassed} year(s) have passed.`);

        if (newGrade <= 12) {
            user.grade = newGrade;
            console.log(`GRADE PROMOTED! New grade is ${user.grade}`);
        } else if (user.grade < 12) {
            user.grade = 12; // Cap at 12th grade
            console.log(`GRADE CAPPED! New grade is 12.`);
        } else {
             console.log(`User is already grade 12 or higher. No grade change.`);
        }
    } else {
        console.log("Not a new school year. Grade remains the same.");
    }

    user.lastLoginTimestamp = today.toISOString();
    return user;
};


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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
        router.push('/dashboard/admin');
        return;
    }
    
    // Check for mentor login
    if (values.email.endsWith('@aischoolmentor.com') && values.password === 'mentor123') {
        const mentorName = values.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
        const mentorData = {
            name: mentorName,
            email: values.email,
            userId: `mentor-${mentorName.split(' ')[0].toLowerCase()}`
        }
         localStorage.setItem('signupData', JSON.stringify(mentorData));
         localStorage.setItem('userName', mentorData.name);
         router.push('/dashboard/mentor/admin');
         return;
    }


    try {
        let user = await findUserByEmail(values.email);

        if (user && user.password === values.password) {
            user = updateUserGrade(user);

            // Update user in Firestore if grade changed
            // await createUser(user); // `createUser` does a setDoc, which is fine here.

            localStorage.setItem('signupData', JSON.stringify(user));
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userPlan', user.plan);

            // Clear previous session data just in case
            localStorage.removeItem('onboardingData');
            
            // Restore persisted data for this user into the current session
            if(user.onboardingData) {
              localStorage.setItem('onboardingData', JSON.stringify(user.onboardingData));
            }
            
            if (!user.onboardingData) {
                router.push('/onboarding');
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
    } catch (error) {
         console.error("Login Error:", error);
        toast({
            variant: "destructive",
            title: "An Error Occurred",
            description: "Something went wrong during login.",
        });
    }
  };

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
                  <FormLabel>Password</FormLabel>
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
