import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { z } from "zod";

const createReportSchema = z.object({
  title: z.string().min(1),
  frameworkType: z.string().min(1),
  reportingPeriodId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = createReportSchema.parse(body);

    const report = await prisma.report.create({
      data: {
        organizationId: session.user.organizationId,
        title: validated.title,
        frameworkType: validated.frameworkType,
        reportingPeriodId: validated.reportingPeriodId,
        status: "DRAFT",
      },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "entity_created",
      entityType: "Report",
      entityId: report.id,
      newValue: {
        title: report.title,
        frameworkType: report.frameworkType,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[REPORTS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const frameworkType = searchParams.get("frameworkType");

    const reports = await prisma.report.findMany({
      where: {
        organizationId: session.user.organizationId,
        ...(status ? { status: status as never } : {}),
        ...(frameworkType ? { frameworkType } : {}),
      },
      orderBy: { updatedAt: "desc" },
      include: {
        reportingPeriod: {
          select: { id: true, name: true, startDate: true, endDate: true },
        },
      },
    });

    return NextResponse.json({ items: reports });
  } catch (error) {
    console.error("[REPORTS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
