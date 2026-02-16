import type { Metadata } from "next";
import Link from "next/link";
import { Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b bg-white px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-bold text-slate-900">GreenLedger</span>
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
