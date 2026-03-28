import { describe, it, expect } from "vitest";
import {
  formatEmissions,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  slugify,
  truncate,
  getInitials,
  capitalize,
  formatEnumValue,
} from "../utils";

describe("formatEmissions", () => {
  it("displays kgCO2e for values < 1 tonne", () => {
    expect(formatEmissions(500)).toBe("500.0 kgCO2e");
  });

  it("displays tCO2e for values >= 1 tonne", () => {
    expect(formatEmissions(1500)).toBe("1.5 tCO2e");
  });

  it("displays k tCO2e for values >= 1000 tonnes", () => {
    expect(formatEmissions(2_500_000)).toBe("2.5k tCO2e");
  });

  it("handles zero", () => {
    expect(formatEmissions(0)).toBe("0.0 kgCO2e");
  });

  it("handles exactly 1 tonne (1000 kg)", () => {
    expect(formatEmissions(1000)).toBe("1.0 tCO2e");
  });
});

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats EUR", () => {
    const result = formatCurrency(1000, "EUR");
    expect(result).toContain("1,000.00");
  });
});

describe("formatNumber", () => {
  it("formats with no decimals by default", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("formats with specified decimals", () => {
    expect(formatNumber(1234.5678, 2)).toBe("1,234.57");
  });
});

describe("formatPercentage", () => {
  it("formats with one decimal by default", () => {
    expect(formatPercentage(85.678)).toBe("85.7%");
  });

  it("formats with zero decimals", () => {
    expect(formatPercentage(85.678, 0)).toBe("86%");
  });
});

describe("formatFileSize", () => {
  it("returns 0 B for zero", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  it("formats KB", () => {
    expect(formatFileSize(2048)).toBe("2 KB");
  });

  it("formats MB", () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5 MB");
  });
});

describe("slugify", () => {
  it("converts to lowercase with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! World?")).toBe("hello-world");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("--Hello World--")).toBe("hello-world");
  });

  it("truncates to 60 characters", () => {
    const long = "a".repeat(100);
    expect(slugify(long).length).toBe(60);
  });

  it("handles underscores", () => {
    expect(slugify("hello_world")).toBe("hello-world");
  });
});

describe("truncate", () => {
  it("returns short text unchanged", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates with ellipsis", () => {
    expect(truncate("hello world this is long", 10)).toBe("hello w...");
  });

  it("handles exact length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("getInitials", () => {
  it("returns first two initials", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("handles single name", () => {
    expect(getInitials("John")).toBe("J");
  });

  it("limits to two characters", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });
});

describe("capitalize", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("lowercases rest", () => {
    expect(capitalize("HELLO")).toBe("Hello");
  });
});

describe("formatEnumValue", () => {
  it("converts underscore-separated uppercase to title case", () => {
    expect(formatEnumValue("PROFESSIONAL_SERVICES")).toBe("Professional Services");
  });

  it("handles single word", () => {
    expect(formatEnumValue("MANUFACTURING")).toBe("Manufacturing");
  });
});
