
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAllUsers } from '@/lib/data-client-admin';


function UsersList() {
    const searchParams = useSearchParams();
    const planFilter = searchParams.get('plan');
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        getAllUsers().then(allUsers => {
            const filteredUsers = planFilter 
                ? allUsers.filter((user: any) => user.plan === planFilter)
                : allUsers;
            setUsers(filteredUsers);
        });
    }, [planFilter]);

    const pageTitle = "All Users";
    
    const pageDescription = "A comprehensive list of all users who have signed up.";


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

export default function UsersPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UsersList />
        </Suspense>
    )
}
