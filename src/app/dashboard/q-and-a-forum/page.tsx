
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
import { v4 as uuidv4 } from "uuid";
import type { ForumPost } from "@/lib/types";
import Link from "next/link";

const initialForumPosts: Omit<ForumPost, 'id' | 'replies'>[] = [
  {
    user: "Jessica S.",
    avatar: "JS",
    hint: "female student",
    avatarUrl: "https://images.unsplash.com/photo-1499887142886-791eca5918cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxmZW1hbGUlMjBzdHVkZW50fGVufDB8fHx8MTc1NTU1NTU5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Best way to prepare for the SAT essay section?",
    content: "I'm finding it hard to structure my essays for the SAT. Does anyone have a good framework or resources they'd recommend? I'm aiming for a high score but my practice essays feel a bit weak.",
    upvotes: 45,
    tags: ["SAT", "Essays"],
  },
  {
    user: "Michael I.",
    avatar: "MI",
    hint: "male student",
    avatarUrl: "https://images.unsplash.com/photo-1624918479892-3e5df2910410?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYWxlJTIwc3R1ZGVudHxlbnwwfHx8fDE3NTU1NTU1OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Has anyone participated in the Google Science Fair? Looking for tips.",
    content: "I'm thinking of entering the Google Science Fair this year. It seems like a huge undertaking. If anyone has gone through it, I'd love to hear about your experience, how you picked a topic, and how you managed the project timeline.",
    upvotes: 72,
    tags: ["STEM", "Competitions"],
  },
  {
    user: "Emily A.",
    avatar: "EA",
    hint: "student face",
    avatarUrl: "https://images.unsplash.com/photo-1634219325274-53add2ddd28b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxzdHVkZW50JTIwZmFjZXxlbnwwfHx8fDE3NTU1NTU1OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "How to balance a heavy AP course load with extracurriculars?",
    content: "Next year I'm taking 4 APs and I'm also captain of the debate team and in the school orchestra. I'm worried about burnout. How do you all stay organized and make sure you have time for everything, including sleep?",
    upvotes: 102,
    tags: ["Academics", "Time Management"],
  },
  {
    user: "Chris L.",
    avatar: "CL",
    hint: "male student",
    avatarUrl: "https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtYWxlJTIwc3R1ZGVudHxlbnwwfHx8fDE3NTU1NTU1OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "What are some unique extracurriculars for someone interested in medicine?",
    content: "I want to go pre-med in college, and I already volunteer at the local hospital. I'm looking for something more unique to add to my application. Any ideas for extracurriculars that stand out for a future doctor?",
    upvotes: 58,
    tags: ["Extracurriculars", "Medicine"],
  }
];

const postSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long.").max(200, "Title is too long."),
  content: z.string().min(20, "Post content must be at least 20 characters long."),
});


export default function QandAForumPage() {
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem("forumPosts");
      if (savedPosts) {
        setForumPosts(JSON.parse(savedPosts));
      } else {
        const postsWithIds = initialForumPosts.map(post => ({ ...post, id: uuidv4(), replies: [] }));
        setForumPosts(postsWithIds);
        localStorage.setItem("forumPosts", JSON.stringify(postsWithIds));
      }
    } catch (error) {
        console.error("Failed to parse forum posts from localStorage", error);
        const postsWithIds = initialForumPosts.map(post => ({ ...post, id: uuidv4(), replies: [] }));
        setForumPosts(postsWithIds);
        localStorage.setItem("forumPosts", JSON.stringify(postsWithIds));
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
    let userName = "Anonymous";
    const signupDataStr = localStorage.getItem('signupData');
    if (signupDataStr) {
        const signupData = JSON.parse(signupDataStr);
        userName = signupData.name || "Anonymous";
    }

    const userAvatar = userName.charAt(0).toUpperCase();

    const newPost: ForumPost = {
      id: uuidv4(),
      user: userName,
      avatar: userAvatar,
      hint: "student face",
      title: values.title,
      content: values.content,
      replies: [],
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
        {forumPosts.map((post) => (
          <Link href={`/dashboard/q-and-a-forum/${post.id}`} key={post.id} className="block">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <div className="flex flex-col items-center">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1"><ArrowUp className="w-4 h-4"/>{post.upvotes}</Button>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1 gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={post.avatarUrl} data-ai-hint={post.hint} />
                        <AvatarFallback>{post.avatar}</AvatarFallback>
                      </Avatar>
                      <span>{post.user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.replies?.length || 0} replies</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
