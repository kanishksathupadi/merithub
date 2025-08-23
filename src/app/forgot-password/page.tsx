
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <header className="absolute top-0 left-0 w-full p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">PinnaclePath</h1>
        </Link>
      </header>
      <ForgotPasswordForm />
    </div>
  );
}
