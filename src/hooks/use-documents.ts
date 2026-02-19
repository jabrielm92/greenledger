"use client";

import { useCallback, useEffect, useState } from "react";

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: string | null;
  status: string;
  extractedData: Record<string, unknown> | null;
  extractionConfidence: number | null;
  processingError: string | null;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: { name: string | null; email: string };
}

interface UseDocumentsOptions {
  page?: number;
  pageSize?: number;
  documentType?: string;
  status?: string;
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const { page = 1, pageSize = 20, documentType, status } = options;
  const [documents, setDocuments] = useState<Document[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (documentType) params.set("documentType", documentType);
      if (status) params.set("status", status);

      const res = await fetch(`/api/documents?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, documentType, status]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    total,
    totalPages,
    isLoading,
    refetch: fetchDocuments,
  };
}

export function useDocument(id: string) {
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocument = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDocument(data);
      }
    } catch (err) {
      console.error("Failed to fetch document:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  return {
    document,
    isLoading,
    refetch: fetchDocument,
  };
}
