
"use client";

import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BrainCircuit, User, Send, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage } from '@/lib/types';
import { getSupportRequests, updateSupportRequests } from '@/lib/data-client-admin';


interface ChatRequest {
    userId: string;
    userName: string;
    timestamp: string;
    status: 'pending' | 'resolved';
    chatHistory: ChatMessage[];
}

function SupportRequestsList() {
    const { toast } = useToast();
    const [requests, setRequests] = useState<ChatRequest[]>([]);
    const [adminMessage, setAdminMessage] = useState("");
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    
    useEffect(() => {
        getSupportRequests().then(allRequests => {
            setRequests(allRequests);
        });
    }, []);

    const updateChatGlobally = (updatedRequests: ChatRequest[]) => {
        setRequests(updatedRequests);
        updateSupportRequests(updatedRequests);
    }

    const markAsResolved = (userId: string) => {
        const updatedRequests = requests.map(req => 
            req.userId === userId ? { ...req, status: 'resolved' } : req
        );
        updateChatGlobally(updatedRequests);
    };

    const handleAdminSendMessage = (e: React.FormEvent, userId: string) => {
        e.preventDefault();
        if (!adminMessage.trim()) return;

        const newMessage: ChatMessage = {
            role: 'human',
            content: adminMessage,
        };

        const updatedRequests = requests.map(req => {
            if (req.userId === userId) {
                return { ...req, chatHistory: [...req.chatHistory, newMessage] };
            }
            return req;
        });

        updateChatGlobally(updatedRequests);
        setAdminMessage("");

        toast({
            title: "Message Sent!",
            description: `Your message has been sent to ${requests.find(r => r.userId === userId)?.userName}.`,
        });
    };

    const pageTitle = "Human Support Requests";
    const pageDescription = "Students who have requested to speak with a human mentor.";

    return (
        <div className="space-y-8">
             <header>
                <Button variant="ghost" asChild>
                    <Link href="/dashboard/admin">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
                    </Link>
                </Button>
            </header>
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>{pageTitle}</CardTitle>
                    <CardDescription>{pageDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10">
                                <TableHead>Student Name</TableHead>
                                <TableHead>Request Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {requests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        No support requests at this time.
                                    </TableCell>
                                </TableRow>
                            )}
                            {requests.map((req) => (
                                <TableRow key={req.userId} className="border-white/10">
                                    <TableCell className="font-medium">{req.userName}</TableCell>
                                    <TableCell>{format(parseISO(req.timestamp), "PPP p")}</TableCell>
                                    <TableCell>
                                        <Badge variant={req.status === 'pending' ? 'destructive' : 'default'}>
                                            {req.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Dialog onOpenChange={(open) => !open && setCurrentChatId(null)}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => setCurrentChatId(req.userId)}>View & Respond</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl h-[90vh] flex flex-col glass-card">
                                                <DialogHeader>
                                                    <DialogTitle>Chat History with {req.userName}</DialogTitle>
                                                    <DialogDescription>Review and respond to the conversation.</DialogDescription>
                                                </DialogHeader>
                                                <ScrollArea className="flex-1 w-full rounded-md border p-4 border-white/10">
                                                    <div className="space-y-4">
                                                        {req.chatHistory.map((msg, index) => (
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
                                                    </div>
                                                </ScrollArea>
                                                 <form onSubmit={(e) => handleAdminSendMessage(e, req.userId)} className="flex items-center gap-2 border-t pt-4 border-white/10">
                                                    <Input 
                                                        placeholder="Type your response..."
                                                        value={adminMessage}
                                                        onChange={(e) => setAdminMessage(e.target.value)}
                                                    />
                                                    <Button type="submit" size="icon">
                                                        <Send className="w-4 h-4"/>
                                                    </Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                        <Button size="sm" onClick={() => markAsResolved(req.userId)} disabled={req.status === 'resolved'}>
                                            Mark as Resolved
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default function SupportRequestsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SupportRequestsList />
        </Suspense>
    )
}
