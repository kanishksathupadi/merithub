
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUp, MessageSquare, PlusCircle } from "lucide-react";

const forumPosts = [
  {
    user: "Jessica S.",
    avatar: "JS",
    hint: "female student",
    title: "Best way to prepare for the SAT essay section?",
    replies: 12,
    upvotes: 45,
    tags: ["SAT", "Essays"],
  },
  {
    user: "Michael I.",
    avatar: "MI",
    hint: "male student",
    title: "Has anyone participated in the Google Science Fair? Looking for tips.",
    replies: 8,
    upvotes: 72,
    tags: ["STEM", "Competitions"],
  },
  {
    user: "Emily A.",
    avatar: "EA",
    hint: "student face",
    title: "How to balance a heavy AP course load with extracurriculars?",
    replies: 25,
    upvotes: 102,
    tags: ["Academics", "Time Management"],
  },
  {
    user: "Chris L.",
    avatar: "CL",
    hint: "male student",
    title: "What are some unique extracurriculars for someone interested in medicine?",
    replies: 15,
    upvotes: 58,
    tags: ["Extracurriculars", "Medicine"],
  }
];

export default function QandAForumPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Q&A Forum</h1>
          <p className="text-muted-foreground">Ask questions, share knowledge, and connect with the community.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Start a New Discussion
        </Button>
      </header>

      <Input placeholder="Search the forum..." className="max-w-sm" />

      <div className="space-y-4">
        {forumPosts.map((post, index) => (
          <Card key={index} className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <div className="flex flex-col items-center">
                <Button variant="ghost" size="sm" className="flex items-center gap-1"><ArrowUp className="w-4 h-4"/>{post.upvotes}</Button>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1 gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint={post.hint} />
                      <AvatarFallback>{post.avatar}</AvatarFallback>
                    </Avatar>
                    <span>{post.user}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.replies} replies</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
