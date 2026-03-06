import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReport } from "@/lib/ai/generate-report";
import { logAudit } from "@/lib/audit/logger";
import { z } from "zod";

const generateSchema = z.object({
  reportId: z.string(),
  reportingPeriodId: z.string().optional().default(""),
  frameworkType: z.string(),
  sections: z.array(z.string()).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = generateSchema.parse(body);

    // Verify report belongs to org
    const report = await prisma.report.findFirst({
      where: {
        id: validated.reportId,
        organizationId: session.user.organizationId,
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Set status to generating
    await prisma.report.update({
      where: { id: validated.reportId },
      data: { status: "GENERATING" },
    });

    let generatedContent;
    try {
      // Generate content with AI
      generatedContent = await generateReport({
        organizationId: session.user.organizationId,
        reportingPeriodId: validated.reportingPeriodId,
        frameworkType: validated.frameworkType,
        sections: validated.sections,
      });
    } catch (genError) {
      console.error("[REPORTS_GENERATE_AI]", genError);
      // Fallback: generate template-based content without AI
      generatedContent = Object.fromEntries(
        validated.sections.map((code) => [
          code,
          {
            code,
            title: code,
            content: `## ${code}\n\nThis section requires data input. Please review and add your organization's specific information for this disclosure requirement.\n\n*To auto-generate content, configure the OPENAI_API_KEY environment variable.*`,
            dataPointsUsed: [],
            dataGaps: ["AI generation unavailable - manual input required"],
            recommendations: ["Configure AI integration for automated content generation"],
            confidence: 0,
            methodology: "Template placeholder",
          },
        ])
      );
    }

    // Save generated content and update status
    const updated = await prisma.report.update({
      where: { id: validated.reportId },
      data: {
        generatedContent: generatedContent as never,
        finalContent: generatedContent as never,
        status: "REVIEW",
        ...(validated.reportingPeriodId ? { reportingPeriodId: validated.reportingPeriodId } : {}),
      },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "field_changed",
      entityType: "Report",
      entityId: report.id,
      previousValue: { status: "DRAFT" },
      newValue: {
        status: "REVIEW",
        sectionsGenerated: validated.sections.length,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[REPORTS_GENERATE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
