
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Search, Sparkles, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const searchSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters long."),
});

export default function StudyResourcesPage() {
  const router = useRouter();

  const searchForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { topic: "" },
  });

  const handleSearch = (values: z.infer<typeof searchSchema>) => {
    router.push(`/dashboard/study-resources/options?topic=${encodeURIComponent(values.topic)}`);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">AI Study Buddy</h1>
        <p className="text-muted-foreground">Enter any topic to generate a personalized study guide, flashcards, and quizzes.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary" /> AI Study Guide Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...searchForm}>
            <form onSubmit={searchForm.handleSubmit(handleSearch)} className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={searchForm.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="relative flex-1">
                    <FormControl>
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input placeholder="e.g., 'Cellular Respiration in AP Biology'" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="absolute" />
                  </FormItem>
                )}
              />
              <Button type="submit">
                Next <ChevronRight className="w-4 h-4 ml-2"/>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="text-center py-12">
        <CardContent className="flex flex-col items-center gap-4">
          <div className="bg-primary/10 text-primary p-4 rounded-full">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold">Ready to Learn?</h2>
          <p className="text-muted-foreground max-w-md">Your personalized study materials will be just a click away. Try searching for a topic above to get started!</p>
        </CardContent>
      </Card>
    </div>
  );
}
