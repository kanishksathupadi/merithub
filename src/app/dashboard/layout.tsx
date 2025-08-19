
"use client";

import { generateAvatar } from "@/ai/flows/generate-avatar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [isVerified, setIsVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const signupDataStr = localStorage.getItem('signupData');
      const onboardingData = localStorage.getItem('onboardingData');
      const paymentComplete = localStorage.getItem('paymentComplete');

      if (!signupDataStr) {
        router.push('/login');
        return;
      }
      
      const signupData = JSON.parse(signupDataStr);
      if (signupData.email === 'admin@dymera.com') {
        setIsAdmin(true);
      }
      const { name, email } = signupData;
      const firstLetter = name.charAt(0).toUpperCase();

      if (!onboardingData) {
        router.push('/onboarding');
      } else if (!paymentComplete) {
        router.push('/payment');
      } else {
        setIsVerified(true);
        // Only generate avatar for non-admin users to avoid unnecessary calls
        if (signupData.email !== 'admin@dymera.com') {
            generateAvatar({ letter: firstLetter })
                .then(result => {
                    localStorage.setItem('userAvatar', result.imageUrl);
                    setAvatarUrl(result.imageUrl);
                    window.dispatchEvent(new Event('storage')); // Notify other components
                })
                .catch(err => {
                    console.error("Failed to generate avatar", err)
                    // Fallback to checking local storage if generation fails
                    const storedAvatar = localStorage.getItem('userAvatar');
                    if (storedAvatar) {
                        setAvatarUrl(storedAvatar);
                    }
                });
        }
      }
    }
  }, [router, toast]);

  if (!isVerified) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  if (isAdmin) {
    return (
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {children}
            <Toaster />
        </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar avatarUrl={avatarUrl} />
        <SidebarInset>
            <ConditionalSidebarTrigger />
            <div className="p-4 sm:p-6 lg:p-8 flex-1">
                {children}
            </div>
            <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
