
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "../ui/checkbox";
import { SchoolAutocomplete } from "../dashboard/school-autocomplete";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { findUserByEmailAction } from "@/lib/actions";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addUser } from "@/lib/data-client";


const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  birthdate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Please enter a valid date." }),
  grade: z.coerce.number().min(0, "Grade cannot be negative.").max(12, "Grade must be 12 or lower."),
  school: z.string().min(3, { message: "Please select or enter your school name." }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});


export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      birthdate: "",
      grade: '' as any,
      school: "",
      acceptTerms: false,
    },
  });


  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    console.log("CLIENT: Signup form submitted. All client-side validation passed.");
    try {
        console.log("CLIENT: Checking if user exists via server action...");
        const existingUser = await findUserByEmailAction(values.email);
        if (existingUser) {
            toast({
                variant: "destructive",
                title: "Account Exists",
                description: "An account with this email already exists. Please log in.",
            });
            return;
        }
        
        console.log("CLIENT: User does not exist. Creating user with Firebase Auth...");
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const firebaseUser = userCredential.user;
        console.log("CLIENT: Firebase Auth user created successfully. UID:", firebaseUser.uid);

        const newUser = { 
            name: values.name,
            email: values.email,
            // DO NOT STORE PLAINTEXT PASSWORDS
            // password: values.password, 
            grade: Number(values.grade) || 0,
            birthdate: new Date(values.birthdate).toISOString(),
            school: values.school,
            plan: 'elite',
            userId: firebaseUser.uid, // Use Firebase UID as the unique ID
            signupTimestamp: new Date().toISOString(),
            lastLoginTimestamp: new Date().toISOString(),
            tasks: [],
            suggestion: null,
            onboardingData: null,
        };
        
        console.log("CLIENT: New user object created. Writing to Firestore...");
        await addUser(newUser);
        console.log("CLIENT: User data written to Firestore successfully.");
        
        sessionStorage.setItem('user', JSON.stringify(newUser));
        console.log("CLIENT: User data saved to session storage.");

        console.log("CLIENT: Firing non-blocking welcome email request...");
        fetch('/api/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newUser.name, email: newUser.email }),
        }).catch(err => {
            console.error("CLIENT: Non-blocking welcome email fetch failed, but this should not stop navigation.", err);
        });

        console.log("CLIENT: Navigating to /onboarding...");
        router.push("/onboarding");
    } catch (error: any) {
        console.error("CLIENT: An error occurred in the onSubmit function:", error);
        
        let title = "Signup Failed";
        let description = "An unexpected error occurred. Please try again.";

        if (error.code === 'auth/email-already-in-use') {
            title = "Account Exists";
            description = "An account with this email already exists. Please log in.";
        } else if (error.code === 'auth/weak-password') {
            title = "Weak Password";
            description = "The password must be at least 6 characters long.";
        }

        toast({
            variant: "destructive",
            title: title,
            description: description,
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
        <CardDescription>Start your path to success today.</CardDescription>
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
                            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
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
                            <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
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
                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
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
                                <FormControl><Input type="date" {...field} /></FormControl>
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
                                <FormControl><Input type="number" placeholder="e.g., 9" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                        <FormItem>
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
                                <FormLabel>Accept terms and conditions</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    By creating an account, you agree to our{' '}
                                    <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                                        Terms of Service
                                    </a>.
                                </p>
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
