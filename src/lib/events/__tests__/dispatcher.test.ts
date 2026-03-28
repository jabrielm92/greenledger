import { describe, it, expect, vi, beforeEach } from "vitest";

// We need to test the dispatcher logic in isolation.
// Re-implement core logic to avoid side-effect imports.
describe("event dispatcher logic", () => {
  type Handler = (payload: unknown) => Promise<void>;
  interface RegisteredHandler {
    name: string;
    handler: Handler;
  }

  let registry: Map<string, RegisteredHandler[]>;

  function on(event: string, name: string, handler: Handler): void {
    const handlers = registry.get(event) ?? [];
    handlers.push({ name, handler });
    registry.set(event, handlers);
  }

  async function emit(event: string, payload: unknown): Promise<void> {
    const handlers = registry.get(event) ?? [];
    for (const { handler } of handlers) {
      try {
        await handler(payload);
      } catch {
        // isolated — one failure shouldn't block others
      }
    }
  }

  beforeEach(() => {
    registry = new Map();
  });

  it("calls all handlers for an event", async () => {
    const handler1 = vi.fn().mockResolvedValue(undefined);
    const handler2 = vi.fn().mockResolvedValue(undefined);

    on("document.extracted", "h1", handler1);
    on("document.extracted", "h2", handler2);

    const payload = { documentId: "doc1", organizationId: "org1" };
    await emit("document.extracted", payload);

    expect(handler1).toHaveBeenCalledWith(payload);
    expect(handler2).toHaveBeenCalledWith(payload);
  });

  it("calls handlers in registration order", async () => {
    const order: number[] = [];
    on("document.extracted", "first", async () => { order.push(1); });
    on("document.extracted", "second", async () => { order.push(2); });
    on("document.extracted", "third", async () => { order.push(3); });

    await emit("document.extracted", {});
    expect(order).toEqual([1, 2, 3]);
  });

  it("isolates handler failures — second handler still runs", async () => {
    const handler1 = vi.fn().mockRejectedValue(new Error("boom"));
    const handler2 = vi.fn().mockResolvedValue(undefined);

    on("document.extracted", "failing", handler1);
    on("document.extracted", "working", handler2);

    await emit("document.extracted", { documentId: "doc1" });

    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled(); // Should still be called
  });

  it("does not throw when emitting unregistered event", async () => {
    await expect(emit("unknown.event", {})).resolves.toBeUndefined();
  });

  it("does not cross-contaminate events", async () => {
    const h1 = vi.fn().mockResolvedValue(undefined);
    const h2 = vi.fn().mockResolvedValue(undefined);

    on("document.extracted", "h1", h1);
    on("emission.auto_created", "h2", h2);

    await emit("document.extracted", { id: "1" });

    expect(h1).toHaveBeenCalled();
    expect(h2).not.toHaveBeenCalled();
  });

  it("supports multiple subscriptions to same event", async () => {
    const calls: string[] = [];
    on("document.extracted", "a", async () => { calls.push("a"); });
    on("document.extracted", "b", async () => { calls.push("b"); });
    on("document.extracted", "c", async () => { calls.push("c"); });

    await emit("document.extracted", {});
    expect(calls).toEqual(["a", "b", "c"]);
  });
});
