"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "./admin-sidebar";

export function AdminTopbar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold text-slate-900">Admin Portal</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">
          {session?.user?.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}
