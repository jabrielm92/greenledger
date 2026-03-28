import { describe, it, expect } from "vitest";
import {
  CSRD_TEMPLATE,
  getAllSectionCodes,
  getRequiredSectionCodes,
  getSectionByCode,
} from "../csrd-template";

describe("CSRD template", () => {
  it("has 4 top-level sections", () => {
    expect(CSRD_TEMPLATE.sections).toHaveLength(4);
  });

  it("top-level section codes are ESRS2, E1, S1, G1", () => {
    const codes = CSRD_TEMPLATE.sections.map((s) => s.code);
    expect(codes).toEqual(["ESRS2", "E1", "S1", "G1"]);
  });
});

describe("getAllSectionCodes", () => {
  it("returns all codes including subsections", () => {
    const codes = getAllSectionCodes(CSRD_TEMPLATE);
    expect(codes.length).toBeGreaterThan(4);
    expect(codes).toContain("ESRS2");
    expect(codes).toContain("ESRS2-BP1");
    expect(codes).toContain("E1");
    expect(codes).toContain("E1-6");
    expect(codes).toContain("E1-6-S3");
    expect(codes).toContain("S1-1");
    expect(codes).toContain("G1-1");
  });
});

describe("getRequiredSectionCodes", () => {
  it("only returns required subsection codes", () => {
    const codes = getRequiredSectionCodes(CSRD_TEMPLATE);
    expect(codes).toContain("ESRS2-BP1");
    expect(codes).toContain("E1-1");
    expect(codes).toContain("E1-6");
    // E1-6-S3 is optional
    expect(codes).not.toContain("E1-6-S3");
    // E1-7 and E1-9 are optional
    expect(codes).not.toContain("E1-7");
    expect(codes).not.toContain("E1-9");
  });
});

describe("getSectionByCode", () => {
  it("finds top-level section", () => {
    const result = getSectionByCode(CSRD_TEMPLATE, "E1");
    expect(result).not.toBeNull();
    expect(result!.title).toBe("Climate Change");
    expect(result!.required).toBe(true);
  });

  it("finds subsection with parent info", () => {
    const result = getSectionByCode(CSRD_TEMPLATE, "E1-6");
    expect(result).not.toBeNull();
    expect(result!.title).toBe("Gross Scope 1, 2, 3 GHG Emissions");
    expect(result!.parent).toBe("E1");
  });

  it("returns null for unknown code", () => {
    const result = getSectionByCode(CSRD_TEMPLATE, "UNKNOWN");
    expect(result).toBeNull();
  });

  it("finds governance section", () => {
    const result = getSectionByCode(CSRD_TEMPLATE, "G1-3");
    expect(result).not.toBeNull();
    expect(result!.title).toBe("Prevention & Detection of Corruption/Bribery");
    expect(result!.parent).toBe("G1");
  });
});
