"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  error?: string;
  documentId?: string;
}

interface UploadZoneProps {
  onUploadComplete?: (documentId: string) => void;
  className?: string;
}

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "text/csv": [".csv"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
};
const MAX_SIZE = 25 * 1024 * 1024;

export function UploadZone({ onUploadComplete, className }: UploadZoneProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const uploadFile = useCallback(
    async (uploadFile: UploadFile, index: number) => {
      setFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, status: "uploading" } : f))
      );

      try {
        const formData = new FormData();
        formData.append("file", uploadFile.file);

        const res = await fetch("/api/documents", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }

        const doc = await res.json();

        setFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? { ...f, status: "complete", progress: 100, documentId: doc.id }
              : f
          )
        );

        onUploadComplete?.(doc.id);
      } catch (err) {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? {
                  ...f,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : f
          )
        );
      }
    },
    [onUploadComplete]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "pending" as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Upload each file
      newFiles.forEach((f, i) => {
        const index = files.length + i;
        uploadFile(f, index);
      });
    },
    [files.length, uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragActive
            ? "border-emerald-500 bg-emerald-50"
            : "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50"
        )}
      >
        <input {...getInputProps()} />
        <Upload
          className={cn(
            "mx-auto h-10 w-10",
            isDragActive ? "text-emerald-500" : "text-slate-400"
          )}
        />
        <p className="mt-2 text-sm font-medium text-slate-700">
          {isDragActive
            ? "Drop files here..."
            : "Drag & drop files here, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          PDF, PNG, JPG, WEBP, CSV, XLSX — up to 25MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div
              key={`${f.file.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <FileText className="h-5 w-5 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{f.file.name}</p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(f.file.size)}
                </p>
                {f.status === "uploading" && (
                  <Progress value={50} className="mt-1 h-1" />
                )}
                {f.status === "error" && (
                  <p className="mt-0.5 text-xs text-red-500">{f.error}</p>
                )}
              </div>
              {f.status === "uploading" && (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              )}
              {f.status === "complete" && (
                <span className="text-xs font-medium text-emerald-600">
                  Done
                </span>
              )}
              {(f.status === "complete" || f.status === "error") && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeFile(i)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
