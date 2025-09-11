
"use client";

import { SignupForm } from "@/components/auth/signup-form";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function SignupContent() {
  return <SignupForm />;
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <header className="absolute top-0 left-0 w-full p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">AI School Mentor</h1>
        </Link>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <SignupContent />
      </Suspense>
    </div>
  );
}
