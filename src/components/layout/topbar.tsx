"use client";

import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Languages, LogOut, Settings, User } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { NotificationBell } from "./notification-bell";
import Link from "next/link";
import { SUPPORTED_LOCALES } from "@/types";

export function Topbar() {
  const { user, updateSession } = useCurrentUser();

  const handleLocaleChange = async (newLocale: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: newLocale }),
      });
      if (res.ok) {
        await updateSession({ locale: newLocale });
      }
    } catch (err) {
      console.error("Failed to update locale:", err);
    }
  };

  const currentLocale = SUPPORTED_LOCALES.find((l) => l.code === user?.locale) || SUPPORTED_LOCALES[0];

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <MobileNav />
        <h2 className="text-lg font-semibold text-slate-900 lg:hidden">
          GreenLedger
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Language quick-switch */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" title="Language">
              <Languages className="h-5 w-5 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {SUPPORTED_LOCALES.map((loc) => (
              <DropdownMenuItem
                key={loc.code}
                onClick={() => handleLocaleChange(loc.code)}
                className={loc.code === currentLocale.code ? "bg-emerald-50 text-emerald-700" : ""}
              >
                {loc.nativeLabel} ({loc.label})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full bg-emerald-50 p-0 hover:bg-emerald-100"
            >
              <Globe className="h-5 w-5 text-emerald-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
