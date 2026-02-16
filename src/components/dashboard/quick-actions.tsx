"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, BarChart3, FileText, UserPlus } from "lucide-react";

const actions = [
  {
    href: "/dashboard/documents",
    label: "Upload a Document",
    description: "Upload utility bills, receipts, or invoices",
    icon: Upload,
    color: "bg-blue-100 text-blue-600",
  },
  {
    href: "/dashboard/emissions",
    label: "Add Emissions Data",
    description: "Record Scope 1 & 2 emissions entries",
    icon: BarChart3,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    href: "/dashboard/reports/new",
    label: "Generate Report",
    description: "Create a CSRD or GRI compliance report",
    icon: FileText,
    color: "bg-purple-100 text-purple-600",
  },
  {
    href: "/dashboard/settings/team",
    label: "Invite Team Member",
    description: "Add colleagues to your workspace",
    icon: UserPlus,
    color: "bg-orange-100 text-orange-600",
  },
];

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-slate-50"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${action.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
