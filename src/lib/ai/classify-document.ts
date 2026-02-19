import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, AI_MODEL } from "@/lib/anthropic";
import { CLASSIFY_DOCUMENT_SYSTEM } from "./prompts";
import type { DocumentClassification } from "@/types";

export async function classifyDocument(
  fileContent: string,
  mimeType: string
): Promise<DocumentClassification> {
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
          text: "Classify this document.",
        },
      ]
    : [
        {
          type: "text",
          text: `Classify this document based on its content:\n\n${fileContent}`,
        },
      ];

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 256,
    system: CLASSIFY_DOCUMENT_SYSTEM,
    messages: [{ role: "user", content }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const parsed = JSON.parse(text) as DocumentClassification;
    return parsed;
  } catch {
    return {
      documentType: "OTHER",
      confidence: 0.5,
      reasoning: "Failed to parse classification response",
    };
  }
}
