import type { ChatCompletionContentPart } from "openai/resources/chat/completions";
import { openai, AI_MODEL } from "@/lib/openai";
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

  const content: ChatCompletionContentPart[] = isImage
    ? [
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${fileContent}`,
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

  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 2048,
    messages: [
      { role: "system", content: extractionPrompt },
      { role: "user", content },
    ],
  });

  const text = response.choices[0]?.message?.content ?? "";

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
