"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { UploadZone } from "@/components/documents/upload-zone";
import { DocumentList } from "@/components/documents/document-list";
import { useDocuments } from "@/hooks/use-documents";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";

export default function DocumentsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showUpload, setShowUpload] = useState(false);

  const { documents, totalPages, isLoading, refetch } = useDocuments({
    page,
    status: statusFilter || undefined,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Upload and manage documents for AI-powered data extraction"
      >
        <Button
          onClick={() => setShowUpload(!showUpload)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </PageHeader>

      {showUpload && (
        <UploadZone
          onUploadComplete={() => {
            refetch();
          }}
        />
      )}

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="UPLOADED">Uploaded</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="EXTRACTED">Extracted</SelectItem>
            <SelectItem value="REVIEWED">Reviewed</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DocumentList
        documents={documents}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}
