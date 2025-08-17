
"use client";

import { generateAvatar } from "@/ai/flows/generate-avatar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ConditionalSidebarTrigger() {
    const { open, isMobile } = useSidebar();
    if (open || isMobile) return null;
    return (
        <div className="p-2">
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const signupData = localStorage.getItem('signupData');
      const onboardingData = localStorage.getItem('onboardingData');
      const paymentComplete = localStorage.getItem('paymentComplete');

      if (!signupData) {
        router.push('/login');
        return;
      }
      
      const { name } = JSON.parse(signupData);
      const firstLetter = name.charAt(0).toUpperCase();

      if (!onboardingData) {
        router.push('/onboarding');
      } else if (!paymentComplete) {
        router.push('/payment');
      } else {
        setIsVerified(true);
        const storedAvatar = localStorage.getItem('userAvatar');
        if (storedAvatar) {
            setAvatarUrl(storedAvatar);
        } else {
            generateAvatar({ letter: firstLetter })
                .then(result => {
                    localStorage.setItem('userAvatar', result.imageUrl);
                    setAvatarUrl(result.imageUrl);
                    window.dispatchEvent(new Event('storage')); // Notify other components
                })
                .catch(err => console.error("Failed to generate avatar", err));
        }
      }
    }
  }, [router]);

  if (!isVerified) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
        </div>
    );
  }


  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar avatarUrl={avatarUrl} />
        <SidebarInset>
            <header className="p-4 sm:p-6 lg:p-8 flex items-center gap-4 border-b">
                <ConditionalSidebarTrigger />
            </header>
          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {children}
          </div>
          <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
