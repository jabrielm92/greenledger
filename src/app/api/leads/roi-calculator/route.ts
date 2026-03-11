import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.email || typeof data.email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await prisma.lead.create({
      data: {
        email: data.email,
        source: "roi-calculator",
        metadata: {
          companySize: data.formData?.companySize,
          currentMethod: data.formData?.currentMethod,
          frameworks: data.formData?.frameworks,
          reportsPerYear: data.formData?.reportsPerYear,
          estimatedSavings: data.results?.savings,
          currentCost: data.results?.currentCost,
          greenLedgerCost: data.results?.greenLedgerCost,
          timestamp: data.timestamp,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to capture lead:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
