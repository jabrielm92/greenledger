"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CreditCard,
  Bell,
  Link2,
  Users,
  Shield,
  Download,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsNav = [
  { href: "/dashboard/settings", label: "General", icon: Building2, exact: true },
  { href: "/dashboard/settings/profile", label: "Profile", icon: User, exact: false },
  { href: "/dashboard/settings/team", label: "Team", icon: Users, exact: false },
  { href: "/dashboard/settings/billing", label: "Billing", icon: CreditCard, exact: false },
  { href: "/dashboard/settings/integrations", label: "Integrations", icon: Link2, exact: false },
  { href: "/dashboard/settings/notifications", label: "Notifications", icon: Bell, exact: false },
  { href: "/dashboard/settings/security", label: "Security & API", icon: Shield, exact: false },
  { href: "/dashboard/settings/data-export", label: "Data Export", icon: Download, exact: false },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your organization, team, and preferences
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Settings sidebar */}
        <nav className="w-full shrink-0 lg:w-56">
          <div className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Settings content */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
