/**
 * Internal event dispatcher for the post-upload automation pipeline.
 *
 * Events flow through a typed publish/subscribe system so that each
 * handler runs independently and failures are isolated from the main
 * request path. Handlers execute sequentially per event to avoid
 * overwhelming the database.
 */

export interface PipelineEvent {
  "document.extracted": {
    documentId: string;
    organizationId: string;
    userId: string;
    documentType: string;
    extractedData: Record<string, unknown>;
    confidence: number;
  };
  "document.extraction_failed": {
    documentId: string;
    organizationId: string;
    userId: string;
    error: string;
  };
  "emission.auto_created": {
    emissionEntryId: string;
    documentId: string;
    organizationId: string;
    userId: string;
    scope: string;
    category: string;
    co2e: number;
  };
  "supplier.auto_created": {
    supplierId: string;
    organizationId: string;
    userId: string;
    supplierName: string;
    documentId: string;
  };
}

type EventName = keyof PipelineEvent;
type Handler<E extends EventName> = (payload: PipelineEvent[E]) => Promise<void>;

interface RegisteredHandler<E extends EventName = EventName> {
  name: string;
  handler: Handler<E>;
}

const registry = new Map<EventName, RegisteredHandler[]>();

/**
 * Register a named handler for an event type.
 * Handlers are invoked in registration order.
 */
export function on<E extends EventName>(
  event: E,
  name: string,
  handler: Handler<E>
): void {
  const handlers = registry.get(event) ?? [];
  handlers.push({ name, handler } as RegisteredHandler);
  registry.set(event, handlers);
}

/**
 * Emit an event and run all registered handlers sequentially.
 * Each handler is wrapped in try/catch so one failure doesn't
 * prevent subsequent handlers from running.
 */
export async function emit<E extends EventName>(
  event: E,
  payload: PipelineEvent[E]
): Promise<void> {
  const handlers = registry.get(event) ?? [];

  for (const { name, handler } of handlers) {
    try {
      await (handler as Handler<E>)(payload);
    } catch (error) {
      console.error(
        `[EVENT_HANDLER_ERROR] ${event}/${name}:`,
        error instanceof Error ? error.message : error
      );
    }
  }
}
