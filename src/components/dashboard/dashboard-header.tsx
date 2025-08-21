
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Bell, Check, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';

const mockNotifications = [
    { id: 1, title: "Task Completed!", description: "You earned 20 points for 'Master Quadratic Equations'." },
    { id: 2, title: "New Message", description: "Dr. Evelyn Reed replied to your message." },
    { id: 3, title: "Deadline Reminder", description: "Your application for the 'Tech Innovators Scholarship' is due tomorrow." },
];

export function DashboardHeader() {
    const [userName, setUserName] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [userPlan, setUserPlan] = useState<'standard' | 'elite'>('standard');
    const [isAdmin, setIsAdmin] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);

    useEffect(() => {
        const name = localStorage.getItem('userName');
        const plan = localStorage.getItem('userPlan') as 'standard' | 'elite' | null;
        const signupDataStr = localStorage.getItem('signupData');

        if (name) setUserName(name);
        if (plan) setUserPlan(plan);
        if (signupDataStr) {
            const signupData = JSON.parse(signupDataStr);
            if (signupData.email === 'admin@dymera.com') {
                setIsAdmin(true);
            }
        }
        
        const storedAvatar = localStorage.getItem('userAvatar');
        if (storedAvatar) {
            setAvatarUrl(storedAvatar);
        }

        const handleStorageChange = () => {
          const newAvatar = localStorage.getItem('userAvatar');
          const newName = localStorage.getItem('userName');
          setAvatarUrl(newAvatar);
          setUserName(newName);
        }
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);

    }, []);

    const displayName = userName || "User";
    const avatarFallback = displayName ? displayName.charAt(0).toUpperCase() : "U";

    return (
        <header className="flex items-start justify-between">
            <div>
                <div className='flex items-center gap-3'>
                    <h1 className="text-3xl font-bold">Welcome, {displayName}!</h1>
                    {isAdmin ? (
                        <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                            Admin Plan
                        </Badge>
                    ) : userPlan === 'elite' && (
                        <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30 hover:bg-yellow-400/30">
                            <Star className="w-3 h-3 mr-1"/>
                            Elite Plan
                        </Badge>
                    )}
                </div>
                <p className="text-muted-foreground mt-1">Here is your personalized dashboard.</p>
            </div>
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button variant="outline" size="icon" className="relative">
                            {hasUnread && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />}
                            <Bell className="h-5 w-5"/>
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                         <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                         <DropdownMenuSeparator/>
                        {mockNotifications.map(notification => (
                            <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1">
                                <p className="font-semibold">{notification.title}</p>
                                <p className="text-xs text-muted-foreground">{notification.description}</p>
                            </DropdownMenuItem>
                        ))}
                         <DropdownMenuSeparator/>
                         <DropdownMenuItem className="justify-center text-sm text-muted-foreground hover:bg-muted focus:bg-muted cursor-pointer" onClick={() => setHasUnread(false)}>
                            <Check className="w-4 h-4 mr-2" /> Mark all as read
                         </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Avatar>
                    <AvatarImage src={avatarUrl ?? undefined} alt="User avatar" />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
            </div>
      </header>
    );
}
