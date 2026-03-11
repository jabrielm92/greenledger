import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { checkRateLimit } from "@/lib/rate-limit";
import ROICalculatorResultsEmail from "@/emails/roi-calculator-results";

const schema = z.object({
  email: z.string().email(),
  formData: z.object({
    companySize: z.string(),
    currentMethod: z.string(),
    frameworks: z.number(),
    reportsPerYear: z.number(),
  }),
  results: z.object({
    currentCost: z.number(),
    greenLedgerCost: z.number(),
    savings: z.number(),
    percentageSaved: z.number(),
    hoursSaved: z.number(),
  }),
  timestamp: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Rate limit by IP — 5 submissions per minute
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = checkRateLimit(`roi-lead:${ip}`, {
      limit: 5,
      windowSeconds: 60,
    });
    if (rl.limited) {
      return NextResponse.json(rl.response, {
        status: 429,
        headers: rl.headers,
      });
    }

    // Store lead in database
    await prisma.lead.create({
      data: {
        email: data.email.toLowerCase(),
        source: "roi-calculator",
        metadata: {
          companySize: data.formData.companySize,
          currentMethod: data.formData.currentMethod,
          frameworks: data.formData.frameworks,
          reportsPerYear: data.formData.reportsPerYear,
          estimatedSavings: data.results.savings,
          currentCost: data.results.currentCost,
          greenLedgerCost: data.results.greenLedgerCost,
          timestamp: data.timestamp,
        },
      },
    });

    // Send results email via Resend (fire-and-forget, don't block response)
    sendEmail({
      to: data.email.toLowerCase(),
      subject: `Your ESG Compliance Savings: $${data.results.savings.toLocaleString()}/year`,
      react: ROICalculatorResultsEmail({
        currentCost: data.results.currentCost,
        greenLedgerCost: data.results.greenLedgerCost,
        savings: data.results.savings,
        percentageSaved: data.results.percentageSaved,
        hoursSaved: data.results.hoursSaved,
        companySize: data.formData.companySize,
        currentMethod: data.formData.currentMethod,
        reportsPerYear: data.formData.reportsPerYear,
        frameworks: data.formData.frameworks,
      }),
    }).catch((err) => {
      console.error("[ROI_CALCULATOR_EMAIL_ERROR]", err);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[ROI_CALCULATOR_LEAD_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
