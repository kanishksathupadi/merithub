
"use client";

import React, { useState } from "react";
import { generateStudyGuide, type GenerateStudyGuideOutput } from "@/ai/flows/generate-study-guide";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, Search, BookOpen, Brain, HelpCircle, Check, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function StudyResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<GenerateStudyGuideOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResult(null);

    try {
        const result = await generateStudyGuide({ topic: searchQuery });
        setSearchResult(result);
    } catch (err) {
        console.error("AI search failed:", err);
        setError("Sorry, we couldn't generate a study guide for that topic. Please try being more specific.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">AI Study Buddy</h1>
        <p className="text-muted-foreground">Enter any topic to generate a personalized study guide, key concepts, and practice questions.</p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/> AI Study Guide Generator</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                    placeholder="e.g., 'Cellular Respiration in AP Biology' or 'Causes of World War I'" 
                    className="pl-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                />
                </div>
                <Button type="submit" disabled={loading || !searchQuery.trim()}>
                    {loading ? 'Generating...' : 'Generate Guide'}
                </Button>
            </form>
        </CardContent>
      </Card>

    {loading && (
        <div className="w-full space-y-4">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    )}

    {error && (
        <Alert variant="destructive">
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )}

    {!loading && !error && !searchResult && (
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
            <CardContent>
                <Accordion type="multiple" defaultValue={['concepts', 'questions']} className="w-full">
                    <AccordionItem value="concepts">
                        <AccordionTrigger className="text-xl font-semibold">
                            <div className="flex items-center gap-2">
                                <Brain className="w-5 h-5" /> Key Concepts (Flashcards)
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                            {searchResult.keyConcepts.map((item, index) => (
                                <Card key={index} className="bg-primary/5">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{item.concept}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{item.definition}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="questions">
                        <AccordionTrigger className="text-xl font-semibold">
                             <div className="flex items-center gap-2">
                                <HelpCircle className="w-5 h-5" /> Practice Questions
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                            {searchResult.practiceQuestions.map((item, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <p className="font-semibold">{index + 1}. {item.question}</p>
                                    </CardHeader>
                                    <CardContent className="bg-muted/50 p-4 rounded-md flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-500 mt-1"/>
                                        <div>
                                            <p className="font-semibold">Answer:</p>
                                            <p className="text-muted-foreground">{item.answer}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    )}

    </div>
  );
}
