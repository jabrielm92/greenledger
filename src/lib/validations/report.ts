import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(1, "Report title is required").max(200),
  frameworkType: z.string().min(1, "Framework is required"),
  reportingPeriodId: z.string().optional(),
  sections: z.array(z.string()).optional(),
});

export const updateReportSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: z.enum(["DRAFT", "GENERATING", "REVIEW", "APPROVED", "PUBLISHED"]).optional(),
  manualEdits: z.any().optional(),
  finalContent: z.any().optional(),
});

export const generateReportSchema = z.object({
  reportId: z.string().min(1),
  sections: z.array(z.string()).min(1, "Select at least one section"),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportInput = z.infer<typeof updateReportSchema>;
export type GenerateReportInput = z.infer<typeof generateReportSchema>;
