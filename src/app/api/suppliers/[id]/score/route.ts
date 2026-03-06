import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";

interface ScoreResult {
  esgRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN";
  esgScore: number;
}

function assessSupplierRisk(supplier: {
  name: string;
  industry?: string | null;
  country?: string | null;
  notes?: string | null;
}): ScoreResult {
  let score = 50; // Base score

  // Industry risk factors
  const highRiskIndustries = ["ENERGY", "MANUFACTURING", "CONSTRUCTION", "AGRICULTURE"];
  const mediumRiskIndustries = ["LOGISTICS", "FOOD_BEVERAGE", "RETAIL"];
  const lowRiskIndustries = ["TECHNOLOGY", "PROFESSIONAL_SERVICES", "HEALTHCARE"];

  if (supplier.industry) {
    if (highRiskIndustries.includes(supplier.industry)) score -= 20;
    else if (mediumRiskIndustries.includes(supplier.industry)) score -= 10;
    else if (lowRiskIndustries.includes(supplier.industry)) score += 10;
  } else {
    score -= 15; // Unknown industry is a risk
  }

  // Country risk factors (simplified)
  const highRiskCountries = ["CN", "IN", "RU", "BR"];
  const lowRiskCountries = ["SE", "NO", "DK", "FI", "CH", "NL", "DE"];

  if (supplier.country) {
    if (highRiskCountries.includes(supplier.country)) score -= 15;
    else if (lowRiskCountries.includes(supplier.country)) score += 10;
  } else {
    score -= 10; // Unknown country
  }

  // Notes analysis for ESG keywords
  if (supplier.notes) {
    const positiveKeywords = ["certified", "iso 14001", "carbon neutral", "renewable", "sustainability", "esg", "b corp", "fair trade"];
    const negativeKeywords = ["violation", "fine", "lawsuit", "pollution", "deforestation", "child labor", "spill", "contamination"];
    const lowerNotes = supplier.notes.toLowerCase();

    for (const kw of positiveKeywords) {
      if (lowerNotes.includes(kw)) score += 5;
    }
    for (const kw of negativeKeywords) {
      if (lowerNotes.includes(kw)) score -= 10;
    }
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Map score to risk level
  let esgRiskLevel: ScoreResult["esgRiskLevel"];
  if (score >= 70) esgRiskLevel = "LOW";
  else if (score >= 50) esgRiskLevel = "MEDIUM";
  else if (score >= 30) esgRiskLevel = "HIGH";
  else esgRiskLevel = "CRITICAL";

  return { esgRiskLevel, esgScore: score };
}

async function aiAssessSupplier(supplier: {
  name: string;
  industry?: string | null;
  country?: string | null;
  notes?: string | null;
}): Promise<ScoreResult> {
  try {
    const { openai, AI_MODEL } = await import("@/lib/openai");

    const prompt = `You are an ESG risk analyst. Assess the following supplier for ESG risk.

SUPPLIER:
- Name: ${supplier.name}
- Industry: ${supplier.industry || "Unknown"}
- Country: ${supplier.country || "Unknown"}
- Notes: ${supplier.notes || "None"}

Score the supplier from 0-100 (100 = lowest risk) and assign a risk level.
Consider: environmental impact of industry, country regulations, any ESG indicators in notes.

Respond ONLY with JSON:
{"esgScore": <number 0-100>, "esgRiskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>"}`;

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 150,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

    const score = Math.max(0, Math.min(100, Number(parsed.esgScore) || 50));
    const validLevels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    const level = validLevels.includes(parsed.esgRiskLevel) ? parsed.esgRiskLevel : "MEDIUM";

    return { esgScore: score, esgRiskLevel: level };
  } catch {
    // Fallback to rule-based scoring if AI unavailable
    return assessSupplierRisk(supplier);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const supplier = await prisma.supplier.findFirst({
      where: { id, organizationId: session.user.organizationId },
    });

    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }

    // Try AI assessment, falls back to rule-based
    const result = await aiAssessSupplier({
      name: supplier.name,
      industry: supplier.industry,
      country: supplier.country,
      notes: supplier.notes,
    });

    const updated = await prisma.supplier.update({
      where: { id },
      data: {
        esgRiskLevel: result.esgRiskLevel,
        esgScore: result.esgScore,
        lastAssessment: new Date(),
      },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "field_changed",
      entityType: "Supplier",
      entityId: id,
      previousValue: {
        esgRiskLevel: supplier.esgRiskLevel,
        esgScore: supplier.esgScore,
      },
      newValue: {
        esgRiskLevel: result.esgRiskLevel,
        esgScore: result.esgScore,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[SUPPLIER_SCORE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
