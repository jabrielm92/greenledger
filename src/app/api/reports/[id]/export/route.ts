import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import {
  generateReportHTML,
  generateReportCSV,
} from "@/lib/reports/pdf-generator";
import type { GeneratedSection } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "html";

    const report = await prisma.report.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
      include: {
        organization: { select: { name: true } },
        reportingPeriod: { select: { name: true } },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const content = (report.finalContent || report.generatedContent) as Record<
      string,
      GeneratedSection
    > | null;

    if (!content) {
      return NextResponse.json(
        { error: "Report has no generated content" },
        { status: 400 }
      );
    }

    const sections = Object.values(content);

    if (format === "csv") {
      const csv = generateReportCSV(sections);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${report.title.replace(/[^a-zA-Z0-9]/g, "_")}.csv"`,
        },
      });
    }

    // Default: HTML (print to PDF)
    const html = generateReportHTML({
      title: report.title,
      frameworkType: report.frameworkType,
      organizationName: report.organization.name,
      reportingPeriod: report.reportingPeriod?.name || "N/A",
      sections,
      generatedAt: new Date(),
    });

    // Record export
    const reportExport = await prisma.reportExport.create({
      data: {
        reportId: id,
        format,
        filePath: `exports/${id}.${format}`,
      },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "entity_created",
      entityType: "ReportExport",
      entityId: reportExport.id,
    });

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `inline; filename="${report.title.replace(/[^a-zA-Z0-9]/g, "_")}.html"`,
      },
    });
  } catch (error) {
    console.error("[REPORT_EXPORT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
