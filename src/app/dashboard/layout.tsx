
"use client";

import { generateAvatar } from "@/ai/flows/generate-avatar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SupportChatWidget } from "@/components/dashboard/support-chat-widget";
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { useEffect, useState, useLayoutEffect } from "react";

function ConditionalSidebarTrigger() {
    const { open, isMobile } = useSidebar();
    if (open || isMobile) return null;
    return (
        <div className="fixed top-4 left-4 z-50">
            <SidebarTrigger />
        </div>
    );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Use useLayoutEffect to run verification synchronously before the browser paints.
  // This is the key to preventing any "loading" flicker for verified users.
  useLayoutEffect(() => {
    const signupDataStr = localStorage.getItem('signupData');
    if (!signupDataStr) {
      router.replace('/login');
      return;
    }

    const signupData = JSON.parse(signupDataStr);
    
    if (signupData.email === 'admin@dymera.com') {
      setIsAdmin(true);
      setIsVerified(true);
      return;
    }
    
    if (signupData.email.endsWith('@pinnaclepath-mentor.com')) {
      setIsMentor(true);
      setIsVerified(true);
      return;
    }

    // This data is set upon completion of each step
    const onboardingComplete = localStorage.getItem(`onboarding-${signupData.email}`);
    const paymentComplete = localStorage.getItem(`payment-${signupData.email}`);

    // Restore session data for this check
    if (onboardingComplete) localStorage.setItem('onboardingData', onboardingComplete);
    if (paymentComplete) localStorage.setItem('paymentComplete', 'true');

    if (!onboardingComplete) {
      router.replace('/onboarding');
    } else if (!paymentComplete) {
      router.replace('/payment');
    } else {
      setIsVerified(true); // User is fully verified, allow rendering.
    }
  }, [router]);

  useEffect(() => {
    // Handle non-critical side effects like avatar generation after verification.
    if (isVerified) {
      const signupData = JSON.parse(localStorage.getItem('signupData')!);
      const firstLetter = signupData.name?.charAt(0).toUpperCase();
      const storedAvatar = localStorage.getItem('userAvatar');

      if (storedAvatar) {
        setAvatarUrl(storedAvatar);
      } else if (!isAdmin && !isMentor && firstLetter) {
        generateAvatar({ letter: firstLetter })
          .then(result => {
              localStorage.setItem('userAvatar', result.imageUrl);
              setAvatarUrl(result.imageUrl);
              window.dispatchEvent(new Event('storage'));
          })
          .catch(err => {
              console.error("Failed to generate avatar", err);
          });
      }
    }
  }, [isVerified, isAdmin, isMentor]);

  // If the user is not yet verified, we return null.
  // Because this check runs in useLayoutEffect, this happens before the browser can paint,
  // preventing any flicker or loading state from showing on the screen.
  if (!isVerified) {
    return null;
  }
  
  if (isAdmin || isMentor) {
     return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <AppSidebar avatarUrl={avatarUrl} />
                <SidebarInset>
                    <ConditionalSidebarTrigger />
                    <div className="p-6 sm:p-8 lg:p-12 flex-1">
                        {children}
                    </div>
                    <Toaster />
                </SidebarInset>
            </div>
        </SidebarProvider>
     )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar avatarUrl={avatarUrl} />
        <SidebarInset>
            <ConditionalSidebarTrigger />
            <div className="p-6 sm:p-8 lg:p-12 flex-1">
                {children}
            </div>
            <Toaster />
            <SupportChatWidget />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
