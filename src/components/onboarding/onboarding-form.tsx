"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  academicStrengths: z.string().min(3, { message: "Please list at least one strength." }),
  academicWeaknesses: z.string().min(3, { message: "Please list at least one weakness." }),
  subjectsOfInterest: z.string().min(3, { message: "Please describe your interests." }),
  collegeEnvironment: z.string().min(3, { message: "Please describe your ideal college environment." }),
  preferredLearningStyle: z.string().min(1, { message: "Please select your learning style." }),
  currentExtracurriculars: z.string().min(3, { message: "Please list your extracurriculars." }),
  weeklyTimeAvailable: z.string().min(1, { message: "Please enter your available time." }),
});

type OnboardingValues = z.infer<typeof formSchema>;

const steps = [
  { id: 'step1', title: 'Academics', fields: ['academicStrengths', 'academicWeaknesses'] },
  { id: 'step2', title: 'Aspirations', fields: ['subjectsOfInterest', 'collegeEnvironment'] },
  { id: 'step3', title: 'Personal Style', fields: ['preferredLearningStyle', 'currentExtracurriculars', 'weeklyTimeAvailable'] },
];

export function OnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        academicStrengths: "",
        academicWeaknesses: "",
        subjectsOfInterest: "",
        collegeEnvironment: "",
        preferredLearningStyle: "",
        currentExtracurriculars: "",
        weeklyTimeAvailable: "",
    },
  });

  const onSubmit = (data: OnboardingValues) => {
    console.log("Onboarding complete:", data);
    // In a real app, this data would be sent to the server to call the AI
    // and store the result. For this demo, we just navigate to the dashboard.
    router.push("/dashboard");
  };

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as any, { shouldFocus: true });
    
    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    } else {
      await form.handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="w-full max-w-2xl shadow-xl border-border">
      <CardHeader>
        <CardTitle className="text-3xl">Let's Build Your Roadmap</CardTitle>
        <CardDescription>This will help us personalize your path to success.</CardDescription>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {currentStep === 0 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="academicStrengths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are your academic strengths?</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Math, Creative Writing, Biology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="academicWeaknesses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are your academic weaknesses?</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Public Speaking, Physics, Standardized Tests" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {currentStep === 1 && (
                <div className="space-y-6">
                    <FormField
                    control={form.control}
                    name="subjectsOfInterest"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>What subjects or topics are you passionate about, inside or outside of school?</FormLabel>
                        <FormControl>
                            <Textarea placeholder="e.g., building robots, ancient history, climate change" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="collegeEnvironment"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Describe your ideal learning environment after high school.</FormLabel>
                        <FormControl>
                            <Textarea placeholder="e.g., a large research university, a small collaborative college, hands-on vocational training" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            )}
            {currentStep === 2 && (
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="preferredLearningStyle"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>What is your preferred learning style?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a style" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="visual">Visual (graphs, images)</SelectItem>
                                    <SelectItem value="auditory">Auditory (lectures, discussions)</SelectItem>
                                    <SelectItem value="kinesthetic">Kinesthetic (hands-on projects)</SelectItem>
                                    <SelectItem value="reading-writing">Reading/Writing</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="currentExtracurriculars"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>What are your current extracurricular activities?</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Debate Club, Soccer, Volunteering" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="weeklyTimeAvailable"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>How many hours per week can you dedicate to self-improvement?</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 5" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                Back
              </Button>
              <Button type="button" onClick={nextStep} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
