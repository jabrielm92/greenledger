import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  "gpt-4o": {
    input: 2.5 / 1_000_000,
    output: 10.0 / 1_000_000,
  },
  "gpt-4o-mini": {
    input: 0.15 / 1_000_000,
    output: 0.6 / 1_000_000,
  },
};

export async function logAIUsage(data: {
  organizationId: string;
  documentId?: string;
  operation: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}): Promise<void> {
  const costs = MODEL_COSTS[data.model] || MODEL_COSTS["gpt-4o"];
  const estimatedCost =
    data.inputTokens * costs.input + data.outputTokens * costs.output;

  try {
    await prisma.aIUsageLog.create({
      data: {
        organizationId: data.organizationId,
        documentId: data.documentId || null,
        operation: data.operation,
        model: data.model,
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
        estimatedCost,
      },
    });
  } catch (error) {
    // Non-critical: log but don't fail the operation
    logger.error("Failed to log AI usage", {
      error: String(error),
      operation: data.operation,
    });
  }

  logger.info("AI usage logged", {
    operation: data.operation,
    model: data.model,
    cost: `$${estimatedCost.toFixed(4)}`,
  });
}
