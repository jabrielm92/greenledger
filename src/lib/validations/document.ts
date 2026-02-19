import { z } from "zod";

export const uploadDocumentSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().max(25 * 1024 * 1024, "File size must be under 25MB"),
  documentType: z.enum([
    "UTILITY_BILL", "FUEL_RECEIPT", "INVOICE", "SUPPLIER_REPORT",
    "TRAVEL_RECORD", "WASTE_MANIFEST", "FLEET_LOG", "REFRIGERANT_LOG", "OTHER",
  ]).optional(),
});

export const updateDocumentSchema = z.object({
  documentType: z.enum([
    "UTILITY_BILL", "FUEL_RECEIPT", "INVOICE", "SUPPLIER_REPORT",
    "TRAVEL_RECORD", "WASTE_MANIFEST", "FLEET_LOG", "REFRIGERANT_LOG", "OTHER",
  ]).optional(),
  status: z.enum(["UPLOADED", "PROCESSING", "EXTRACTED", "REVIEWED", "FAILED"]).optional(),
  extractedData: z.any().optional(),
  extractionConfidence: z.number().min(0).max(1).optional(),
});

export const documentFilterSchema = z.object({
  documentType: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
});

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type DocumentFilterInput = z.infer<typeof documentFilterSchema>;
