
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useRouter } from "next/navigation";


const settingsSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  email: z.string().email(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

const defaultValues: Partial<SettingsValues> = {};

export function SettingsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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


  function onSubmit(data: SettingsValues) {
    console.log("Settings saved:", data);
    
    // Update local storage
    const userData = localStorage.getItem('signupData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      const updatedData = { ...parsedData, name: data.name, email: data.email };
      localStorage.setItem('signupData', JSON.stringify(updatedData));
      localStorage.setItem('userName', data.name);
    }
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('storage'));

    toast({
      title: "Settings Saved",
      description: "Your changes have been successfully saved.",
    });
  }

  const handleDeleteAccount = () => {
    const userDataStr = localStorage.getItem('signupData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      const userEmail = userData.email;

      // Remove all user-specific data
      localStorage.removeItem(`onboarding-${userEmail}`);
      localStorage.removeItem(`payment-${userEmail}`);
      localStorage.removeItem(`roadmapTasks-${userEmail}`);
      localStorage.removeItem(`aiSuggestion-${userEmail}`);
      localStorage.removeItem(`lastCheckIn-${userEmail}`);
      
      // Remove generic session data
      localStorage.removeItem('signupData');
      localStorage.removeItem('onboardingData');
      localStorage.removeItem('paymentComplete');
      localStorage.removeItem('userAvatar');
      localStorage.removeItem('welcomeEmailSent');
      localStorage.removeItem('userName');
      localStorage.removeItem('userPlan');
      localStorage.removeItem('hasBeenWelcomed');
      localStorage.removeItem('userNotifications');


      // Remove user from the master list of all signups
      const allSignupsStr = localStorage.getItem('allSignups');
      if (allSignupsStr) {
          let allSignups = JSON.parse(allSignupsStr);
          allSignups = allSignups.filter((user: any) => user.email !== userEmail);
          localStorage.setItem('allSignups', JSON.stringify(allSignups));
      }

      toast({
        title: "Account Deleted",
        description: "Your account and all associated data have been removed.",
      });

      // Redirect to home page after deletion
      router.push('/');
    }
  };


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
             <Card>
                <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
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
                  <FormControl><Input type="email" {...field} /></FormControl>
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
      
      <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>This is a permanent action and cannot be undone.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between items-center">
             <p className="text-sm text-muted-foreground">Delete your account and all of your data.</p>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is permanent and cannot be undone. This will permanently delete your account and remove all of your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete my account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>

    </Form>
  );
}
