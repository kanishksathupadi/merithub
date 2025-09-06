
"use client";

import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    inquiryType: string;
    message: string;
    status: 'New' | 'Read' | 'Archived';
    submittedAt: string;
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

function ContactMessagesList() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    
    useEffect(() => {
        const allMessages = getFromLocalStorage('contactMessages', []);
        setMessages(allMessages.sort((a: ContactMessage, b: ContactMessage) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
    }, []);


    const pageTitle = "Contact Form Messages";
    const pageDescription = "Messages submitted through the public 'Contact Us' page.";

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
                                <TableHead>From</TableHead>
                                <TableHead>Inquiry Type</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {messages.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No contact messages received yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {messages.map((msg) => (
                                <TableRow key={msg.id} className="border-white/10">
                                    <TableCell className="font-medium">{msg.name}</TableCell>
                                    <TableCell>{msg.inquiryType}</TableCell>
                                    <TableCell>{format(parseISO(msg.submittedAt), "PPP")}</TableCell>
                                    <TableCell>
                                        <Badge variant={msg.status === 'New' ? 'default' : 'secondary'}>
                                            {msg.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">View Message</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-xl glass-card">
                                                <DialogHeader>
                                                    <DialogTitle>Message from {msg.name}</DialogTitle>
                                                    <DialogDescription>Type: {msg.inquiryType}</DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground"/> <a href={`mailto:${msg.email}`} className="text-primary hover:underline">{msg.email}</a></div>
                                                     <div className="pt-4">
                                                        <h4 className="font-semibold mb-2">Message</h4>
                                                        <p className="text-sm text-foreground/80 p-4 bg-black/20 rounded-md">{msg.message}</p>
                                                     </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
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

export default function ContactMessagesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ContactMessagesList />
        </Suspense>
    )
}
