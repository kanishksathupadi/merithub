
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

export default function SettingsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();


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
  
  const handleDeleteAccount = async () => {
    const userDataStr = localStorage.getItem('signupData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      const userId = userData.userId;

      try {
        // Remove user from the master list in localStorage
        const allUsersStr = localStorage.getItem('allSignups');
        if (allUsersStr) {
            let allUsers = JSON.parse(allUsersStr);
            allUsers = allUsers.filter((u: any) => u.userId !== userId);
            localStorage.setItem('allSignups', JSON.stringify(allUsers));
        }
        
        // Clear session data
        Object.keys(localStorage).forEach(key => {
            if(['signupData', 'onboardingData', 'userAvatar', 'userName', 'userPlan', 'hasBeenWelcomed'].includes(key)) {
                localStorage.removeItem(key);
            }
        });

        toast({
          title: "Account Deleted",
          description: "Your account and all associated data have been removed from this browser.",
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
                            This action is permanent and cannot be undone. This will permanently delete your account and remove all of your data from this browser.
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
