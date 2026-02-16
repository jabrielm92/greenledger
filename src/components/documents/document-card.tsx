"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileIcon } from "@/components/shared/file-icon";
import { formatFileSize, formatEnumValue } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface DocumentCardProps {
  document: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    documentType: string | null;
    status: string;
    extractionConfidence: number | null;
    createdAt: string | Date;
    uploadedBy?: { name: string | null; email: string };
  };
}

function statusVariant(status: string) {
  switch (status) {
    case "UPLOADED":
      return "secondary";
    case "PROCESSING":
      return "outline";
    case "EXTRACTED":
      return "default";
    case "REVIEWED":
      return "default";
    case "FAILED":
      return "destructive";
    default:
      return "secondary";
  }
}

function statusColor(status: string) {
  switch (status) {
    case "EXTRACTED":
      return "bg-blue-100 text-blue-700";
    case "REVIEWED":
      return "bg-emerald-100 text-emerald-700";
    case "PROCESSING":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "";
  }
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Link href={`/dashboard/documents/${document.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-4">
          <FileIcon fileType={document.fileType} className="h-8 w-8" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{document.fileName}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <span>{formatFileSize(document.fileSize)}</span>
              <span>&middot;</span>
              <span>
                {formatDistanceToNow(new Date(document.createdAt), {
                  addSuffix: true,
                })}
              </span>
              {document.uploadedBy && (
                <>
                  <span>&middot;</span>
                  <span>{document.uploadedBy.name || document.uploadedBy.email}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {document.documentType && (
              <Badge variant="outline" className="text-xs">
                {formatEnumValue(document.documentType)}
              </Badge>
            )}
            <Badge
              variant={statusVariant(document.status) as never}
              className={statusColor(document.status)}
            >
              {formatEnumValue(document.status)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
