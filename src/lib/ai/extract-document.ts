import Anthropic from "@anthropic-ai/sdk";
import { anthropic, AI_MODEL } from "@/lib/anthropic";
import { getExtractionPrompt } from "./prompts";
import { classifyDocument } from "./classify-document";
import type { DocumentClassification, ExtractedData } from "@/types";

interface ExtractionResult {
  classification: DocumentClassification;
  extractedData: ExtractedData | Record<string, unknown>;
  confidence: number;
}

export async function extractDocument(
  fileContent: string,
  mimeType: string
): Promise<ExtractionResult> {
  // Step 1: Classify
  const classification = await classifyDocument(fileContent, mimeType);

  // Step 2: Extract based on classification
  const extractionPrompt = getExtractionPrompt(classification.documentType);
  const isImage = mimeType.startsWith("image/");

  const content: (Anthropic.Messages.TextBlockParam | Anthropic.Messages.ImageBlockParam)[] = isImage
    ? [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
            data: fileContent,
          },
        },
        {
          type: "text",
          text: "Extract the data from this document.",
        },
      ]
    : [
        {
          type: "text",
          text: `Extract data from this document:\n\n${fileContent}`,
        },
      ];

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 2048,
    system: extractionPrompt,
    messages: [{ role: "user", content }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  let extractedData: ExtractedData | Record<string, unknown>;
  let confidence: number;

  try {
    const parsed = JSON.parse(text);
    extractedData = parsed;
    confidence = parsed.confidence ?? classification.confidence;
  } catch {
    extractedData = { raw: text, parseError: true };
    confidence = 0.3;
  }

  return {
    classification,
    extractedData,
    confidence,
  };
}
