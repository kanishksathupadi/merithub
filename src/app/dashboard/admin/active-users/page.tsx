
"use client";

import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

const getUniqueUsers = () => {
    const allUsers = getFromLocalStorage('allSignups', []);
    const uniqueUsers = allUsers.reduce((acc: any[], current: any) => {
        if (!acc.find(item => item.email === current.email)) {
            acc.push(current);
        }
        return acc;
    }, []);
    return uniqueUsers;
};

function ActiveUsersList() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const allUsers = getUniqueUsers();
        // For this demo, "active users" are all unique users.
        setUsers(allUsers);
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
                                <TableHead>Plan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow key={`${user.email}-${index}`} className="border-white/10">
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.password}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.plan === 'elite' ? 'default' : 'secondary'}
                                            className={user.plan === 'elite' ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30' : ''}
                                        >
                                            {user.plan}
                                        </Badge>
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

export default function ActiveUsersPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ActiveUsersList />
        </Suspense>
    )
}
