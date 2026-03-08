/**
 * Parses document files into readable text content for AI extraction.
 *
 * Binary formats (PDF, DOCX) are converted to text using dedicated parsers.
 * Images are returned as base64 for vision model processing.
 * Plain text formats (CSV, TXT, XML, JSON) are read as UTF-8.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string }>;
import mammoth from "mammoth";

interface ParsedContent {
  /** The readable text content, or base64-encoded string for images */
  content: string;
  /** Whether the content is a base64-encoded image for the vision model */
  isImage: boolean;
}

const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/tiff",
  "image/bmp",
  "image/heic",
]);

const TEXT_TYPES = new Set([
  "text/csv",
  "text/plain",
  "text/xml",
  "application/xml",
  "application/json",
]);

export async function parseDocumentContent(
  buffer: Buffer,
  mimeType: string
): Promise<ParsedContent> {
  // Images → base64 for vision model
  if (IMAGE_TYPES.has(mimeType)) {
    return { content: buffer.toString("base64"), isImage: true };
  }

  // Plain text formats → UTF-8
  if (TEXT_TYPES.has(mimeType)) {
    return { content: buffer.toString("utf-8"), isImage: false };
  }

  // PDF → extract text
  if (mimeType === "application/pdf") {
    return parsePdf(buffer);
  }

  // DOCX → extract text
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword" ||
    mimeType === "application/vnd.oasis.opendocument.text"
  ) {
    return parseDocx(buffer);
  }

  // XLSX/XLS/ODS → extract as text (best-effort via raw XML inside zip)
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "application/vnd.ms-excel" ||
    mimeType === "application/vnd.oasis.opendocument.spreadsheet"
  ) {
    return parseSpreadsheet(buffer);
  }

  // Fallback: try as UTF-8 text
  return { content: buffer.toString("utf-8"), isImage: false };
}

/**
 * Heuristic: detect whether extracted PDF text is meaningful document content
 * or just sparse metadata (e.g., producer tags like "ReportLab").
 * Returns true if the text looks like real content worth classifying.
 */
function isPdfTextMeaningful(text: string): boolean {
  // Too short to be a real document
  if (text.length < 50) return false;

  // Count meaningful words (3+ chars, not common PDF metadata tokens)
  const metadataPatterns =
    /\b(reportlab|pdf|library|producer|creator|generated|opensource|version|moddate|creationdate|obj|endobj|stream|endstream)\b/gi;
  const cleaned = text.replace(metadataPatterns, "").trim();

  // After removing metadata tokens, check if substantial content remains
  const words = cleaned.split(/\s+/).filter((w) => w.length >= 3);
  if (words.length < 10) return false;

  return true;
}

async function parsePdf(buffer: Buffer): Promise<ParsedContent> {
  try {
    const data = await pdfParse(buffer);
    const text = data.text?.trim();
    if (text && isPdfTextMeaningful(text)) {
      return { content: text, isImage: false };
    }
    // Scanned PDF or metadata-only text → send as base64 image for vision
    console.warn(
      "[PARSE_PDF] No meaningful text found — falling back to base64 for vision model"
    );
    return { content: buffer.toString("base64"), isImage: true };
  } catch (err) {
    console.error("[PARSE_PDF] Error:", err);
    // Fallback to base64 image so the vision model can try
    return { content: buffer.toString("base64"), isImage: true };
  }
}

async function parseDocx(buffer: Buffer): Promise<ParsedContent> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value?.trim();
    if (text && text.length > 0) {
      return { content: text, isImage: false };
    }
    return {
      content: "[Empty document — no text content extracted]",
      isImage: false,
    };
  } catch (err) {
    console.error("[PARSE_DOCX] Error:", err);
    return {
      content: "[Failed to parse DOCX document]",
      isImage: false,
    };
  }
}

async function parseSpreadsheet(buffer: Buffer): Promise<ParsedContent> {
  // Without a dedicated XLSX parser, try mammoth (works for some Office formats)
  // or fall back to sending as base64 for the vision model
  try {
    // Attempt mammoth — it handles some Office XML formats
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value?.trim();
    if (text && text.length > 20) {
      return { content: text, isImage: false };
    }
  } catch {
    // Expected for spreadsheets — mammoth is DOCX-only
  }

  // Spreadsheet without a parser — send as base64 for vision model to try
  console.warn(
    "[PARSE_SPREADSHEET] No XLSX parser available — falling back to base64 for vision model"
  );
  return { content: buffer.toString("base64"), isImage: true };
}
