
"use client";

import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarFooter, SidebarSeparator } from "@/components/ui/sidebar";
import { Rocket, LayoutDashboard, ListChecks, TrendingUp, Settings, MessageSquare, BookOpen, LogOut, Users, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function AppSidebar() {
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
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-lg hover:bg-sidebar-accent">
            <Rocket className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">PinnaclePath</h1>
        </Link>
      </SidebarHeader>
      <SidebarMenu className="flex-1 px-2">
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
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Mentor Match">
              <Link href="/dashboard/mentor-match"><MessageSquare/>Mentor Match</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Study Resources">
              <Link href="/dashboard/study-resources"><BookOpen/>Study Resources</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Q&A Forum">
              <Link href="/dashboard/q-and-a-forum"><Users/>Q&A Forum</Link>
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
                        <AvatarImage src={`https://placehold.co/40x40.png`} alt={displayName} data-ai-hint="profile picture" />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                        <span className="font-medium">{displayName}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 ml-auto" />
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
