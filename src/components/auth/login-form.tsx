
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
import { getYear } from "date-fns";
import { findUserByEmail, updateUser } from "@/lib/data-server-actions";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const updateUserGrade = (user: any) => {
    if (typeof user.grade !== 'number' || !user.lastLoginTimestamp) {
        return user;
    }
    
    const lastLogin = new Date(user.lastLoginTimestamp);
    const today = new Date();
    
    const lastLoginYear = getYear(lastLogin);
    const currentYear = getYear(today);

    if (currentYear > lastLoginYear) {
        const yearsPassed = currentYear - lastLoginYear;
        const newGrade = user.grade + yearsPassed;
        
        if (newGrade <= 12) {
            user.grade = newGrade;
        } else if (user.grade < 12) {
            user.grade = 12;
        }
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
    if (values.email === 'admin@dymera.com' && values.password === 'admin123') {
        const adminData = { name: 'Admin', email: 'admin@dymera.com' };
        sessionStorage.setItem('user', JSON.stringify(adminData));
        router.push('/dashboard/admin');
        return;
    }
    
    try {
        let user = await findUserByEmail(values.email);

        if (user && user.password === values.password) {
            user = updateUserGrade(user);
            await updateUser(user.userId, { 
                grade: user.grade, 
                lastLoginTimestamp: user.lastLoginTimestamp 
            });

            sessionStorage.setItem('user', JSON.stringify(user));
            
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
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
