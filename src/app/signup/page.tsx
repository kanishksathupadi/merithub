
"use client";

import { SignupForm } from "@/components/auth/signup-form";
import { AppLogo } from "@/components/logo";
import Link from "next/link";
import { Suspense } from "react";
import { MarketingHeader } from "@/components/layout/marketing-header";

function SignupContent() {
  return <SignupForm />;
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
       <MarketingHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <SignupContent />
            </Suspense>
        </main>
    </div>
  );
}
