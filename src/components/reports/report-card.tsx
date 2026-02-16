import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatEnumValue } from "@/lib/utils";
import { format } from "date-fns";
import { FileText, Calendar } from "lucide-react";

interface ReportCardProps {
  report: {
    id: string;
    title: string;
    frameworkType: string;
    status: string;
    version: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    reportingPeriod?: { name: string } | null;
  };
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  GENERATING: "bg-amber-100 text-amber-700",
  REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  PUBLISHED: "bg-purple-100 text-purple-700",
};

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Link href={`/dashboard/reports/${report.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">{report.title}</CardTitle>
            </div>
            <Badge
              variant="secondary"
              className={STATUS_STYLES[report.status] || ""}
            >
              {formatEnumValue(report.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="rounded bg-slate-100 px-1.5 py-0.5">
              {report.frameworkType}
            </span>
            {report.reportingPeriod && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {report.reportingPeriod.name}
              </span>
            )}
            <span>v{report.version}</span>
            <span>
              Updated {format(new Date(report.updatedAt), "MMM d, yyyy")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
