import { openai, AI_MODEL } from "@/lib/openai";

export interface DocumentAnalysis {
  summary: string;
  esgRelevance: {
    frameworks: string[];
    scope: string | null;
    category: string | null;
    relevanceLevel: "high" | "medium" | "low";
    explanation: string;
  };
  metricsBreakdown: {
    metric: string;
    value: string;
    unit: string | null;
    calculationMethod: string;
  }[];
  recommendations: string[];
}

const ANALYSIS_SYSTEM_PROMPT = `You are an ESG compliance analyst for GreenLedger, a sustainability reporting platform. You receive a document's extracted data (JSON) along with its classification. Your job is to produce a comprehensive analysis for the user.

Your analysis MUST include:

1. **Summary**: A clear, concise summary (2-4 sentences) of what the document contains, written in plain English for a non-technical audience. Mention key figures, dates, and entities.

2. **ESG Relevance**: Explain how this document fits into ESG compliance:
   - Which ESG reporting frameworks it's relevant to (CSRD, GRI, SASB, ISSB, GHG Protocol, CDP, etc.)
   - Which GHG Protocol scope it maps to (Scope 1, 2, or 3) and why
   - The emission category it falls under
   - A relevance level (high/medium/low) for ESG reporting
   - A plain-English explanation of why this document matters for sustainability compliance

3. **Metrics Breakdown**: For each quantitative metric extracted, explain:
   - What the metric represents
   - The extracted value and unit
   - How emissions would be calculated from this data (e.g., "Multiply kWh by the grid emission factor for the region to get kg CO2e")

4. **Recommendations**: 1-3 actionable suggestions for the user (e.g., "Consider switching to a renewable energy tariff to reduce Scope 2 emissions", "This supplier lacks ESG certifications — request their sustainability report")

Respond with ONLY a valid JSON object matching this structure:
{
  "summary": "string",
  "esgRelevance": {
    "frameworks": ["CSRD", "GRI 305"],
    "scope": "Scope 2",
    "category": "Purchased electricity",
    "relevanceLevel": "high",
    "explanation": "string"
  },
  "metricsBreakdown": [
    {
      "metric": "Electricity consumption",
      "value": "1,234",
      "unit": "kWh",
      "calculationMethod": "Multiply by regional grid emission factor (e.g., 0.42 kg CO2e/kWh for US average) to calculate Scope 2 emissions."
    }
  ],
  "recommendations": ["string"]
}`;

export async function analyzeDocument(
  documentType: string,
  extractedData: Record<string, unknown>,
  fileName: string
): Promise<DocumentAnalysis> {
  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 2048,
    temperature: 0.3,
    messages: [
      { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Document: "${fileName}"
Classification: ${documentType}
Extracted Data:
${JSON.stringify(extractedData, null, 2)}

Provide your full ESG analysis.`,
      },
    ],
  });

  let text = response.choices[0]?.message?.content ?? "";
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    return JSON.parse(text) as DocumentAnalysis;
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as DocumentAnalysis;
      } catch {
        // fallthrough
      }
    }
    return {
      summary: text || "Analysis could not be generated.",
      esgRelevance: {
        frameworks: [],
        scope: null,
        category: null,
        relevanceLevel: "low",
        explanation: "Unable to parse structured analysis from AI response.",
      },
      metricsBreakdown: [],
      recommendations: [],
    };
  }
}
