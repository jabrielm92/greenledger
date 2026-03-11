"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/shared/file-icon";
import { formatFileSize, formatEnumValue } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";

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
  onDelete?: (id: string) => void;
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

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/documents/${document.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onDelete?.(document.id);
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="group relative">
      <Link href={`/dashboard/documents/${document.id}`}>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 sm:items-center sm:gap-4">
              <FileIcon fileType={document.fileType} className="h-8 w-8 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{document.fileName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                  <span>{formatFileSize(document.fileSize)}</span>
                  <span>&middot;</span>
                  <span>
                    {formatDistanceToNow(new Date(document.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {document.uploadedBy && (
                    <>
                      <span className="hidden sm:inline">&middot;</span>
                      <span className="hidden sm:inline">{document.uploadedBy.name || document.uploadedBy.email}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
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
            </div>
          </CardContent>
        </Card>
      </Link>
      <Button
        variant={confirmDelete ? "destructive" : "ghost"}
        size="icon"
        className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={handleDelete}
        disabled={isDeleting}
        title={confirmDelete ? "Click again to confirm" : "Delete document"}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
