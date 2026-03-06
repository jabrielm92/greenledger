"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  BarChart3,
  FileText,
  Home,
  Leaf,
  Settings,
  Upload,
  Users,
  ClipboardList,
  Shield,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/emissions", label: "Emissions", icon: BarChart3 },
  { href: "/dashboard/documents", label: "Documents", icon: Upload },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/suppliers", label: "Suppliers", icon: Users },
  { href: "/dashboard/audit-log", label: "Audit Log", icon: ClipboardList },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function TrialBadge() {
  const { user } = useCurrentUser();

  if (!user || user.plan !== "FREE_TRIAL") return null;

  const trialEndsAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null;

  let daysRemaining = 14;
  if (trialEndsAt) {
    daysRemaining = Math.max(
      0,
      Math.ceil((trialEndsAt.getTime() - Date.now()) / 86400000)
    );
  }

  const expired = daysRemaining <= 0;
  const urgent = daysRemaining <= 3 && !expired;

  const bgColor = expired
    ? "bg-red-50"
    : urgent
      ? "bg-amber-50"
      : "bg-emerald-50";
  const textColor = expired
    ? "text-red-700"
    : urgent
      ? "text-amber-700"
      : "text-emerald-700";
  const subColor = expired
    ? "text-red-600"
    : urgent
      ? "text-amber-600"
      : "text-emerald-600";
  const IconComponent = expired ? Shield : urgent ? Shield : Shield;

  return (
    <div className="border-t p-4">
      <Link href="/dashboard/settings/billing">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg p-3 transition-colors hover:opacity-80",
            bgColor
          )}
        >
          <IconComponent className={cn("h-5 w-5 shrink-0", textColor)} />
          <div className="min-w-0 text-xs">
            <p className={cn("font-medium", textColor)}>
              {expired ? "Trial Expired" : "Free Trial"}
            </p>
            <p className={subColor}>
              {expired
                ? "Upgrade to continue"
                : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`}
            </p>
          </div>
          <Sparkles className={cn("ml-auto h-4 w-4 shrink-0", subColor)} />
        </div>
      </Link>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Leaf className="h-6 w-6 text-emerald-600" />
          <span className="text-lg font-bold text-slate-900">GreenLedger</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <TrialBadge />
      </div>
    </aside>
  );
}
