
"use client";

import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarFooter, SidebarSeparator, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Rocket, LayoutDashboard, ListChecks, TrendingUp, Settings, MessageSquare, BookOpen, LogOut, Users, ChevronUp, GraduationCap, Shield, PenSquare, Award, Star, Share2, UserCircle, MessageSquareWarning, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();


  useEffect(() => {
    const updateUserState = () => {
      const name = localStorage.getItem('userName');
      const signupDataStr = localStorage.getItem('signupData');
      const storedAvatar = localStorage.getItem('userAvatar');
      
      if (signupDataStr) {
          try {
            const signupData = JSON.parse(signupDataStr);
            setUserEmail(signupData.email);
            setUserId(signupData.userId); // This is the key change
          } catch(e) {
            console.error("Failed to parse signupData", e)
          }
      }
      if (name) {
          setUserName(name);
      }
      if (storedAvatar) {
        setAvatarUrl(storedAvatar);
      }
    };

    updateUserState(); // Initial load
      
    window.addEventListener('storage', updateUserState);
    return () => window.removeEventListener('storage', updateUserState);
  }, []);

  useEffect(() => {
    setAvatarUrl(propAvatarUrl);
  }, [propAvatarUrl]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        const email = userEmail;
        // Clear session-specific data
        localStorage.removeItem('signupData');
        localStorage.removeItem('onboardingData');
        localStorage.removeItem('paymentComplete');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('welcomeEmailSent');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPlan');
        localStorage.removeItem('hasBeenWelcomed');

        // Note: We are intentionally NOT clearing user-specific persisted data like:
        // - `onboarding-${email}`
        // - `payment-${email}`
        // - `roadmapTasks-${email}`
        // - `aiSuggestion-${email}`
        // This ensures that when the user logs back in, their progress is restored.
    }
    router.push('/');
  };

  const displayName = userName || "User";
  const avatarFallback = displayName ? displayName.charAt(0).toUpperCase() : "U";
  const isAdmin = userEmail === 'admin@dymera.com';
  const isMentor = userEmail?.endsWith('@pinnaclepath-mentor.com');

  if (isMentor) {
      return (
        <Sidebar>
            <SidebarHeader className={cn("flex flex-row items-center", open ? "justify-between" : "justify-center")}>
                <div className={cn("flex items-center gap-2", !open && "hidden")}>
                <Link href="/dashboard/mentor/admin" className="flex items-center gap-2 p-2 rounded-lg hover:bg-sidebar-accent">
                    <GraduationCap className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">PinnaclePath</h1>
                </Link>
                </div>
                <SidebarTrigger />
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
      <SidebarHeader className={cn("flex flex-row items-center", open ? "justify-between" : "justify-center")}>
        <div className={cn("flex items-center gap-2", !open && "hidden")}>
          <Link href={isAdmin ? "/dashboard/admin" : "/dashboard"} className="flex items-center gap-2 p-2 rounded-lg hover:bg-sidebar-accent">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">PinnaclePath</h1>
          </Link>
        </div>
        <SidebarTrigger />
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
              <SidebarMenuButton asChild tooltip="My Roadmap">
                <Link href="/dashboard/roadmap"><ListChecks/>My Roadmap</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Progress Tracker">
                <Link href="/dashboard/progress"><TrendingUp/>Progress Tracker</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="College Finder">
                <Link href="/dashboard/college-finder"><GraduationCap/>College Finder</Link>
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
                <SidebarMenuButton asChild tooltip="Mentor Match">
                <Link href="/dashboard/mentor-match"><Users/>Mentor Match</Link>
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
