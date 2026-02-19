// Re-export all types from sub-files
export * from "./emissions";
export * from "./documents";
export * from "./reports";
export * from "./quickbooks";

// Common API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Session user type (from NextAuth JWT)
export interface SessionUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  organizationId?: string | null;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  plan: "FREE_TRIAL" | "BASE" | "PROFESSIONAL" | "ENTERPRISE";
}

// Dashboard stats type
export interface DashboardStats {
  totalScope1: number;
  totalScope2: number;
  totalEmissions: number;
  complianceScore: number;
  documentsCount: number;
  reportsCount: number;
  suppliersCount: number;
  pendingReviews: number;
}

// Onboarding state
export interface OnboardingState {
  step: number;
  companyName: string;
  employeeCount: string;
  country: string;
  city: string;
  industry: string;
  fiscalYearStart: number;
  selectedFrameworks: string[];
  quickbooksConnected: boolean;
}

// Audit log display type
export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userName?: string;
  userEmail?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
