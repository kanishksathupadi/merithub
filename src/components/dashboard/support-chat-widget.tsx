
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Loader2, User, BrainCircuit } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { supportChat } from '@/ai/flows/support-chat';
import type { OnboardingData, RoadmapTask } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type ChatMessage = {
    role: 'user' | 'model';
    content: string;
};

export function SupportChatWidget() {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState<{
        studentProfile: { name: string; grade: number; onboardingData: OnboardingData | null };
        roadmap: RoadmapTask[];
    } | null>(null);

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // This effect runs only when the chat widget is opened for the first time.
        // It loads the necessary user data and fetches the initial greeting.
        if (isOpen && !userData) {
            try {
                const signupDataStr = localStorage.getItem('signupData');
                const onboardingDataStr = localStorage.getItem('onboardingData');
                const email = signupDataStr ? JSON.parse(signupDataStr).email : null;
                const roadmapTasksStr = email ? localStorage.getItem(`roadmapTasks-${email}`) : '[]';

                if (signupDataStr && onboardingDataStr && roadmapTasksStr) {
                    const signupData = JSON.parse(signupDataStr);
                    const onboardingData = JSON.parse(onboardingDataStr);
                    const roadmapTasks = JSON.parse(roadmapTasksStr);

                    const loadedUserData = {
                        studentProfile: {
                            name: signupData.name,
                            grade: signupData.grade,
                            onboardingData: onboardingData,
                        },
                        roadmap: roadmapTasks,
                    };
                    setUserData(loadedUserData);

                    // Fetch initial greeting immediately after setting data
                    if (messages.length === 0) {
                        setIsLoading(true);
                        supportChat({
                            ...loadedUserData,
                            studentProfile: loadedUserData.studentProfile as any,
                            chatHistory: [],
                        })
                        .then(result => {
                            setMessages([{ role: 'model', content: result.response }]);
                        })
                        .catch(err => {
                            toast({ variant: 'destructive', title: "Error", description: "Couldn't connect to the AI assistant."});
                            console.error(err);
                        })
                        .finally(() => setIsLoading(false));
                    }
                } else {
                     toast({
                        variant: "destructive",
                        title: "Could not load profile",
                        description: "Complete onboarding for the AI to provide personalized advice."
                    });
                }
            } catch (e) {
                console.error("Failed to load user data for chat:", e);
                toast({
                    variant: "destructive",
                    title: "Could not load profile",
                    description: "Your data is needed for the AI to provide personalized advice."
                });
            }
        }
    }, [isOpen, userData, messages.length, toast]);

    useEffect(() => {
        // Auto-scroll to bottom whenever messages change
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !userData) return;

        const newUserMessage: ChatMessage = { role: 'user', content: input };
        const newMessages = [...messages, newUserMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const result = await supportChat({
                ...userData,
                studentProfile: userData.studentProfile as any, // Ensure non-null for the call
                chatHistory: newMessages,
            });

            setMessages([...newMessages, { role: 'model', content: result.response }]);
            if (result.escalationRequired) {
                toast({
                    title: "Human Help Recommended",
                    description: "It looks like a human mentor could help you best with this. Check out the Mentor Match page.",
                    duration: 8000,
                })
            }
        } catch (error) {
            console.error("Chat API error:", error);
            const errorMessage: ChatMessage = { role: 'model', content: 'Sorry, I ran into an error. Please try again.' };
            setMessages([...newMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <Button
                    size="icon"
                    className="rounded-full w-16 h-16 shadow-lg"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
                </Button>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-24 right-6 z-50"
                    >
                        <Card className="w-80 h-[500px] shadow-2xl flex flex-col">
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle>AI Support Chat</CardTitle>
                                <Button variant="outline" size="sm">Talk to a Human</Button>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden p-0">
                                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                                    <div className="space-y-4">
                                        {messages.map((msg, index) => (
                                            <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                {msg.role === 'model' && <Avatar className="w-8 h-8"><AvatarFallback><BrainCircuit/></AvatarFallback></Avatar>}
                                                <div className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                </div>
                                                 {msg.role === 'user' && <Avatar className="w-8 h-8"><AvatarFallback><User/></AvatarFallback></Avatar>}
                                            </div>
                                        ))}
                                        {isLoading && (
                                             <div className="flex gap-2 justify-start">
                                                <Avatar className="w-8 h-8"><AvatarFallback><BrainCircuit/></AvatarFallback></Avatar>
                                                <div className="max-w-[80%] rounded-lg px-3 py-2 bg-muted flex items-center">
                                                    <Loader2 className="w-5 h-5 animate-spin"/>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter>
                                <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask me anything..."
                                        disabled={isLoading}
                                    />
                                    <Button type="submit" size="icon" disabled={isLoading}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
