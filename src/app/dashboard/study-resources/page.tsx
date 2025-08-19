
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Search, Sparkles, ChevronRight, Loader2, Link as LinkIcon, Youtube, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { findStudyResource, type FindStudyResourceOutput } from "@/ai/flows/find-study-resource";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const searchSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters long."),
});

const resourceFinderSchema = z.object({
  query: z.string().min(5, "Query must be at least 5 characters long."),
});


export default function StudyResourcesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isFindingResource, setIsFindingResource] = useState(false);
  const [foundResource, setFoundResource] = useState<FindStudyResourceOutput | null>(null);

  const searchForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { topic: "" },
  });
  
  const resourceFinderForm = useForm<z.infer<typeof resourceFinderSchema>>({
    resolver: zodResolver(resourceFinderSchema),
    defaultValues: { query: "" },
  });


  const handleSearch = (values: z.infer<typeof searchSchema>) => {
    router.push(`/dashboard/study-resources/options?topic=${encodeURIComponent(values.topic)}`);
  };
  
  const handleFindResource = async (values: z.infer<typeof resourceFinderSchema>) => {
    setIsFindingResource(true);
    setFoundResource(null);
    try {
      const result = await findStudyResource({ query: values.query });
      setFoundResource(result);
    } catch (error) {
      console.error("Failed to find resource:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sorry, we couldn't find a resource for that topic. Please try again.",
      });
    } finally {
      setIsFindingResource(false);
    }
  };

  const getResourceTypeIcon = (type: FindStudyResourceOutput['resourceType']) => {
    switch (type) {
      case 'Video': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'Article': return <Newspaper className="w-5 h-5 text-blue-500" />;
      default: return <LinkIcon className="w-5 h-5 text-primary" />;
    }
  }


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">AI Study Buddy</h1>
        <p className="text-muted-foreground">Generate personalized study materials or find the best online resources.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary" /> AI Content Generator</CardTitle>
            <CardDescription>Enter a topic to generate flashcards and quizzes.</CardDescription>
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
                          <Input placeholder="e.g., 'Cellular Respiration'" className="pl-10" {...field} />
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
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent" /> AI Resource Finder</CardTitle>
            <CardDescription>Find the single best online resource for any query.</CardDescription>
          </CardHeader>
          <CardContent>
             <Form {...resourceFinderForm}>
              <form onSubmit={resourceFinderForm.handleSubmit(handleFindResource)} className="flex flex-col sm:flex-row gap-4">
                <FormField
                  control={resourceFinderForm.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem className="relative flex-1">
                      <FormControl>
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input placeholder="e.g., 'Best SAT prep video'" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage className="absolute" />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isFindingResource}>
                  {isFindingResource ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Find'}
                </Button>
              </form>
            </Form>
            {isFindingResource && (
                <div className="mt-4 text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Searching for the best resource...
                </div>
            )}
            {foundResource && (
                <Alert className="mt-4">
                    <AlertTitle className="flex items-center gap-2">
                        {getResourceTypeIcon(foundResource.resourceType)}
                        {foundResource.title}
                    </AlertTitle>
                    <AlertDescription>
                        {foundResource.description}
                    </AlertDescription>
                     <Button asChild variant="link" className="p-0 h-auto mt-2">
                        <a href={foundResource.url} target="_blank" rel="noopener noreferrer">{foundResource.url}</a>
                    </Button>
                </Alert>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
