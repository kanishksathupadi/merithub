import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Rocket, LayoutDashboard, ListChecks, TrendingUp, Settings, MessageSquare, BookOpen, User, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Rocket className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">PinnaclePath</h1>
            <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
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
              <Link href="#"><MessageSquare/>Mentor Match</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Study Resources">
              <Link href="#"><BookOpen/>Study Resources</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Q&A Forum">
              <Link href="#"><Users/>Q&amp;A Forum</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarMenu>

      <SidebarFooter className="mt-auto">
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Settings">
            <Link href="/dashboard/settings"><Settings/>Settings</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Log Out">
            <Link href="/"><LogOut/>Log Out</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
