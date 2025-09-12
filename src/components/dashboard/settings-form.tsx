
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";


const settingsSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  email: z.string().email(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

const defaultValues: Partial<SettingsValues> = {};

export function SettingsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  useEffect(() => {
    const userData = localStorage.getItem('signupData');

    if (userData) {
      const parsedData = JSON.parse(userData);
      form.reset({
        name: parsedData.name,
        email: parsedData.email,
      });
    }
    setLoading(false);
  }, [form]);


  async function onSubmit(data: SettingsValues) {
    const userData = localStorage.getItem('signupData');
    if (!userData) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not find user data.'});
      return;
    }
    const parsedData = JSON.parse(userData);
    const userId = parsedData.userId;

    try {
        // Update local storage master list
        const allUsersStr = localStorage.getItem('allSignups');
        if (allUsersStr) {
            let allUsers = JSON.parse(allUsersStr);
            allUsers = allUsers.map((user: any) => {
                if (user.userId === userId) {
                    return { ...user, name: data.name, email: data.email };
                }
                return user;
            });
            localStorage.setItem('allSignups', JSON.stringify(allUsers));
        }

        // Update session storage
        const updatedData = { ...parsedData, name: data.name, email: data.email };
        localStorage.setItem('signupData', JSON.stringify(updatedData));
        localStorage.setItem('userName', data.name);
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('storage'));

        toast({
        title: "Settings Saved",
        description: "Your changes have been successfully saved.",
        });
    } catch(error) {
        console.error("Failed to save settings:", error);
         toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to save your changes. Please try again.',
        });
    }
  }


  if (loading) {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input type="email" {...field} disabled /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
