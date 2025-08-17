
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, MessageSquare, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const initialForumPosts = [
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

const postSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long.").max(200, "Title is too long."),
  content: z.string().min(20, "Post content must be at least 20 characters long."),
});


export default function QandAForumPage() {
  const [forumPosts, setForumPosts] = useState(initialForumPosts);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem("forumPosts");
      if (savedPosts) {
        setForumPosts(JSON.parse(savedPosts));
      } else {
        localStorage.setItem("forumPosts", JSON.stringify(initialForumPosts));
      }
    } catch (error) {
        console.error("Failed to parse forum posts from localStorage", error);
        localStorage.setItem("forumPosts", JSON.stringify(initialForumPosts));
    }
  }, []);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (values: z.infer<typeof postSchema>) => {
    const userName = localStorage.getItem("userName") || "Anonymous";
    const userAvatar = userName.charAt(0).toUpperCase();

    const newPost = {
      user: userName,
      avatar: userAvatar,
      hint: "student face",
      title: values.title,
      replies: 0,
      upvotes: 0,
      tags: ["New", "Discussion"], // We can add tag selection later
    };

    const updatedPosts = [newPost, ...forumPosts];
    setForumPosts(updatedPosts);
    localStorage.setItem("forumPosts", JSON.stringify(updatedPosts));
    
    toast({
        title: "Success!",
        description: "Your discussion has been posted.",
    });

    form.reset();
    setDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Q&A Forum</h1>
          <p className="text-muted-foreground">Ask questions, share knowledge, and connect with the community.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Start a New Discussion
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Start a New Discussion</DialogTitle>
                    <DialogDescription>
                        Share your question or topic with the community. Be specific and clear.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                         <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., How can I find good research opportunities?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Elaborate on your question or topic here..." className="resize-none" rows={5} {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Post Discussion</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
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
