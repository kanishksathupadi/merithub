
"use client";

import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Mail, Check, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MentorRequest {
    studentId: string;
    studentName: string;
    studentEmail: string;
    studentGrade: number;
    requestedAt: string;
    status: 'pending' | 'accepted' | 'declined';
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

const saveToLocalStorage = (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving to localStorage key "${key}":`, error);
    }
};

function MentorAdminDashboard() {
    const [myRequests, setMyRequests] = useState<MentorRequest[]>([]);
    const [mentorId, setMentorId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const signupDataStr = localStorage.getItem('signupData');
        if (!signupDataStr) {
            toast({ variant: 'destructive', title: 'Not Authenticated', description: 'Could not find mentor credentials.' });
            return;
        }
        const signupData = JSON.parse(signupDataStr);
        // We'll use the user's ID as their mentor ID.
        // E.g., mentor with email "reed@aischoolmentor.com" has userId "mentor-reed"
        const currentMentorId = signupData.userId; 
        setMentorId(currentMentorId);

        const allRequests = getFromLocalStorage('mentorRequests', {});
        const mentorSpecificRequests = allRequests[currentMentorId] || [];
        setMyRequests(mentorSpecificRequests.sort((a: MentorRequest, b: MentorRequest) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()));

    }, [toast]);
    
    const updateRequestStatus = (studentId: string, newStatus: 'accepted' | 'declined') => {
        if (!mentorId) return;

        const allRequests = getFromLocalStorage('mentorRequests', {});
        let mentorSpecificRequests = allRequests[mentorId] || [];
        
        mentorSpecificRequests = mentorSpecificRequests.map((req: MentorRequest) => 
            req.studentId === studentId ? { ...req, status: newStatus } : req
        );
        
        allRequests[mentorId] = mentorSpecificRequests;
        saveToLocalStorage('mentorRequests', allRequests);
        setMyRequests(mentorSpecificRequests);

        toast({
            title: `Request ${newStatus}`,
            description: `The connection request from the student has been updated.`
        });
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
                <p className="text-muted-foreground">Manage your connection requests from students.</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Connection Requests</CardTitle>
                    <CardDescription>Students who have requested to connect with you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Requested On</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myRequests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        You have no connection requests yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {myRequests.map((req) => (
                                <TableRow key={req.studentId}>
                                    <TableCell className="font-medium">{req.studentName}</TableCell>
                                    <TableCell>{req.studentGrade}</TableCell>
                                    <TableCell>{format(parseISO(req.requestedAt), "PPP")}</TableCell>
                                    <TableCell>
                                        <Badge variant={req.status === 'pending' ? 'secondary' : req.status === 'accepted' ? 'default' : 'destructive'}>
                                            {req.status || 'pending'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                         <Button variant="outline" size="sm" asChild>
                                            <a href={`mailto:${req.studentEmail}`}><Mail className="mr-2" />Email</a>
                                        </Button>
                                         <Button variant="default" size="sm" onClick={() => updateRequestStatus(req.studentId, 'accepted')} disabled={req.status === 'accepted'}>
                                            <Check className="mr-2" />Accept
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


export default function MentorAdminPage() {
    return (
        <Suspense fallback={<div>Loading mentor dashboard...</div>}>
            <MentorAdminDashboard />
        </Suspense>
    )
}
