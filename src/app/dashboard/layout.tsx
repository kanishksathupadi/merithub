
"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const signupData = localStorage.getItem('signupData');
      const onboardingData = localStorage.getItem('onboardingData');
      const paymentComplete = localStorage.getItem('paymentComplete');

      if (!signupData) {
        router.push('/login');
      } else if (!onboardingData) {
        router.push('/onboarding');
      } else if (!paymentComplete) {
        router.push('/payment');
      } else {
        setIsVerified(true);
      }
    }
  }, [router]);

  if (!isVerified) {
    // You can return a loader here while verification is in progress
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
        </div>
    );
  }


  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset>
            <header className="p-4 sm:p-6 lg:p-8 flex items-center gap-4 border-b">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold">Dashboard</h1>
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
