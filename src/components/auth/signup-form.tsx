
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

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  age: z.coerce.number().min(10, {message: "Must be at least 10 years old."}).max(18, {message: "Must be 18 or younger."}),
  grade: z.coerce.number().min(5, {message: "Grade must be 5 or higher."}).max(12, {message: "Grade must be 12 or lower."}),
});

interface SignupFormProps {
  plan: 'standard' | 'elite';
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.356-11.303-7.918l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.016,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
    )
}

export function SignupForm({ plan }: SignupFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      age: undefined,
      grade: undefined,
    },
  });

  function handleGoogleSignup() {
    // This is a mock signup for demo purposes.
    // In a real app, this would use Firebase Auth `signInWithPopup` and get user info from the result.
    const googleUser = {
        name: 'Gia Lee',
        email: 'gia.lee@example.com',
        password: 'google_oauth_user', // Not used, but good for data structure consistency
        age: 17,
        grade: 12,
        plan, // Use the plan from the current page
    };
    
    // Set current user's data for immediate session
    localStorage.setItem('userName', googleUser.name);
    localStorage.setItem('userPlan', googleUser.plan);
    localStorage.setItem('signupData', JSON.stringify(googleUser));
    
    // Persist this new user's data for future logins
    localStorage.setItem(`user-${googleUser.email}`, JSON.stringify(googleUser));

    // Add to allSignups list for admin panel, if not already there
    const allSignups = JSON.parse(localStorage.getItem('allSignups') || '[]');
    if (!allSignups.some((user: any) => user.email === googleUser.email)) {
        allSignups.push(googleUser);
        localStorage.setItem('allSignups', JSON.stringify(allSignups));
    }

    // A new user always goes to onboarding next
    router.push("/onboarding");
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Signup submitted", { ...values, plan });
    
    if (typeof window !== 'undefined') {
      const { name, age, grade, email, password } = values;
      const newUser = { name, age, grade, email, password, plan };

      // Set current user's data for immediate login
      localStorage.setItem('userName', name);
      localStorage.setItem('userPlan', plan);
      // Store the main signup data under its own key for direct lookup
      localStorage.setItem('signupData', JSON.stringify(newUser));
      
      // *** BUG FIX: Persist user data for future logins ***
      localStorage.setItem(`user-${email}`, JSON.stringify(newUser));

      // Add the new user to the list of all signups for the admin panel
      const allSignups = JSON.parse(localStorage.getItem('allSignups') || '[]');
      allSignups.push(newUser);
      localStorage.setItem('allSignups', JSON.stringify(allSignups));
    }
    router.push("/onboarding");
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-border">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 border border-primary/20 text-primary rounded-full p-3 w-fit mb-4">
          <Rocket className="w-8 h-8" />
        </div>
        <CardTitle className="text-3xl">Create Your Account</CardTitle>
        <CardDescription>You've selected the <span className="font-bold text-primary">{plan}</span> plan. Start your path to success today.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
          <GoogleIcon className="mr-2 h-5 w-5"/>
          Sign up with Google
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or with your email
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="16" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Grade</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="11" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full !mt-6 bg-primary text-primary-foreground hover:bg-primary/90">Create Account</Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
