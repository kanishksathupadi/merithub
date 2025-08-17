
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateStudyGuide, type GenerateStudyGuideOutput } from "@/ai/flows/generate-study-guide";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Search, Sparkles, BookOpen, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function StudyResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<GenerateStudyGuideOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResult(null);

    try {
        const result = await generateStudyGuide({ topic: searchQuery });
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
    setSearchQuery("");
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">AI Study Buddy</h1>
        <p className="text-muted-foreground">Enter any topic to generate a personalized study guide, key concepts, and practice questions.</p>
      </header>

      {loading && (
          <div className="w-full space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-24 w-full" />
          </div>
      )}

      {error && (
          <Alert variant="destructive">
              <AlertTitle>Generation Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
          </Alert>
      )}

      {!loading && !error && !searchResult && (
        <>
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
            <Card className="text-center py-12">
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="bg-primary/10 text-primary p-4 rounded-full">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-semibold">Ready to Learn?</h2>
                    <p className="text-muted-foreground max-w-md">Your personalized study guides will appear here once you generate them. Try searching for a topic above to get started!</p>
                </CardContent>
            </Card>
        </>
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
                            <BookOpen className="w-12 h-12 text-primary mb-2"/>
                            <h3 className="text-xl font-semibold">Flashcards</h3>
                            <p className="text-muted-foreground">Review key concepts</p>
                        </Card>
                    </Link>
                    <Card className="border-dashed h-full flex flex-col items-center justify-center p-6 text-center">
                        <HelpCircle className="w-12 h-12 text-muted-foreground mb-2"/>
                        <h3 className="text-xl font-semibold text-muted-foreground">Practice Quiz</h3>
                        <p className="text-muted-foreground">Coming Soon</p>
                    </Card>
                </div>
                <Button variant="outline" onClick={startNewSearch}>Start a New Search</Button>
            </CardContent>
        </Card>
    )}

    </div>
  );
}
