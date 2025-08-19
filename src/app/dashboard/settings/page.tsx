
"use client";

import { SettingsForm } from "@/components/dashboard/settings-form";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider, useSidebar, SidebarTrigger } from "@/components/ui/sidebar";

function ConditionalSidebarTrigger() {
    const { open, isMobile } = useSidebar();
    if (open || isMobile) return null;
    return (
        <div className="fixed top-4 left-4 z-50">
            <SidebarTrigger />
        </div>
    );
}

function SettingsContent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const signupDataStr = localStorage.getItem('signupData');
        if (signupDataStr) {
            const signupData = JSON.parse(signupDataStr);
            if(signupData.email === 'admin@dymera.com') {
                setIsAdmin(true);
            }
        }
    }
    setLoading(false);
  }, []);

  if (loading) {
      return <div>Loading...</div>
  }

  const pageContent = (
     <div className="space-y-8">
        <header>
            {isAdmin && (
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/dashboard/admin">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
                    </Link>
                </Button>
            )}
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account, notifications, and privacy settings.</p>
        </header>
        <SettingsForm />
        <Toaster />
    </div>
  );

  if (isAdmin) {
      return pageContent;
  }

  // Wrap in standard dashboard layout for non-admins
  return (
    <SidebarProvider>
        <div className="flex min-h-screen">
        {/* We pass a null avatarUrl because avatar generation is handled in the main layout */}
        <AppSidebar avatarUrl={null} />
        <SidebarInset>
            <ConditionalSidebarTrigger />
            <div className="p-4 sm:p-6 lg:p-8 flex-1">
                {pageContent}
            </div>
            <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function SettingsPage() {
    return <SettingsContent />;
}
