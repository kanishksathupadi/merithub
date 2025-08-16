
"use client";

import React, { useState } from "react";
import { findStudyResource, type FindStudyResourceOutput } from "@/ai/flows/find-study-resource";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Film, Lightbulb, Mic, FileText, Search, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const resources = {
  "standardized-tests": [
    { title: "SAT Math: Advanced Guide", type: "Guide", icon: Book, imageHint: "math textbook" },
    { title: "ACT English Prep Course", type: "Video", icon: Film, imageHint: "lecture hall" },
    { title: "Digital SAT Walkthrough", type: "Video", icon: Film, imageHint: "student laptop" },
  ],
  "college-essays": [
    { title: "Crafting a Winning Personal Statement", type: "Guide", icon: Book, imageHint: "person writing" },
    { title: "Analyzing 'Why Us?' Essay Prompts", type: "Article", icon: FileText, imageHint: "college campus" },
    { title: "Brainstorming Workshop", type: "Podcast", icon: Mic, imageHint: "microphone" },
  ],
  "stem-competitions": [
    { title: "Intro to Regeneron ISEF", type: "Video", icon: Film, imageHint: "science fair" },
    { title: "Winning Science Fair Projects", type: "Article", icon: FileText, imageHint: "laboratory" },
    { title: "Coding Interview Prep", type: "Guide", icon: Book, imageHint: "code on screen" },
  ],
};

const resourceTypes = [
    { value: "all", label: "All Resources" },
    { value: "standardized-tests", label: "Standardized Tests" },
    { value: "college-essays", label: "College Essays" },
    { value: "stem-competitions", label: "STEM Competitions" },
]

const resourceTypeToIcon: Record<string, React.ElementType> = {
    'Guide': Book,
    'Video': Film,
    'Article': FileText,
    'Podcast': Mic,
    'Course': Book,
};

export default function StudyResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<FindStudyResourceOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResult(null);

    try {
        const result = await findStudyResource({ query: searchQuery });
        setSearchResult(result);
    } catch (err) {
        console.error("AI search failed:", err);
        setError("Sorry, we couldn't find a resource for that query. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Study Resources</h1>
        <p className="text-muted-foreground">Curated guides, videos, and articles to help you excel. Or use our AI to find the perfect resource.</p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/> AI-Powered Search</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                    placeholder="e.g., 'Best videos for understanding calculus limits'" 
                    className="pl-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                />
                </div>
                <Button type="submit" disabled={loading || !searchQuery.trim()}>
                    {loading ? 'Searching...' : 'Find Resource'}
                </Button>
            </form>
        </CardContent>
        {loading && (
            <CardFooter>
                <div className="w-full space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-2/3" />
                </div>
            </CardFooter>
        )}
        {error && (
            <CardFooter>
                <Alert variant="destructive">
                    <AlertTitle>Search Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </CardFooter>
        )}
        {searchResult && (
            <CardFooter>
                <Card className="w-full bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-xl">{searchResult.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{searchResult.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                           {React.createElement(resourceTypeToIcon[searchResult.resourceType] || Book, {className:"w-4 h-4"})}
                           {searchResult.resourceType}
                        </p>
                        <Button asChild>
                            <a href={searchResult.url} target="_blank" rel="noopener noreferrer">
                                <LinkIcon className="mr-2 h-4 w-4" /> Go to Resource
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
            </CardFooter>
        )}
      </Card>


      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            {resourceTypes.map(rt => <TabsTrigger key={rt.value} value={rt.value}>{rt.label}</TabsTrigger>)}
        </TabsList>
        
        {Object.entries(resources).map(([category, items]) => (
             <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {items.map((res, index) => <ResourceCard key={index} {...res}/>)}
                </div>
             </TabsContent>
        ))}

        <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {Object.values(resources).flat().map((res, index) => <ResourceCard key={index} {...res}/>)}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ResourceCard({ title, type, icon: Icon, imageHint }: { title: string; type: string; icon: React.ElementType, imageHint: string }) {
    return (
        <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
                 <Image src={`https://placehold.co/400x200.png`} alt={title} width={400} height={200} className="w-full h-auto object-cover" data-ai-hint={imageHint} />
            </CardHeader>
            <CardContent className="p-4 flex-1">
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                 <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Icon className="w-4 h-4"/> {type}
                 </p>
            </CardFooter>
        </Card>
    );
}
