
"use client";

import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarFooter, SidebarSeparator, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Rocket, LayoutDashboard, ListChecks, TrendingUp, Settings, MessageSquare, BookOpen, LogOut, Users, ChevronUp, GraduationCap, Shield, PenSquare, Award, Star, Share2 } from "lucide-react";
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

function UpgradeCard() {
  return (
    <Card className="bg-primary/10 border-primary/20 m-2">
      <CardContent className="p-4 text-center">
        <div className="mb-2 flex justify-center">
          <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
            <Rocket className="w-6 h-6"/>
          </div>
        </div>
        <h4 className="font-semibold text-sm">Upgrade to Elite</h4>
        <p className="text-xs text-muted-foreground mt-1 mb-3">Unlock all features and get exclusive mentor access.</p>
        <Button size="sm" className="w-full">Upgrade</Button>
      </CardContent>
    </Card>
  )
}

function EliteCard() {
   return (
    <div className="m-2 p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-center">
      <div className="flex items-center justify-center gap-2">
         <Star className="w-4 h-4 text-yellow-300" />
        <span className="text-sm font-semibold text-yellow-300">Elite Plan Active</span>
      </div>
    </div>
  )
}


export function AppSidebar({ avatarUrl: propAvatarUrl }: AppSidebarProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<'standard' | 'elite'>('standard');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(propAvatarUrl);
  const { open } = useSidebar();
  const router = useRouter();
  const { toast } = useToast();


  useEffect(() => {
    const updateUserState = () => {
      const name = localStorage.getItem('userName');
      const plan = localStorage.getItem('userPlan') as 'standard' | 'elite' | null;
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
      if (plan) {
        setUserPlan(plan);
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

  const handleSharePortfolio = () => {
    if (!userId) {
        toast({ variant: "destructive", title: "Could not generate link", description: "User ID not found. Please try logging in again." });
        return;
    };
    const url = `${window.location.origin}/portfolio/${userId}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Portfolio link copied to clipboard!" });
  }

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
        // - `allSignups`
        // This ensures that when the user logs back in, their progress is restored.
    }
    router.push('/');
  };

  const displayName = userName || "User";
  const avatarFallback = displayName ? displayName.charAt(0).toUpperCase() : "U";
  const isAdmin = userEmail === 'admin@dymera.com';

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
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link href="/dashboard/admin"><LayoutDashboard/>Dashboard</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        ) : (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/dashboard"><LayoutDashboard/>Dashboard</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="My Roadmap">
                <Link href="/dashboard/roadmap"><ListChecks/>My Roadmap</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="College Finder">
                <Link href="/dashboard/college-finder"><GraduationCap/>College Finder</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Progress Tracker">
                <Link href="/dashboard/progress"><TrendingUp/>Progress Tracker</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="AI Study Buddy">
                <Link href="/dashboard/study-resources"><BookOpen/>AI Study Buddy</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            
            {userPlan === 'elite' && (
                <SidebarGroup>
                    <h3 className="text-sm font-semibold text-muted-foreground px-2 py-1">Elite Resources</h3>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Scholarship Finder">
                        <Link href="/dashboard/scholarship-finder"><Award/>Scholarship Finder</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Mentor Match">
                        <Link href="/dashboard/mentor-match"><MessageSquare/>Mentor Match</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Q&amp;A Forum">
                        <Link href="/dashboard/q-and-a-forum"><Users/>Q&amp;A Forum</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="AI Essay Review">
                        <Link href="/dashboard/essay-review"><PenSquare/>AI Essay Review</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarGroup>
            )}
          </>
        )}

      </SidebarMenu>
      
        <div className={cn("px-2", !open && "hidden")}>
          {userPlan === 'standard' && <UpgradeCard />}
          {userPlan === 'elite' && <EliteCard />}
        </div>


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
                <DropdownMenuItem onClick={handleSharePortfolio} className="flex items-center gap-2 cursor-pointer">
                    <Share2 className="w-4 h-4" /> Share Portfolio
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
