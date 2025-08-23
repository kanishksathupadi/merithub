
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
import { useState } from "react";
import { KeyRound, CheckCircle } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Password reset requested for:", values.email);
    // In a real application, you would make an API call to your backend
    // to trigger the password reset email.
    setSubmitted(true);
  }

  if (submitted) {
    return (
         <Card className="w-full max-w-md shadow-xl border-border">
            <CardHeader className="text-center">
                 <div className="mx-auto bg-primary/10 border border-primary/20 text-primary rounded-full p-3 w-fit mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <CardTitle className="text-3xl">Check Your Email</CardTitle>
                <CardDescription>
                    If an account with that email exists, we've sent a link to reset your password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full">
                    <Link href="/login">Back to Login</Link>
                </Button>
            </CardContent>
         </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-border">
      <CardHeader className="text-center">
         <div className="mx-auto bg-primary/10 border border-primary/20 text-primary rounded-full p-3 w-fit mb-4">
          <KeyRound className="w-8 h-8" />
        </div>
        <CardTitle className="text-3xl">Forgot Your Password?</CardTitle>
        <CardDescription>No problem. Enter your email and we'll send you a reset link.</CardDescription>
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
            <Button type="submit" className="w-full !mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
                Send Reset Link
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Remembered your password?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
