"use client";

import { DocumentCard } from "./document-card";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: string | null;
  status: string;
  extractionConfidence: number | null;
  createdAt: string | Date;
  uploadedBy?: { name: string | null; email: string };
}

interface DocumentListProps {
  documents: Document[];
  isLoading?: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function DocumentList({
  documents,
  isLoading,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
}: DocumentListProps) {
  if (isLoading) {
    return (
      <LoadingSpinner className="py-12" text="Loading documents..." />
    );
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents yet"
        description="Upload utility bills, fuel receipts, or invoices to get started with AI-powered data extraction."
      />
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
