
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare, CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { ForumPost, ForumReply } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

const replySchema = z.object({
  content: z.string().min(1, "Reply cannot be empty."),
});

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);

  useEffect(() => {
    if (id) {
      try {
        const savedPosts = localStorage.getItem("forumPosts");
        if (savedPosts) {
          const posts: ForumPost[] = JSON.parse(savedPosts);
          const foundPost = posts.find(p => p.id === id);
          if (foundPost) {
            setPost(foundPost);
            setReplies(foundPost.replies || []);
          } else {
            router.push('/dashboard/q-and-a-forum');
          }
        }
      } catch (error) {
        console.error("Failed to load post", error);
        router.push('/dashboard/q-and-a-forum');
      }
    }
  }, [id, router]);

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (values: z.infer<typeof replySchema>) => {
    if (!post) return;

    let userName = "Anonymous";
    const signupDataStr = localStorage.getItem('signupData');
    if (signupDataStr) {
        const signupData = JSON.parse(signupDataStr);
        userName = signupData.name || "Anonymous";
    }
    const userAvatar = userName.charAt(0).toUpperCase();

    const newReply: ForumReply = {
      id: uuidv4(),
      user: userName,
      avatar: userAvatar,
      hint: "student face",
      content: values.content,
      timestamp: new Date().toISOString(),
    };

    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);

    // Update localStorage
    const savedPosts = localStorage.getItem("forumPosts");
    if (savedPosts) {
        let posts: ForumPost[] = JSON.parse(savedPosts);
        posts = posts.map(p => {
            if (p.id === post.id) {
                return { ...p, replies: updatedReplies };
            }
            return p;
        });
        localStorage.setItem("forumPosts", JSON.stringify(posts));
    }
    
    toast({
        title: "Reply posted!",
    });
    form.reset();
  };

  if (!post) {
    return <div className="flex items-center justify-center min-h-screen">Loading post...</div>;
  }

  return (
    <div className="space-y-8">
      <header>
        <Button variant="ghost" asChild>
          <Link href="/dashboard/q-and-a-forum">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forum
          </Link>
        </Button>
      </header>
      
      <Card>
        <CardHeader>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="flex items-center text-sm text-muted-foreground mt-2 gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint={post.hint} />
                  <AvatarFallback>{post.avatar}</AvatarFallback>
                </Avatar>
                <span>Posted by {post.user}</span>
              </div>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-foreground/80">{post.content}</p>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare/> Replies ({replies.length})
        </h2>

        {replies.map((reply) => (
            <Card key={reply.id} className="bg-muted/50">
                <CardHeader className="flex flex-row items-start gap-4 p-4">
                     <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint={reply.hint} />
                      <AvatarFallback>{reply.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-semibold">{reply.user}</p>
                        <p className="text-sm text-foreground/90 mt-1">{reply.content}</p>
                    </div>
                </CardHeader>
            </Card>
        ))}
      </section>

      <section>
        <Card>
            <CardHeader>
                <h3 className="text-xl font-semibold flex items-center gap-2"><CornerUpLeft/> Add Your Reply</h3>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                         <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea placeholder="Write your comment here..." className="resize-none" rows={4} {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Post Reply</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
