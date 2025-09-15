
"use client";

import { generateAvatar } from "@/ai/flows/generate-avatar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SupportChatWidget } from "@/components/dashboard/support-chat-widget";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { useEffect, useState, useLayoutEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useLayoutEffect(() => {
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
      router.replace('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);
    
    // Admins and mentors don't need onboarding data
    if (userData.email === 'admin@dymera.com' || userData.email.endsWith('@aischoolmentor.com')) {
      setIsVerified(true);
      return;
    }

    // Regular users need onboarding data
    if (userData.onboardingData) {
        setIsVerified(true);
    } else {
        router.replace('/onboarding');
    }
  }, [router]);

  useEffect(() => {
    if (isVerified && user) {
      const firstLetter = user.name?.charAt(0).toUpperCase();
      const storedAvatarKey = `userAvatar-${user.userId}`;
      const storedAvatar = localStorage.getItem(storedAvatarKey);

      if (storedAvatar) {
        setAvatarUrl(storedAvatar);
      } else if (user.userId !== 'admin' && !user.email.endsWith('@aischoolmentor.com') && firstLetter) {
        generateAvatar({ letter: firstLetter })
          .then(result => {
              localStorage.setItem(storedAvatarKey, result.imageUrl);
              setAvatarUrl(result.imageUrl);
          })
          .catch(err => {
              console.error("Failed to generate avatar", err);
          });
      }
    }
  }, [isVerified, user]);
  
  if (!isVerified || !user) {
    return null; // Or a loading spinner
  }
  
  const isAdmin = user.email === 'admin@dymera.com';
  const isMentor = user.email.endsWith('@aischoolmentor.com');

  const sidebarProps = {
    collapsible: (isAdmin || isMentor) ? "none" as const : "icon" as const,
    defaultOpen: (isAdmin || isMentor) ? true : undefined,
  };

  return (
    <SidebarProvider {...sidebarProps}>
      <div className="flex min-h-screen">
        <AppSidebar avatarUrl={avatarUrl} />
        <SidebarInset>
            <div className="p-6 sm:p-8 lg:p-12 flex-1">
                 {!(isAdmin || isMentor) && (
                    <div className="mb-4 md:hidden">
                        <SidebarTrigger />
                    </div>
                 )}
                {children}
            </div>
            <Toaster />
            {!(isAdmin || isMentor) && <SupportChatWidget />}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
