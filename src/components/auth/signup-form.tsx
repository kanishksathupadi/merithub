
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "../ui/checkbox";
import { sendWelcomeEmail } from "@/ai/flows/send-welcome-email";
import { SchoolAutocomplete } from "../dashboard/school-autocomplete";
import { Label } from "@/components/ui/label";
import { addUser, findUserByEmail } from "@/lib/data-client";

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [formValues, setFormValues] = useState({
      name: "",
      email: "",
      password: "",
      birthdate: "",
      grade: "",
      school: "",
      acceptTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setFormValues(prev => ({...prev, acceptTerms: !!checked }));
  }

  const handleSchoolChange = (value: string) => {
    setFormValues(prev => ({...prev, school: value}));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    if (!formValues.acceptTerms) {
        toast({
            variant: "destructive",
            title: "Terms and Conditions",
            description: "You must accept the Terms of Service to continue.",
        });
        return;
    }
    
    // Simple check for non-empty fields
    for (const [key, value] of Object.entries(formValues)) {
        if (key !== 'acceptTerms' && !value) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: `Please fill out the ${key} field.`,
            });
            return;
        }
    }
    
    try {
        const existingUser = await findUserByEmail(formValues.email);
        if (existingUser) {
            toast({
                variant: "destructive",
                title: "Account Exists",
                description: "An account with this email already exists. Please log in.",
            });
            return;
        }
        
        const newUser = { 
            ...formValues,
            grade: Number(formValues.grade) || 0,
            birthdate: new Date(formValues.birthdate).toISOString(),
            plan: 'elite',
            userId: uuidv4(),
            signupTimestamp: new Date().toISOString(),
            lastLoginTimestamp: new Date().toISOString(),
            tasks: [],
            suggestion: null,
            onboardingData: null,
        };

        await addUser(newUser);

        localStorage.setItem('signupData', JSON.stringify(newUser));
        localStorage.setItem('userName', newUser.name);
        localStorage.setItem('userPlan', newUser.plan);

        if (newUser.email.endsWith('@gmail.com')) {
            sendWelcomeEmail({ name: newUser.name, email: newUser.email }).catch(err => {
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
        <CardDescription>Start your path to success today.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" value={formValues.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" value={formValues.email} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" value={formValues.password} onChange={handleInputChange} required />
            </div>

            <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                    <Label htmlFor="birthdate">Date of birth</Label>
                    <Input id="birthdate" name="birthdate" type="date" value={formValues.birthdate} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2 flex-1">
                    <Label htmlFor="grade">Grade</Label>
                    <Input id="grade" name="grade" type="number" placeholder="e.g., 9" value={formValues.grade} onChange={handleInputChange} required />
                </div>
            </div>

             <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <SchoolAutocomplete 
                    value={formValues.school}
                    onValueChange={handleSchoolChange}
                />
            </div>
            
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm !mt-6">
                <Checkbox
                    id="acceptTerms"
                    checked={formValues.acceptTerms}
                    onCheckedChange={handleCheckboxChange}
                    required
                />
                <div className="space-y-1 leading-none">
                    <label htmlFor="acceptTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Accept terms and conditions
                    </label>
                    <p className="text-sm text-muted-foreground">
                    By creating an account, you agree to our{' '}
                    <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                        Terms of Service
                    </a>
                    .
                    </p>
                </div>
            </div>

            <Button type="submit" className="w-full !mt-6 bg-primary text-primary-foreground hover:bg-primary/90">Create Account</Button>
          </form>
       
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
