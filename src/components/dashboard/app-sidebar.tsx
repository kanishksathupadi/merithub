
"use client";

import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarFooter, SidebarSeparator, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Rocket, LayoutDashboard, ListChecks, TrendingUp, Settings, MessageSquare, BookOpen, LogOut, Users, ChevronUp, BrainCircuit, Shield, PenSquare, Award, Star, Share2, UserCircle, MessageSquareWarning, Briefcase, Trophy, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { AppLogo } from "../logo";

interface AppSidebarProps {
  avatarUrl: string | null;
}

export function AppSidebar({ avatarUrl: propAvatarUrl }: AppSidebarProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(propAvatarUrl);
  const { open } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    const updateUserState = () => {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUserName(userData.name);
                setUserEmail(userData.email);
                setUserId(userData.userId);
                 const storedAvatar = localStorage.getItem(`userAvatar-${userData.userId}`);
                 if (storedAvatar) {
                    setAvatarUrl(storedAvatar);
                 }
            } catch(e) {
                console.error("Failed to parse user data from session storage", e);
            }
        }
    };

    updateUserState(); // Initial load
    // Listen for custom event that might signify a user data update
    window.addEventListener('sessionStorageUpdated', updateUserState);
    return () => window.removeEventListener('sessionStorageUpdated', updateUserState);
  }, []);

  useEffect(() => {
    setAvatarUrl(propAvatarUrl);
  }, [propAvatarUrl]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        sessionStorage.clear();
    }
    router.push('/');
  };

  const displayName = userName || "User";
  const avatarFallback = displayName ? displayName.charAt(0).toUpperCase() : "U";
  const isAdmin = userEmail === 'admin@dymera.com';
  const isMentor = userEmail?.endsWith('@aischoolmentor.com');

  if (isMentor) {
      return (
        <Sidebar>
            <SidebarHeader>
                <Link href="/dashboard/mentor/admin" className={cn("flex items-center gap-2", !open && "hidden")}>
                    <AppLogo className="w-8 h-8 text-primary" />
                    <h1 className="text-xl font-bold tracking-tight">AI School Mentor</h1>
                </Link>
            </SidebarHeader>
            <SidebarMenu className="flex-1 px-2 pt-4">
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Mentor Dashboard">
                        <Link href="/dashboard/mentor/admin"><LayoutDashboard/>Dashboard</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <SidebarFooter className="p-2">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start items-center gap-2 p-2 h-auto">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback>{avatarFallback}</AvatarFallback>
                            </Avatar>
                            <div className={cn("flex flex-col items-start", !open && "hidden")}>
                                <span className="font-medium">{displayName}</span>
                                 <span className="text-xs text-muted-foreground">Mentor</span>
                            </div>
                            <ChevronUp className={cn("w-4 h-4 ml-auto", !open && "hidden")} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[calc(var(--sidebar-width)_-_1rem)] mb-2" side="top" align="start">
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                            <LogOut className="w-4 h-4" /> Log Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
      )
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-2 pt-4">
        <Link href={isAdmin ? "/dashboard/admin" : "/dashboard"} className={cn("flex items-center gap-2 overflow-hidden", !open && "hidden")}>
            <AppLogo className="w-8 h-8 text-primary flex-shrink-0" />
            <h1 className="text-xl font-bold tracking-tight truncate">AI School Mentor</h1>
        </Link>
      </SidebarHeader>
      <SidebarMenu className="flex-1 px-2 pt-4">
        {isAdmin ? (
            <>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link href="/dashboard/admin"><LayoutDashboard/>Dashboard</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Support Requests">
                    <Link href="/dashboard/admin/support-requests"><MessageSquareWarning/>Support Requests</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Mentor Dashboard">
                    <Link href="/dashboard/mentor/admin"><Briefcase/>Mentor Dashboard</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            </>
        ) : (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/dashboard"><LayoutDashboard/>Dashboard</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="My Portfolio">
                <Link href="/dashboard/portfolio"><UserCircle/>My Portfolio</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Action Plan">
                <Link href="/dashboard/roadmap"><ListChecks/>Action Plan</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Progress Tracker">
                <Link href="/dashboard/progress"><TrendingUp/>Progress Tracker</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="College Finder">
                <Link href="/dashboard/college-finder"><BrainCircuit/>College Finder</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="AI Study Buddy">
                <Link href="/dashboard/study-resources"><BookOpen/>AI Study Buddy</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Scholarship Finder">
                <Link href="/dashboard/scholarship-finder"><Award/>Scholarship Finder</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Q&A Forum">
                <Link href="/dashboard/q-and-a-forum"><MessageSquare/>Q&A Forum</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="AI Essay Review">
                <Link href="/dashboard/essay-review"><PenSquare/>AI Essay Review</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Leaderboard">
                <Link href="/dashboard/leaderboard"><Trophy/>Leaderboard</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        )}

      </SidebarMenu>
      
      <SidebarSeparator />

      <SidebarFooter className="p-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start items-center gap-2 p-2 h-auto">
                     <Avatar className="w-8 h-8">
                        <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className={cn("flex flex-col items-start", !open && "hidden")}>
                        <span className="font-medium">{displayName}</span>
                    </div>
                    <ChevronUp className={cn("w-4 h-4 ml-auto", !open && "hidden")} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(var(--sidebar-width)_-_1rem)] mb-2" side="top" align="start">
                <DropdownMenuItem asChild>
                     <Link href="/dashboard/settings" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="w-4 h-4" /> Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
