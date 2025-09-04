
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Loader2, User, BrainCircuit, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { supportChat } from '@/ai/flows/support-chat';
import type { OnboardingData, RoadmapTask, ChatMessage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

export function SupportChatWidget() {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState<{
        studentProfile: { userId: string, name: string; grade: number; onboardingData: OnboardingData | null };
        roadmap: RoadmapTask[];
    } | null>(null);

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const loadChatState = useCallback(() => {
        if (!userData) return;
        try {
            const allRequests = JSON.parse(localStorage.getItem('humanChatRequests') || '[]');
            const myRequest = allRequests.find((r: any) => r.userId === userData.studentProfile.userId);
            if (myRequest) {
                setMessages(myRequest.chatHistory);
            }
        } catch (error) {
            console.error("Failed to load chat state from storage:", error);
        }
    }, [userData]);


    useEffect(() => {
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
                            userId: signupData.userId,
                            name: signupData.name,
                            grade: signupData.grade,
                            onboardingData: onboardingData,
                        },
                        roadmap: roadmapTasks,
                    };
                    setUserData(loadedUserData as any);
                } else {
                     toast({
                        variant: "destructive",
                        title: "Could not load profile",
                        description: "Complete onboarding for the AI to provide personalized advice."
                    });
                }
            } catch (e) {
                console.error("Failed to load user data for chat:", e);
                toast({ variant: "destructive", title: "Could not load profile" });
            }
        }
    }, [isOpen, userData, toast]);
    
    useEffect(() => {
        if (userData && messages.length === 0) {
            const allRequests = JSON.parse(localStorage.getItem('humanChatRequests') || '[]');
            const myRequest = allRequests.find((r: any) => r.userId === userData.studentProfile.userId);

            if (myRequest) {
                setMessages(myRequest.chatHistory);
            } else {
                setIsLoading(true);
                supportChat({
                    ...userData,
                    studentProfile: userData.studentProfile as any,
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
        }
    }, [userData, messages.length, toast]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
        
        window.addEventListener('storage', loadChatState);
        return () => window.removeEventListener('storage', loadChatState);

    }, [messages, loadChatState]);

    const handleHumanRequest = () => {
        if (!userData) return;
        
        try {
            const requests = JSON.parse(localStorage.getItem('humanChatRequests') || '[]');
            const existingRequest = requests.find((r: any) => r.userId === userData.studentProfile.userId);

            if (existingRequest && existingRequest.status === 'pending') {
                toast({ title: "Request Already Sent", description: "You've already requested to speak with a human. We'll be in touch soon!" });
                return;
            }

            const newRequest = {
                userId: userData.studentProfile.userId,
                userName: userData.studentProfile.name,
                timestamp: new Date().toISOString(),
                status: 'pending',
                chatHistory: [...messages, { role: 'user', content: '--- User requested human support ---' }]
            };
            
            const otherRequests = requests.filter((r: any) => r.userId !== userData.studentProfile.userId);
            const updatedRequests = [...otherRequests, newRequest];

            localStorage.setItem('humanChatRequests', JSON.stringify(updatedRequests));

            const humanSupportMessage: ChatMessage = {
                role: 'model',
                content: "I've notified our human support team. They will review our conversation and get back to you here in this chat window. You can close this chat for now."
            };
            setMessages(newRequest.chatHistory); 
            
            toast({ title: "Request Sent!", description: "A human mentor will respond in this chat window soon." });

        } catch(e) {
             console.error("Failed to log human support request:", e);
             toast({ variant: 'destructive', title: "Error", description: "Could not submit your request. Please try again." });
        }
    };


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !userData) return;

        const newUserMessage: ChatMessage = { role: 'user', content: input };
        const currentMessages = [...messages, newUserMessage];
        setMessages(currentMessages);
        setInput('');
        setIsLoading(true);

        try {
            const result = await supportChat({
                ...userData,
                studentProfile: userData.studentProfile as any,
                chatHistory: currentMessages,
            });
            
            const newAIMessage: ChatMessage = { role: 'model', content: result.response };
            
            let finalMessages = [...currentMessages, newAIMessage];

            if (result.escalationRequired) {
                toast({
                    title: "Human Help Recommended",
                    description: "It looks like a human mentor could help you best with this. I've noted this in our chat.",
                    duration: 8000,
                })
                 const escalationMessage: ChatMessage = {
                    role: 'model',
                    content: "It seems like this is a situation where a human mentor could provide the best guidance. I've flagged this conversation for our team. Feel free to use the 'Talk to a Human' button above to send a direct request."
                };
                finalMessages = [...finalMessages, escalationMessage];
            }

            setMessages(finalMessages);

            const requests = JSON.parse(localStorage.getItem('humanChatRequests') || '[]');
            const updatedRequests = requests.map((r: any) => r.userId === userData.studentProfile.userId ? {...r, chatHistory: finalMessages} : r);
            localStorage.setItem('humanChatRequests', JSON.stringify(updatedRequests));

        } catch (error) {
            console.error("Chat API error:", error);
            const errorMessage: ChatMessage = { role: 'model', content: 'Sorry, I ran into an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
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
                            <CardHeader className="flex-row items-center justify-between">
                                <CardTitle className="text-base">AI Support Chat</CardTitle>
                                <Button variant="outline" size="sm" onClick={handleHumanRequest}>Talk to a Human</Button>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden p-0">
                                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                                    <div className="space-y-4">
                                        {messages.map((msg, index) => (
                                            <div key={index} className={cn('flex items-end gap-2', {
                                                'justify-end': msg.role === 'user',
                                                'justify-start': msg.role === 'model' || msg.role === 'human'
                                            })}>
                                                {(msg.role === 'model' || msg.role === 'human') && (
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback>
                                                            {msg.role === 'model' ? <BrainCircuit/> : <ShieldCheck />}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={cn('max-w-[80%] rounded-lg px-3 py-2 text-sm', {
                                                    'bg-primary text-primary-foreground': msg.role === 'user',
                                                    'bg-muted': msg.role === 'model',
                                                    'bg-green-600/20 border border-green-500/50 text-foreground': msg.role === 'human'
                                                })}>
                                                    <p>{msg.content}</p>
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
