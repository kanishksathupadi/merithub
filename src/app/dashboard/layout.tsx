
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
    // This runs only once on component mount.
    // We check the user's status and immediately decide where they should be.
    const signupDataStr = localStorage.getItem('signupData');
    if (!signupDataStr) {
      router.replace('/login'); // Use replace to avoid polluting browser history
      return;
    }

    const signupData = JSON.parse(signupDataStr);
    const onboardingData = localStorage.getItem('onboardingData');
    const paymentComplete = localStorage.getItem('paymentComplete');

    if (signupData.email === 'admin@dymera.com') {
      setIsAdmin(true);
    }

    if (!onboardingData) {
      router.replace('/onboarding');
    } else if (!paymentComplete) {
      router.replace('/payment');
    } else {
      // The user is fully verified, allow rendering and handle avatar in parallel.
      setIsVerified(true);
      
      const firstLetter = signupData.name?.charAt(0).toUpperCase();
      const storedAvatar = localStorage.getItem('userAvatar');

      if (storedAvatar) {
        setAvatarUrl(storedAvatar);
      } else if (signupData.email !== 'admin@dymera.com' && firstLetter) {
        // Generate avatar in the background without blocking UI
        generateAvatar({ letter: firstLetter })
          .then(result => {
              localStorage.setItem('userAvatar', result.imageUrl);
              setAvatarUrl(result.imageUrl);
              window.dispatchEvent(new Event('storage')); // Notify other components
          })
          .catch(err => {
              console.error("Failed to generate avatar", err);
          });
      }
    }
  }, [router]);

  if (!isVerified) {
    // This loading state is now shown for a much shorter time, often imperceptibly.
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
