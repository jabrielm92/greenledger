import { FileText, FileImage, FileSpreadsheet, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileIconProps {
  fileType: string;
  className?: string;
}

export function FileIcon({ fileType, className }: FileIconProps) {
  const type = fileType.toLowerCase();

  if (type.includes("pdf")) {
    return <FileText className={cn("text-red-500", className)} />;
  }
  if (type.includes("image") || type.includes("png") || type.includes("jpg") || type.includes("jpeg") || type.includes("webp")) {
    return <FileImage className={cn("text-blue-500", className)} />;
  }
  if (type.includes("csv") || type.includes("xlsx") || type.includes("spreadsheet")) {
    return <FileSpreadsheet className={cn("text-green-500", className)} />;
  }
  return <File className={cn("text-slate-500", className)} />;
}
