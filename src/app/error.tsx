"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="max-w-md text-sm text-slate-600">
          An unexpected error occurred. Our team has been notified.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} className="bg-emerald-600 hover:bg-emerald-700">
          Try again
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go home
        </Button>
      </div>
    </div>
  );
}
