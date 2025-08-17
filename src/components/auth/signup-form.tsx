
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Signup submitted", { ...values, plan });
    // In a real app, you would handle user creation here.
    // For this demo, we'll save the name to localStorage and redirect.
    if (typeof window !== 'undefined') {
      const { name, age, grade, email, password } = values;
      localStorage.setItem('userName', name);
      localStorage.setItem('userPlan', plan);
      // We store all signup data to simulate a user account for the login form.
      localStorage.setItem('signupData', JSON.stringify({ name, age, grade, email, password, plan }));
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
