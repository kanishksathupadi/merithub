
"use client";

import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAllUsers } from '@/lib/data-client-admin';

function ActiveUsersList() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        getAllUsers().then(allUsers => {
            // For this demo, "active users" are all unique users.
            setUsers(allUsers);
        });
    }, []);

    const pageTitle = "Daily Active Users";
    const pageDescription = "A list of all users considered active for today.";

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
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Password</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow key={`${user.email}-${index}`} className="border-white/10">
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>********</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ActiveUsersPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ActiveUsersList />
        </Suspense>
    )
}
