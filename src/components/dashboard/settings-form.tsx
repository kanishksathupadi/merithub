
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";


const settingsSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  email: z.string().email(),
  notifications: z.object({
    newOpportunities: z.boolean(),
    mentorMessages: z.boolean(),
    deadlineReminders: z.boolean(),
  }),
  privacy: z.object({
    showProfileInMentorSearch: z.boolean(),
  }),
});

type SettingsValues = z.infer<typeof settingsSchema>;

const defaultValues: Partial<SettingsValues> = {
  notifications: {
    newOpportunities: true,
    mentorMessages: true,
    deadlineReminders: false,
  },
  privacy: {
    showProfileInMentorSearch: true,
  },
};

export function SettingsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<'standard' | 'elite' | 'free' | null>(null);
  const router = useRouter();

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  useEffect(() => {
    const userData = localStorage.getItem('signupData');
    const plan = localStorage.getItem('userPlan');

    if (userData) {
      const parsedData = JSON.parse(userData);
      form.reset({
        name: parsedData.name,
        email: parsedData.email,
        notifications: defaultValues.notifications,
        privacy: defaultValues.privacy,
      });
    }
    setUserPlan(plan as any);
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

  const handleCancelSubscription = () => {
    const userDataStr = localStorage.getItem('signupData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      userData.plan = 'free'; // Downgrade plan
      localStorage.setItem('signupData', JSON.stringify(userData));
      localStorage.setItem('userPlan', 'free');
      setUserPlan('free');
      window.dispatchEvent(new Event('storage'));
      toast({
        title: "Subscription Cancelled",
        description: "Your plan has been cancelled. You can resubscribe at any time.",
      });
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

        <Card>
          <CardHeader>
            <CardTitle>Subscription & Billing</CardTitle>
            <CardDescription>Manage your current plan and billing details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-semibold">Your Current Plan</p>
                 <p className="text-sm text-muted-foreground">
                    {userPlan === 'free' ? 'You are on the free plan.' : `You are on the ${userPlan} plan.`}
                </p>
              </div>
              {userPlan === 'elite' ? (
                <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                    <Star className="w-3 h-3 mr-1"/> Elite
                </Badge>
              ) : userPlan === 'standard' ? (
                <Badge variant="secondary">Standard</Badge>
              ) : (
                <Badge variant="outline">Free</Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            {userPlan === 'free' ? (
                 <Button onClick={() => router.push('/#pricing')}>Resubscribe</Button>
            ) : (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Cancel Subscription</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will cancel your subscription at the end of the current billing period. You will lose access to premium features.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Go Back</AlertDialogCancel>
                            <AlertDialogAction onClick={handleCancelSubscription}>Confirm Cancellation</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to be notified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="notifications.newOpportunities"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>New Opportunities</FormLabel>
                    <FormDescription>Receive alerts for new competitions, events, and programs.</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="notifications.mentorMessages"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Mentor Messages</FormLabel>
                    <FormDescription>Get notified when a mentor sends you a message.</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="notifications.deadlineReminders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Deadline Reminders</FormLabel>
                    <FormDescription>Get reminders for upcoming task and application deadlines.</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Privacy & Safety</CardTitle>
            <CardDescription>Manage your profile's visibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="privacy.showProfileInMentorSearch"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Visible in Mentor Search</FormLabel>
                    <FormDescription>Allow mentors to find your profile when searching for students to guide.</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
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
