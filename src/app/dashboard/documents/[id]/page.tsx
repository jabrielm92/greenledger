"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ExtractionReview } from "@/components/documents/extraction-review";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useDocument } from "@/hooks/use-documents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatFileSize, formatEnumValue } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { document, isLoading, refetch } = useDocument(params.id as string);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return <LoadingSpinner className="py-20" text="Loading document..." />;
  }

  if (!document) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Document not found</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/dashboard/documents">Back to documents</Link>
        </Button>
      </div>
    );
  }

  const handleConfirm = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "REVIEWED",
          extractedData: data,
        }),
      });
      refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReExtract = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/documents/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: document.id }),
      });
      refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "FAILED" }),
      });
      router.push("/dashboard/documents");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/documents">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={document.fileName} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Document Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Status</span>
              <Badge variant="secondary">
                {formatEnumValue(document.status)}
              </Badge>
            </div>
            {document.documentType && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Type</span>
                <span className="text-sm">
                  {formatEnumValue(document.documentType)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Size</span>
              <span className="text-sm">
                {formatFileSize(document.fileSize)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Uploaded</span>
              <span className="text-sm">
                {format(new Date(document.createdAt), "PPp")}
              </span>
            </div>
            {document.uploadedBy && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Uploaded by</span>
                <span className="text-sm">
                  {document.uploadedBy.name || document.uploadedBy.email}
                </span>
              </div>
            )}
            {document.extractionConfidence != null && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">AI Confidence</span>
                <span className="text-sm">
                  {Math.round(document.extractionConfidence * 100)}%
                </span>
              </div>
            )}
            {document.processingError && (
              <div className="rounded-lg bg-red-50 p-3">
                <p className="text-xs font-medium text-red-700">Error</p>
                <p className="mt-1 text-sm text-red-600">
                  {document.processingError}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {(document.status === "EXTRACTED" ||
          document.status === "REVIEWED") && (
          <ExtractionReview
            documentId={document.id}
            documentType={document.documentType}
            extractedData={
              document.extractedData as Record<string, unknown> | null
            }
            confidence={document.extractionConfidence}
            onConfirm={handleConfirm}
            onReExtract={handleReExtract}
            onReject={handleReject}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
