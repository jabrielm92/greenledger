import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { frameworkSelectionSchema } from "@/lib/validations/organization";
import { z } from "zod";

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

      // Look up framework records
      const frameworkRecords = await prisma.complianceFramework.findMany({
        where: { name: { in: frameworks } },
      });

      // Create OrgFramework records
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
            update: {},
            create: {
              organizationId: session.user.organizationId!,
              frameworkId: fw.id,
              targetYear: currentYear,
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
