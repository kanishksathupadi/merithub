
"use client";

import { SettingsForm } from "@/components/dashboard/settings-form";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SettingsPage() {
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

  return (
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
}
