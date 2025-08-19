
"use client";

import { SignupForm } from "@/components/auth/signup-form";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Suspense } from "react";

function SignupContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'standard'; // Default to standard if no plan is specified

  return <SignupForm plan={plan as 'standard' | 'elite'} />;
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <header className="absolute top-0 left-0 w-full p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Dymera</h1>
        </Link>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <SignupContent />
      </Suspense>
    </div>
  );
}
