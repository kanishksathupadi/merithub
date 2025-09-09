

"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Bell, Check, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { UserNotification } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

export function DashboardHeader() {
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    
    useEffect(() => {
        const name = localStorage.getItem('userName');
        const signupDataStr = localStorage.getItem('signupData');

        if (name) setUserName(name);
        if (signupDataStr) {
            const signupData = JSON.parse(signupDataStr);
            setUserEmail(signupData.email);
            if (signupData.email === 'admin@dymera.com') {
                setIsAdmin(true);
            }
        }
        
        const storedAvatar = localStorage.getItem('userAvatar');
        if (storedAvatar) {
            setAvatarUrl(storedAvatar);
        }

        const handleStorageChange = (event: StorageEvent) => {
          if (event.key === 'userAvatar' || event.key === 'userName') {
            const newAvatar = localStorage.getItem('userAvatar');
            const newName = localStorage.getItem('userName');
            setAvatarUrl(newAvatar);
            setUserName(newName);
          }
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
                    <h1 className="text-3xl font-bold">Welcome, {displayName}</h1>
                </div>
                <p className="text-foreground/80 mt-1">{userEmail}</p>
            </div>
            <Avatar className="w-10 h-10">
                <AvatarImage src={avatarUrl ?? undefined} alt="User avatar" />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">{avatarFallback}</AvatarFallback>
            </Avatar>
      </header>
    );
}
