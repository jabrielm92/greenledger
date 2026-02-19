import type { Metadata } from "next";
import Link from "next/link";
import { Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Leaf className="h-8 w-8 text-emerald-600" />
        <span className="text-2xl font-bold text-slate-900">GreenLedger</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} GreenLedger. All rights reserved.
      </p>
    </div>
  );
}
