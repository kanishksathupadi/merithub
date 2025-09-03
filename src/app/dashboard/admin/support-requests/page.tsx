
"use client";

import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BrainCircuit, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatRequest {
    userId: string;
    userName: string;
    timestamp: string;
    status: 'pending' | 'resolved';
    chatHistory: { role: 'user' | 'model', content: string }[];
}

const getFromLocalStorage = (key: string, defaultValue: any) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return defaultValue;
    }
};

function SupportRequestsList() {
    const [requests, setRequests] = useState<ChatRequest[]>([]);
    
    useEffect(() => {
        const allRequests = getFromLocalStorage('humanChatRequests', []);
        setRequests(allRequests);
    }, []);

    const markAsResolved = (userId: string) => {
        const updatedRequests = requests.map(req => 
            req.userId === userId ? { ...req, status: 'resolved' } : req
        );
        setRequests(updatedRequests);
        localStorage.setItem('humanChatRequests', JSON.stringify(updatedRequests));
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
            <Card>
                <CardHeader>
                    <CardTitle>{pageTitle}</CardTitle>
                    <CardDescription>{pageDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
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
                                <TableRow key={req.userId}>
                                    <TableCell className="font-medium">{req.userName}</TableCell>
                                    <TableCell>{format(parseISO(req.timestamp), "PPP p")}</TableCell>
                                    <TableCell>
                                        <Badge variant={req.status === 'pending' ? 'destructive' : 'default'}>
                                            {req.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">View Chat</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Chat History with {req.userName}</DialogTitle>
                                                    <DialogDescription>Review the conversation leading to the support request.</DialogDescription>
                                                </DialogHeader>
                                                 <ScrollArea className="h-96 w-full rounded-md border p-4">
                                                    <div className="space-y-4">
                                                        {req.chatHistory.map((msg, index) => (
                                                            <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                                {msg.role === 'model' && <Avatar className="w-8 h-8"><AvatarFallback><BrainCircuit/></AvatarFallback></Avatar>}
                                                                <div className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                                    <p className="text-sm">{msg.content}</p>
                                                                </div>
                                                                 {msg.role === 'user' && <Avatar className="w-8 h-8"><AvatarFallback><User/></AvatarFallback></Avatar>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
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
