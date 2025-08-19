
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Bell, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '../ui/badge';

export function DashboardHeader() {
    const [userName, setUserName] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [userPlan, setUserPlan] = useState<'standard' | 'elite'>('standard');

    useEffect(() => {
        const name = localStorage.getItem('userName');
        if (name) {
            setUserName(name);
        }
        const plan = localStorage.getItem('userPlan') as 'standard' | 'elite' | null;
        if (plan) {
            setUserPlan(plan);
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
                    {userPlan === 'elite' && (
                        <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30 hover:bg-yellow-400/30">
                            <Star className="w-3 h-3 mr-1"/>
                            Elite Plan
                        </Badge>
                    )}
                </div>
                <p className="text-muted-foreground mt-1">Here is your personalized dashboard.</p>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                    <Bell className="h-5 w-5"/>
                    <span className="sr-only">Notifications</span>
                </Button>
                <Avatar>
                    <AvatarImage src={avatarUrl ?? undefined} alt="User avatar" />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
            </div>
      </header>
    );
}
