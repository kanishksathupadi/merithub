
import { LoginForm } from "@/components/auth/login-form";
import { AppLogo } from "@/components/logo";
import { MarketingHeader } from "@/components/layout/marketing-header";
import Link from "next/link";

export default function LoginPage() {
  return (
     <div className="flex min-h-screen flex-col">
        <MarketingHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
            <LoginForm />
        </main>
    </div>
  );
}
