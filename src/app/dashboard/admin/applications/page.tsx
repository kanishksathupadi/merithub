
"use client";

import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Mail, Linkedin, Link as LinkIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Application {
    id: string;
    jobTitle: string;
    name: string;
    email: string;
    linkedin?: string;
    portfolio?: string;
    comments: string;
    status: 'New' | 'In Review' | 'Rejected' | 'Hired';
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

function JobApplicationsList() {
    const [applications, setApplications] = useState<Application[]>([]);
    
    useEffect(() => {
        const allApplications = getFromLocalStorage('jobApplications', []);
        setApplications(allApplications.sort((a: Application, b: Application) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
    }, []);


    const pageTitle = "Job Applications";
    const pageDescription = "Applications submitted for open roles at PinnaclePath.";

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
                                <TableHead>Applicant</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {applications.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No job applications received yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {applications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.name}</TableCell>
                                    <TableCell>{app.jobTitle}</TableCell>
                                    <TableCell>{format(parseISO(app.submittedAt), "PPP")}</TableCell>
                                    <TableCell>
                                        <Badge variant={app.status === 'New' ? 'default' : 'secondary'}>
                                            {app.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">View</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-xl">
                                                <DialogHeader>
                                                    <DialogTitle>Application: {app.name}</DialogTitle>
                                                    <DialogDescription>For position: {app.jobTitle}</DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground"/> <a href={`mailto:${app.email}`} className="text-primary hover:underline">{app.email}</a></div>
                                                    {app.linkedin && <div className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-muted-foreground"/> <a href={app.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline">LinkedIn Profile <ExternalLink className="inline w-3 h-3"/></a></div>}
                                                    {app.portfolio && <div className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-muted-foreground"/> <a href={app.portfolio} target="_blank" rel="noreferrer" className="text-primary hover:underline">Portfolio <ExternalLink className="inline w-3 h-3"/></a></div>}
                                                    
                                                    <div className="pt-4">
                                                        <h4 className="font-semibold mb-2">Additional Comments</h4>
                                                        <p className="text-sm text-muted-foreground p-4 bg-muted rounded-md">{app.comments}</p>
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

export default function JobApplicationsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <JobApplicationsList />
        </Suspense>
    )
}

