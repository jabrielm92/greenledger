import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required").max(200),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactName: z.string().optional(),
  industry: z.enum([
    "MANUFACTURING", "LOGISTICS", "PROFESSIONAL_SERVICES", "CONSTRUCTION",
    "TECHNOLOGY", "RETAIL", "FOOD_BEVERAGE", "HEALTHCARE", "ENERGY",
    "AGRICULTURE", "OTHER",
  ]).optional(),
  country: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  esgRiskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL", "UNKNOWN"]).optional(),
  esgScore: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
