"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

        <div className="border-t p-4">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3">
            <Shield className="h-5 w-5 text-emerald-600" />
            <div className="text-xs">
              <p className="font-medium text-emerald-700">Free Trial</p>
              <p className="text-emerald-600">14 days remaining</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
