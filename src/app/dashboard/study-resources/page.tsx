
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Film, Lightbulb, Mic, FileText } from "lucide-react";
import Image from "next/image";

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

export default function StudyResourcesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Study Resources</h1>
        <p className="text-muted-foreground">Curated guides, videos, and articles to help you excel.</p>
      </header>

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
                 <Image src="https://placehold.co/400x200.png" alt={title} width={400} height={200} className="w-full h-auto object-cover" data-ai-hint={imageHint} />
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
