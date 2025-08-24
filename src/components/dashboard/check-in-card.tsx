
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

interface CheckInCardProps {
    onCheckIn: (text: string) => Promise<void>;
    isLoading: boolean;
}

const checkInSchema = z.object({
  checkInText: z.string().min(10, "Please provide a bit more detail for the AI.").max(500, "Please keep your update concise (under 500 characters)."),
});

export function CheckInCard({ onCheckIn, isLoading }: CheckInCardProps) {
    const form = useForm<z.infer<typeof checkInSchema>>({
        resolver: zodResolver(checkInSchema),
        defaultValues: { checkInText: "" },
    });

    const handleSubmit = async (values: z.infer<typeof checkInSchema>) => {
        await onCheckIn(values.checkInText);
        form.reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="text-accent w-6 h-6" />
                    AI Check-In
                </CardTitle>
                <CardDescription>
                    Update the AI on your progress, new interests, or challenges to refine your plan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="checkInText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g., 'I just joined the debate team and I'm really interested in political science now.' or 'I'm finding AP Calculus much harder than I expected.'"
                                            className="resize-none"
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>Update My Plan <ArrowRight className="ml-2" /></>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
