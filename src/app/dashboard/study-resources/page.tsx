
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateStudyGuide, type GenerateStudyGuideOutput } from "@/ai/flows/generate-study-guide";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Search, Sparkles, BookOpen, HelpCircle, ChevronRight, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

const searchSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters long."),
});

const generationSchema = z.object({
  numConcepts: z.number().min(1).max(20),
  numQuestions: z.number().min(1).max(20),
});

export default function StudyResourcesPage() {
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<GenerateStudyGuideOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const searchForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { topic: "" },
  });

  const generationForm = useForm<z.infer<typeof generationSchema>>({
    resolver: zodResolver(generationSchema),
    defaultValues: { numConcepts: 5, numQuestions: 5 },
  });

  const handleSearch = (values: z.infer<typeof searchSchema>) => {
    setCurrentTopic(values.topic);
    setError(null);
    setSearchResult(null);
  };

  const handleGeneration = async (values: z.infer<typeof generationSchema>) => {
    if (!currentTopic) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateStudyGuide({ topic: currentTopic, ...values });
      setSearchResult(result);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`studyGuide-${result.topic}`, JSON.stringify(result));
      }
    } catch (err) {
      console.error("AI search failed:", err);
      setError("Sorry, we couldn't generate a study guide for that topic. Please try being more specific.");
    } finally {
      setLoading(false);
    }
  };

  const startNewSearch = () => {
    setSearchResult(null);
    setCurrentTopic(null);
    searchForm.reset();
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">AI Study Buddy</h1>
        <p className="text-muted-foreground">Enter any topic to generate a personalized study guide, flashcards, and quizzes.</p>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!currentTopic && (
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
      )}

      {currentTopic && !searchResult && (
        <Card>
          <CardHeader>
            <CardTitle>Customize Your Study Guide</CardTitle>
            <CardDescription>You're creating a guide for: <span className="font-bold text-primary">{currentTopic}</span></CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...generationForm}>
              <form onSubmit={generationForm.handleSubmit(handleGeneration)} className="space-y-8">
                <FormField
                  control={generationForm.control}
                  name="numConcepts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between">
                        <span>Number of Flashcards (Key Concepts)</span>
                        <span className="text-primary font-bold">{field.value}</span>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={20}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={generationForm.control}
                  name="numQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between">
                        <span>Number of Practice Questions</span>
                        <span className="text-primary font-bold">{field.value}</span>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={20}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                           disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center">
                    <Button type="button" variant="ghost" onClick={() => setCurrentTopic(null)} disabled={loading}>
                        Back
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Generating...' : 'Generate Guide'}
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

       {loading && (
          <div className="w-full space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-24 w-full" />
          </div>
      )}


      {!loading && !error && !currentTopic && (
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="bg-primary/10 text-primary p-4 rounded-full">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold">Ready to Learn?</h2>
            <p className="text-muted-foreground max-w-md">Your personalized study guides will appear here once you generate them. Try searching for a topic above to get started!</p>
          </CardContent>
        </Card>
      )}

      {searchResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{searchResult.title}</CardTitle>
            <CardDescription>{searchResult.introduction}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href={`/dashboard/study-resources/flashcards?topic=${encodeURIComponent(searchResult.topic)}`} passHref>
                <Card className="hover:border-primary/50 hover:bg-primary/5 transition-colors h-full flex flex-col items-center justify-center p-6 text-center">
                  <BookOpen className="w-12 h-12 text-primary mb-2" />
                  <h3 className="text-xl font-semibold">Flashcards</h3>
                  <p className="text-muted-foreground">Review {searchResult.keyConcepts.length} key concepts</p>
                </Card>
              </Link>
               <Link href={`/dashboard/study-resources/practice-quiz?topic=${encodeURIComponent(searchResult.topic)}`} passHref>
                <Card className="hover:border-primary/50 hover:bg-primary/5 transition-colors h-full flex flex-col items-center justify-center p-6 text-center">
                    <HelpCircle className="w-12 h-12 text-primary mb-2" />
                    <h3 className="text-xl font-semibold">Practice Quiz</h3>
                    <p className="text-muted-foreground">Test yourself with {searchResult.practiceQuestions.length} questions</p>
                </Card>
              </Link>
            </div>
            <Button variant="outline" onClick={startNewSearch}>Start a New Search</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
