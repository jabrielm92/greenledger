import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "./risk-badge";
import { formatEnumValue } from "@/lib/utils";
import { format } from "date-fns";
import { Building2, Globe, Mail } from "lucide-react";

interface SupplierCardProps {
  supplier: {
    id: string;
    name: string;
    industry?: string | null;
    country?: string | null;
    contactEmail?: string | null;
    contactName?: string | null;
    esgRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN";
    esgScore?: number | null;
    lastAssessment?: string | Date | null;
  };
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <Link href={`/dashboard/suppliers/${supplier.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-sm">{supplier.name}</CardTitle>
            <RiskBadge level={supplier.esgRiskLevel} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-xs text-slate-500">
            {supplier.industry && (
              <p className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {formatEnumValue(supplier.industry)}
              </p>
            )}
            {supplier.country && (
              <p className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {supplier.country}
              </p>
            )}
            {supplier.contactEmail && (
              <p className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {supplier.contactEmail}
              </p>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between">
            {supplier.esgScore != null ? (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${supplier.esgScore}%` }}
                  />
                </div>
                <span className="text-xs font-medium">
                  {supplier.esgScore}/100
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-slate-400">No score</span>
            )}
            {supplier.lastAssessment && (
              <span className="text-[10px] text-slate-400">
                Assessed{" "}
                {format(new Date(supplier.lastAssessment), "MMM yyyy")}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
