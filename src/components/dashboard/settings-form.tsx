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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

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

// Mock data that would come from the user's profile
const defaultValues: SettingsValues = {
  name: "Alex",
  email: "alex@example.com",
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
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  function onSubmit(data: SettingsValues) {
    console.log("Settings saved:", data);
    toast({
      title: "Settings Saved",
      description: "Your changes have been successfully saved.",
    });
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
