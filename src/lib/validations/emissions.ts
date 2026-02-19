import { z } from "zod";

export const createEmissionEntrySchema = z.object({
  scope: z.enum(["SCOPE_1", "SCOPE_2", "SCOPE_3"]),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  source: z.string().min(1, "Source description is required"),
  description: z.string().optional(),
  activityValue: z.number().positive("Activity value must be positive"),
  activityUnit: z.string().min(1, "Unit is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().optional(),
  notes: z.string().optional(),
  documentId: z.string().optional(),
  reportingPeriodId: z.string().optional(),
});

export const updateEmissionEntrySchema = createEmissionEntrySchema.partial();

export const emissionsFilterSchema = z.object({
  scope: z.enum(["SCOPE_1", "SCOPE_2", "SCOPE_3"]).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  reportingPeriodId: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
});

export const calculateEmissionsSchema = z.object({
  activityValue: z.number().positive(),
  activityUnit: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  region: z.string().min(1),
  year: z.number().min(2020).max(2030),
  customFactorId: z.string().optional(),
});

export type CreateEmissionEntryInput = z.infer<typeof createEmissionEntrySchema>;
export type UpdateEmissionEntryInput = z.infer<typeof updateEmissionEntrySchema>;
export type EmissionsFilterInput = z.infer<typeof emissionsFilterSchema>;
export type CalculateEmissionsInput = z.infer<typeof calculateEmissionsSchema>;
