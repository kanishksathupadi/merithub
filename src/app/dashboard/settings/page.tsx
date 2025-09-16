
"use client";

import { SettingsForm } from "@/components/dashboard/settings-form";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { updateUser } from "@/lib/data-client";

export default function SettingsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();


  useEffect(() => {
    if (typeof window !== 'undefined') {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            if(userData.email === 'admin@dymera.com') {
                setIsAdmin(true);
            }
        }
    }
    setLoading(false);
  }, []);
  
  const handleDeleteAccount = async () => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      const userId = userData.userId;

      try {
        // In a real app, this would be a "soft delete" or a more complex process.
        // For this prototype, we'll just mark the user as inactive or remove.
        // Let's assume we just clear their data from the client side for this prototype.
        await updateUser(userId, { name: "Deleted User", email: `deleted-${userId}@example.com`, tasks: [], onboardingData: null, suggestion: null });

        sessionStorage.clear();
        
        toast({
          title: "Account Deleted",
          description: "Your account and all associated data have been removed.",
        });

        router.push('/');
      } catch (error) {
        console.error("Failed to delete account:", error);
        toast({
            variant: 'destructive',
            title: "Error",
            description: "Failed to delete your account. Please try again.",
        });
      }
    }
  };


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
        
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>This is a permanent action and cannot be undone.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between items-center">
             <p className="text-sm text-muted-foreground">Delete your account and all of your data.</p>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is permanent and cannot be undone. This will permanently delete your account and remove all of your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete my account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
        
        <Toaster />
    </div>
  );
}

    