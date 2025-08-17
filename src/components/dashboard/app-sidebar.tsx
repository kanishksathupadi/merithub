
"use client";

import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarFooter, SidebarSeparator, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Rocket, LayoutDashboard, ListChecks, TrendingUp, Settings, MessageSquare, BookOpen, LogOut, Users, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  avatarUrl: string | null;
}

export function AppSidebar({ avatarUrl: propAvatarUrl }: AppSidebarProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<'standard' | 'elite'>('standard');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(propAvatarUrl);
  const { open } = useSidebar();


  useEffect(() => {
      const name = localStorage.getItem('userName');
      const plan = localStorage.getItem('userPlan') as 'standard' | 'elite' | null;
      if (name) {
          setUserName(name);
      }
      if (plan) {
        setUserPlan(plan);
      }
      const storedAvatar = localStorage.getItem('userAvatar');
      if (storedAvatar) {
        setAvatarUrl(storedAvatar);
      }
      
      const handleStorageChange = () => {
        const newAvatar = localStorage.getItem('userAvatar');
        setAvatarUrl(newAvatar);
      }
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setAvatarUrl(propAvatarUrl);
  }, [propAvatarUrl]);

  const displayName = userName || "User";
  const avatarFallback = displayName ? displayName.charAt(0).toUpperCase() : "U";

  return (
    <Sidebar>
      <SidebarHeader className={cn("flex flex-row items-center", open ? "justify-between" : "justify-center")}>
        <div className={cn("flex items-center gap-2", !open && "hidden")}>
          <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-lg hover:bg-sidebar-accent">
            <Rocket className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">PinnaclePath</h1>
          </Link>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarMenu className="flex-1 px-2 pt-4">
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
          <SidebarMenuButton asChild tooltip="Progress Tracker">
            <Link href="/dashboard/progress"><TrendingUp/>Progress Tracker</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarGroup>
          <h3 className="text-sm font-semibold text-muted-foreground px-2 py-1">Resources</h3>
          {userPlan === 'elite' && (
            <>
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
            </>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Study Resources">
              <Link href="/dashboard/study-resources"><BookOpen/>Study Resources</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
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
                <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Log Out
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

    
