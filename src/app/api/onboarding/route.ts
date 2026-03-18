import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { frameworkSelectionSchema } from "@/lib/validations/organization";
import { z } from "zod";

// Default reporting deadlines per framework (must match /api/organization/frameworks)
function getDefaultDueDate(frameworkName: string, targetYear: number): Date {
  switch (frameworkName) {
    case "CSRD":
      return new Date(targetYear, 5, 30); // June 30
    case "SB253":
      return new Date(targetYear, 2, 31); // March 31
    default:
      return new Date(targetYear, 11, 31); // December 31
  }
}

const FRAMEWORK_DEFINITIONS: Record<string, { displayName: string; version: string; description: string; regions: string[] }> = {
  CSRD: { displayName: "CSRD / ESRS Report", version: "2024", description: "EU Corporate Sustainability Reporting Directive based on European Sustainability Reporting Standards (ESRS)", regions: ["EU"] },
  GRI: { displayName: "GRI Standards", version: "2021", description: "Global Reporting Initiative Universal, Sector, and Topic Standards", regions: ["GLOBAL"] },
  SASB: { displayName: "SASB Standards", version: "2023", description: "Sustainability Accounting Standards Board industry-specific standards", regions: ["GLOBAL"] },
  ISSB_S1: { displayName: "ISSB S1 — General Sustainability", version: "2023", description: "IFRS S1 General Requirements for Disclosure of Sustainability-related Financial Information", regions: ["GLOBAL"] },
  ISSB_S2: { displayName: "ISSB S2 — Climate-related Disclosures", version: "2023", description: "IFRS S2 Climate-related Disclosures", regions: ["GLOBAL"] },
  SB253: { displayName: "California SB-253", version: "2024", description: "Climate Corporate Data Accountability Act requiring Scope 1, 2, and 3 reporting", regions: ["US-CA"] },
};

// POST /api/onboarding — handles framework selection and onboarding completion
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === "select-frameworks") {
      const { frameworks } = frameworkSelectionSchema.parse(body);

      const currentYear = new Date().getFullYear();

      // Look up framework records by name
      const frameworkRecords = await prisma.complianceFramework.findMany({
        where: { name: { in: frameworks } },
      });

      // If no matching records found, create them on-the-fly
      if (frameworkRecords.length < frameworks.length) {
        const existingNames = new Set(frameworkRecords.map((fw) => fw.name));
        const missing = frameworks.filter((name) => !existingNames.has(name));

        for (const name of missing) {
          const def = FRAMEWORK_DEFINITIONS[name];
          if (def) {
            const created = await prisma.complianceFramework.upsert({
              where: { name },
              update: {},
              create: {
                name,
                displayName: def.displayName,
                version: def.version,
                description: def.description,
                regions: def.regions,
                isActive: true,
              },
            });
            frameworkRecords.push(created);
          }
        }
      }

      if (frameworkRecords.length === 0) {
        return NextResponse.json(
          { error: "No valid frameworks found" },
          { status: 400 }
        );
      }

      // Create OrgFramework records with default due dates
      const orgFrameworks = await Promise.all(
        frameworkRecords.map((fw) =>
          prisma.orgFramework.upsert({
            where: {
              organizationId_frameworkId_targetYear: {
                organizationId: session.user.organizationId!,
                frameworkId: fw.id,
                targetYear: currentYear,
              },
            },
            update: {
              dueDate: getDefaultDueDate(fw.name, currentYear),
            },
            create: {
              organizationId: session.user.organizationId!,
              frameworkId: fw.id,
              targetYear: currentYear,
              dueDate: getDefaultDueDate(fw.name, currentYear),
            },
          })
        )
      );

      return NextResponse.json({ frameworks: orgFrameworks }, { status: 201 });
    }

    if (action === "complete") {
      await prisma.organization.update({
        where: { id: session.user.organizationId },
        data: { onboardingComplete: true },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[ONBOARDING_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
