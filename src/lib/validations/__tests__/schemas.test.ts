import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from "../auth";
import { createEmissionEntrySchema, emissionsFilterSchema, calculateEmissionsSchema } from "../emissions";
import { uploadDocumentSchema, documentFilterSchema } from "../document";
import { createSupplierSchema } from "../supplier";
import { createReportSchema, generateReportSchema } from "../report";
import { createOrganizationSchema, frameworkSelectionSchema } from "../organization";

// ============================================
// AUTH SCHEMAS
// ============================================

describe("auth schemas", () => {
  describe("loginSchema", () => {
    it("accepts valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("accepts valid registration data", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "Password1",
        confirmPassword: "Password1",
      });
      expect(result.success).toBe(true);
    });

    it("rejects short name", () => {
      const result = registerSchema.safeParse({
        name: "J",
        email: "john@example.com",
        password: "Password1",
        confirmPassword: "Password1",
      });
      expect(result.success).toBe(false);
    });

    it("rejects password without uppercase", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "password1",
        confirmPassword: "password1",
      });
      expect(result.success).toBe(false);
    });

    it("rejects password without number", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "Password",
        confirmPassword: "Password",
      });
      expect(result.success).toBe(false);
    });

    it("rejects mismatched passwords", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "Password1",
        confirmPassword: "Password2",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short password", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "Pass1",
        confirmPassword: "Pass1",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("forgotPasswordSchema", () => {
    it("accepts valid email", () => {
      expect(forgotPasswordSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
    });

    it("rejects invalid email", () => {
      expect(forgotPasswordSchema.safeParse({ email: "bad" }).success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("rejects short password (< 8 chars)", () => {
      const result = resetPasswordSchema.safeParse({
        password: "Pass1",
        confirmPassword: "Pass1",
      });
      expect(result.success).toBe(false);
    });

    it("accepts 8+ char password with uppercase and number", () => {
      const result = resetPasswordSchema.safeParse({
        password: "NewPass12",
        confirmPassword: "NewPass12",
      });
      expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const result = resetPasswordSchema.safeParse({
        password: "NewPass12",
        confirmPassword: "NewPass13",
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================
// EMISSIONS SCHEMAS
// ============================================

describe("emissions schemas", () => {
  describe("createEmissionEntrySchema", () => {
    const validEntry = {
      scope: "SCOPE_1" as const,
      category: "electricity",
      source: "Grid electricity",
      activityValue: 1000,
      activityUnit: "kWh",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
    };

    it("accepts valid entry", () => {
      expect(createEmissionEntrySchema.safeParse(validEntry).success).toBe(true);
    });

    it("rejects invalid scope", () => {
      expect(
        createEmissionEntrySchema.safeParse({ ...validEntry, scope: "SCOPE_4" }).success
      ).toBe(false);
    });

    it("rejects zero activity value", () => {
      expect(
        createEmissionEntrySchema.safeParse({ ...validEntry, activityValue: 0 }).success
      ).toBe(false);
    });

    it("rejects negative activity value", () => {
      expect(
        createEmissionEntrySchema.safeParse({ ...validEntry, activityValue: -10 }).success
      ).toBe(false);
    });

    it("rejects empty category", () => {
      expect(
        createEmissionEntrySchema.safeParse({ ...validEntry, category: "" }).success
      ).toBe(false);
    });

    it("accepts optional fields", () => {
      const result = createEmissionEntrySchema.safeParse({
        ...validEntry,
        subcategory: "grid",
        description: "Monthly usage",
        location: "Office",
        notes: "Estimated",
        documentId: "doc_123",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("calculateEmissionsSchema", () => {
    it("accepts valid calculation input", () => {
      const result = calculateEmissionsSchema.safeParse({
        activityValue: 100,
        activityUnit: "kWh",
        category: "electricity",
        region: "US",
        year: 2025,
      });
      expect(result.success).toBe(true);
    });

    it("rejects year below 2020", () => {
      const result = calculateEmissionsSchema.safeParse({
        activityValue: 100,
        activityUnit: "kWh",
        category: "electricity",
        region: "US",
        year: 2019,
      });
      expect(result.success).toBe(false);
    });

    it("rejects year above 2030", () => {
      const result = calculateEmissionsSchema.safeParse({
        activityValue: 100,
        activityUnit: "kWh",
        category: "electricity",
        region: "US",
        year: 2031,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("emissionsFilterSchema", () => {
    it("applies defaults for page and pageSize", () => {
      const result = emissionsFilterSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
    });

    it("rejects pageSize > 100", () => {
      const result = emissionsFilterSchema.safeParse({ pageSize: 101 });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================
// DOCUMENT SCHEMAS
// ============================================

describe("document schemas", () => {
  describe("uploadDocumentSchema", () => {
    it("accepts valid upload", () => {
      const result = uploadDocumentSchema.safeParse({
        fileName: "bill.pdf",
        fileType: "application/pdf",
        fileSize: 1024,
      });
      expect(result.success).toBe(true);
    });

    it("rejects oversized file", () => {
      const result = uploadDocumentSchema.safeParse({
        fileName: "big.pdf",
        fileType: "application/pdf",
        fileSize: 26 * 1024 * 1024,
      });
      expect(result.success).toBe(false);
    });

    it("accepts optional documentType", () => {
      const result = uploadDocumentSchema.safeParse({
        fileName: "bill.pdf",
        fileType: "application/pdf",
        fileSize: 1024,
        documentType: "UTILITY_BILL",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid documentType", () => {
      const result = uploadDocumentSchema.safeParse({
        fileName: "bill.pdf",
        fileType: "application/pdf",
        fileSize: 1024,
        documentType: "INVALID_TYPE",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("documentFilterSchema", () => {
    it("applies defaults", () => {
      const result = documentFilterSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
    });
  });
});

// ============================================
// SUPPLIER SCHEMAS
// ============================================

describe("supplier schemas", () => {
  describe("createSupplierSchema", () => {
    it("accepts valid supplier", () => {
      const result = createSupplierSchema.safeParse({
        name: "ACME Corp",
        contactEmail: "contact@acme.com",
        industry: "MANUFACTURING",
        country: "US",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty name", () => {
      const result = createSupplierSchema.safeParse({ name: "" });
      expect(result.success).toBe(false);
    });

    it("rejects name over 200 chars", () => {
      const result = createSupplierSchema.safeParse({ name: "A".repeat(201) });
      expect(result.success).toBe(false);
    });

    it("accepts empty string for optional email", () => {
      const result = createSupplierSchema.safeParse({
        name: "ACME Corp",
        contactEmail: "",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email format", () => {
      const result = createSupplierSchema.safeParse({
        name: "ACME Corp",
        contactEmail: "not-email",
      });
      expect(result.success).toBe(false);
    });

    it("accepts valid risk level", () => {
      const result = createSupplierSchema.safeParse({
        name: "ACME Corp",
        esgRiskLevel: "HIGH",
      });
      expect(result.success).toBe(true);
    });

    it("accepts esgScore within 0-100 range", () => {
      const result = createSupplierSchema.safeParse({
        name: "ACME Corp",
        esgScore: 75,
      });
      expect(result.success).toBe(true);
    });

    it("rejects esgScore over 100", () => {
      const result = createSupplierSchema.safeParse({
        name: "ACME Corp",
        esgScore: 101,
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================
// REPORT SCHEMAS
// ============================================

describe("report schemas", () => {
  describe("createReportSchema", () => {
    it("accepts valid report", () => {
      const result = createReportSchema.safeParse({
        title: "Q4 2025 CSRD Report",
        frameworkType: "CSRD",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty title", () => {
      const result = createReportSchema.safeParse({
        title: "",
        frameworkType: "CSRD",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("generateReportSchema", () => {
    it("accepts valid generation request", () => {
      const result = generateReportSchema.safeParse({
        reportId: "rpt_123",
        sections: ["E1-1", "E1-6"],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty sections array", () => {
      const result = generateReportSchema.safeParse({
        reportId: "rpt_123",
        sections: [],
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================
// ORGANIZATION SCHEMAS
// ============================================

describe("organization schemas", () => {
  describe("createOrganizationSchema", () => {
    it("accepts valid organization", () => {
      const result = createOrganizationSchema.safeParse({
        name: "ACME Inc",
        employeeCount: "51-100",
        country: "US",
        industry: "TECHNOLOGY",
      });
      expect(result.success).toBe(true);
    });

    it("rejects short name", () => {
      const result = createOrganizationSchema.safeParse({
        name: "A",
        employeeCount: "51-100",
        country: "US",
        industry: "TECHNOLOGY",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing industry", () => {
      const result = createOrganizationSchema.safeParse({
        name: "ACME Inc",
        employeeCount: "51-100",
        country: "US",
        industry: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("frameworkSelectionSchema", () => {
    it("accepts non-empty array", () => {
      const result = frameworkSelectionSchema.safeParse({
        frameworks: ["CSRD", "GRI"],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty array", () => {
      const result = frameworkSelectionSchema.safeParse({
        frameworks: [],
      });
      expect(result.success).toBe(false);
    });
  });
});
