
"use client";

import React, { useState, useRef, useEffect } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarIcon, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { SchoolAutocomplete } from "../dashboard/school-autocomplete";
import { Checkbox } from "../ui/checkbox";
import { sendWelcomeEmail } from "@/ai/flows/send-welcome-email";


const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  birthdate: z.date({
    required_error: "A date of birth is required.",
  }),
  grade: z.coerce.number().min(0, {message: "Please enter a valid grade (K=0)."}).max(12, {message: "Grade must be 12 or lower."}),
  school: z.string().min(3, { message: "Please select your school." }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms of Service to continue.",
  }),
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
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.016,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
    )
}

export function SignupForm({ plan }: SignupFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      grade: undefined,
      school: "",
      acceptTerms: false,
    },
  });

  const handleGoogleSignup = async () => {
    toast({
        title: "Feature Not Implemented",
        description: "Google Sign-Up is for demonstration purposes only.",
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (typeof window === 'undefined') return;
    
    try {
        const allSignupsStr = localStorage.getItem('allSignups');
        const allSignups = allSignupsStr ? JSON.parse(allSignupsStr) : [];
        
        const userExists = allSignups.some((u: any) => u.email === values.email);
        if (userExists) {
            toast({
                variant: "destructive",
                title: "Email Already Registered",
                description: "This email is already in use. Please log in.",
            });
            return;
        }

        const newUser = { 
            ...values,
            plan,
            userId: uuidv4(),
            signupTimestamp: new Date().toISOString(),
            lastLoginTimestamp: new Date().toISOString(),
            tasks: [],
            suggestion: null,
        };

        allSignups.push(newUser);
        localStorage.setItem('allSignups', JSON.stringify(allSignups));

        localStorage.setItem('signupData', JSON.stringify(newUser));
        localStorage.setItem('userName', newUser.name);
        localStorage.setItem('userPlan', newUser.plan);

        // Asynchronously trigger the welcome email AI flow if it's a Gmail address
        if (newUser.email.endsWith('@gmail.com')) {
            sendWelcomeEmail({ name: newUser.name, email: newUser.email }).catch(err => {
                // Log the error but don't block the user's flow
                console.error("Failed to send welcome email:", err);
            });
        }


        router.push("/onboarding");
    } catch (error) {
         console.error("Signup Error:", error);
        toast({
            variant: "destructive",
            title: "Signup Failed",
            description: "An unexpected error occurred. Please try again.",
        });
    }
  };

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
                name="birthdate"
                render={({ field }) => (
                    <FormItem className="flex-1">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Grade (K=0)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 11" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>School</FormLabel>
                        <FormControl>
                           <SchoolAutocomplete
                                value={field.value}
                                onValueChange={field.onChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm !mt-6">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Accept terms and conditions
                    </FormLabel>
                    <FormDescription>
                      By creating an account, you agree to our{' '}
                       <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                            Terms of Service
                       </a>
                      .
                    </FormDescription>
                     <FormMessage />
                  </div>
                </FormItem>
              )}
            />


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
