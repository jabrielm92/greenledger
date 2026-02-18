import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <FileQuestion className="h-8 w-8 text-slate-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">404</h1>
        <h2 className="text-xl font-semibold text-slate-700">Page not found</h2>
        <p className="max-w-md text-sm text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/dashboard">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Go to Dashboard
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Go home</Button>
        </Link>
      </div>
    </div>
  );
}
