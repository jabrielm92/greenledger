import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters").max(100),
  employeeCount: z.string().min(1, "Please select employee count"),
  country: z.string().min(1, "Please select a country"),
  city: z.string().optional(),
  industry: z.string().min(1, "Please select an industry"),
  fiscalYearStart: z.number().min(1).max(12).default(1),
  website: z.string().url().optional().or(z.literal("")),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const frameworkSelectionSchema = z.object({
  frameworks: z.array(z.string()).min(1, "Please select at least one framework"),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type FrameworkSelectionInput = z.infer<typeof frameworkSelectionSchema>;
