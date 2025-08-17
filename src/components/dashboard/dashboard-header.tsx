
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader() {
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const name = localStorage.getItem('userName');
        if (name) {
            setUserName(name);
        }
    }, []);

    const displayName = userName || "User";
    const avatarFallback = displayName ? displayName.charAt(0).toUpperCase() : "U";

    return (
        <header className="flex items-center justify-between py-4">
            <div>
                <h1 className="text-3xl font-bold">Welcome, {displayName}!</h1>
                <p className="text-muted-foreground">Here is your personalized dashboard.</p>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                    <Bell className="h-5 w-5"/>
                    <span className="sr-only">Notifications</span>
                </Button>
                <Avatar>
                    <AvatarImage src={`https://placehold.co/40x40.png`} alt="User avatar" />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
            </div>
      </header>
    );
}
