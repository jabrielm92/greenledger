"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ExtractionReview } from "@/components/documents/extraction-review";
import { AIAnalysis } from "@/components/documents/ai-analysis";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useDocument } from "@/hooks/use-documents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye, Trash2 } from "lucide-react";
import { formatFileSize, formatEnumValue } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { document, isLoading, refetch } = useDocument(params.id as string);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

  const handleConfirm = async (data: Record<string, unknown>, overrideType?: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/documents/${document.id}/create-emission`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            extractedData: data,
            ...(overrideType ? { documentType: overrideType } : {}),
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn("[CREATE_EMISSION]", err.error || "Failed");
        // Fall back to just saving the reviewed data
        await fetch(`/api/documents/${document.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "REVIEWED", extractedData: data }),
        });
        toast({
          title: "Data confirmed",
          description: err.error
            ? `Saved as reviewed. ${err.error}`
            : "Extracted data saved as reviewed.",
        });
      } else {
        const entry = await res.json();
        const co2eFormatted =
          entry.co2e >= 1000
            ? `${(entry.co2e / 1000).toFixed(2)} tCO2e`
            : `${Number(entry.co2e).toFixed(2)} kgCO2e`;
        toast({
          title: "Emission entry created",
          description: `${entry.scope?.replace("_", " ")} — ${entry.category}: ${co2eFormatted}. View it on the Emissions page.`,
        });
      }

      refetch();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
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
      toast({
        title: "Re-extraction started",
        description: "The document is being re-processed by AI.",
      });
      refetch();
    } catch {
      toast({
        variant: "destructive",
        title: "Re-extraction failed",
        description: "Could not start re-extraction. Please try again.",
      });
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
      toast({
        title: "Document rejected",
        description: "The document has been marked as rejected.",
      });
      router.push("/dashboard/documents");
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not reject document. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/documents/${document.id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Document deleted", description: "The document has been permanently removed." });
        router.push("/dashboard/documents");
      } else {
        toast({ variant: "destructive", title: "Delete failed", description: "Could not delete the document." });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const viewUrl = `/api/documents/${document.id}/file`;
  const isViewable = document.fileType.startsWith("image/") || document.fileType === "application/pdf";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/documents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <PageHeader title={document.fileName} />
        </div>
        <div className="flex items-center gap-2">
          {isViewable && (
            <Button variant="outline" size="sm" asChild>
              <a href={viewUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                View
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <a href={viewUrl} download={document.fileName}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Download
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
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

          {/* Document preview */}
          {isViewable && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Document Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {document.fileType.startsWith("image/") ? (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={viewUrl}
                      alt={document.fileName}
                      className="mx-auto max-h-[500px] w-auto object-contain"
                    />
                  </div>
                ) : document.fileType === "application/pdf" ? (
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <iframe
                      src={viewUrl}
                      title={document.fileName}
                      className="h-[500px] w-full"
                    />
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>

        {document.extractedData && (
          <div className="space-y-6">
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
            {document.aiAnalysis && (
              <AIAnalysis
                analysis={
                  document.aiAnalysis as {
                    summary: string;
                    esgRelevance: {
                      frameworks: string[];
                      scope: string | null;
                      category: string | null;
                      relevanceLevel: "high" | "medium" | "low";
                      explanation: string;
                    };
                    metricsBreakdown: {
                      metric: string;
                      value: string;
                      unit: string | null;
                      calculationMethod: string;
                    }[];
                    recommendations: string[];
                  }
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
