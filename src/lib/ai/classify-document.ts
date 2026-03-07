import type { ChatCompletionContentPart } from "openai/resources/chat/completions";
import { openai, AI_MODEL } from "@/lib/openai";
import { CLASSIFY_DOCUMENT_SYSTEM } from "./prompts";
import type { DocumentClassification } from "@/types";

export async function classifyDocument(
  fileContent: string,
  mimeType: string
): Promise<DocumentClassification> {
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
          text: "Classify this document.",
        },
      ]
    : [
        {
          type: "text",
          text: `Classify this document based on its content:\n\n${fileContent}`,
        },
      ];

  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 512,
    temperature: 0.1,
    messages: [
      { role: "system", content: CLASSIFY_DOCUMENT_SYSTEM },
      { role: "user", content },
    ],
  });

  let text = response.choices[0]?.message?.content ?? "";
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    const parsed = JSON.parse(text) as DocumentClassification;
    return parsed;
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as DocumentClassification;
      } catch { /* fall through */ }
    }
    return {
      documentType: "OTHER",
      confidence: 0.5,
      reasoning: "Failed to parse classification response",
    };
  }
}
