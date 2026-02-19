import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOrganizationSchema } from "@/lib/validations/organization";
import { slugify } from "@/lib/utils";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has an organization
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    });

    if (existingUser?.organizationId) {
      return NextResponse.json(
        { error: "User already belongs to an organization" },
        { status: 409 }
      );
    }

    const body = await req.json();
    const validated = createOrganizationSchema.parse(body);

    // Generate unique slug
    let slug = slugify(validated.name);
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });
    if (existingOrg) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Parse employee count to midpoint number
    const employeeCountMap: Record<string, number> = {
      "1-50": 25,
      "51-100": 75,
      "101-250": 175,
      "251-500": 375,
      "500+": 750,
    };

    const now = new Date();
    const fiscalYearStart = validated.fiscalYearStart;
    const currentYear = now.getFullYear();

    // Calculate fiscal year dates
    const fyStartDate = new Date(currentYear, fiscalYearStart - 1, 1);
    const fyEndDate = new Date(currentYear + 1, fiscalYearStart - 1, 0);
    // If we're before the fiscal year start month, use previous year
    if (now < fyStartDate) {
      fyStartDate.setFullYear(currentYear - 1);
      fyEndDate.setFullYear(currentYear);
    }

    const organization = await prisma.$transaction(async (tx) => {
      // Create org
      const org = await tx.organization.create({
        data: {
          name: validated.name,
          slug,
          industry: validated.industry as never,
          employeeCount: employeeCountMap[validated.employeeCount] ?? 0,
          country: validated.country,
          city: validated.city || null,
          website: validated.website || null,
          fiscalYearStart,
          plan: "FREE_TRIAL",
        },
      });

      // Link user to org as OWNER
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          organizationId: org.id,
          role: "OWNER",
        },
      });

      // Create default reporting period
      await tx.reportingPeriod.create({
        data: {
          organizationId: org.id,
          name: `FY${fyEndDate.getFullYear()}`,
          startDate: fyStartDate,
          endDate: fyEndDate,
          isCurrent: true,
        },
      });

      return org;
    });

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[ORGANIZATIONS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
