import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TodoItem, BulkCreateResponse, ValidationError } from "../models";
import * as todoService from "../services/todoService";

// ── helpers ──────────────────────────────────────────────

/** Read or generate a correlation ID from the incoming request. */
function correlationId(request: HttpRequest): string {
  return request.headers.get("x-correlation-id") ?? crypto.randomUUID();
}

// ── GET /api/todo ────────────────────────────────────────

app.get("getAll", {
  route: "todo",
  authLevel: "anonymous",
  handler: async function getAll(
    request: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    return { jsonBody: todoService.getAll() };
  },
});

// ── POST /api/todo  (single create) ─────────────────────

app.post("addOne", {
  route: "todo",
  authLevel: "anonymous",
  handler: async function addOne(
    request: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    const body = (await request.json()) as Record<string, unknown>;
    context.log("addOne body", body);

    if (body && typeof body.title === "string" && body.title.trim().length > 0) {
      const id = todoService.addOne(body.title.trim());
      return { jsonBody: { id, title: body.title.trim() } };
    }

    return {
      status: 400,
      jsonBody: { error: "Request body must include a non-empty 'title' string." },
    };
  },
});

// ── POST /api/todo/bulk  (bulk create) ──────────────────

app.post("bulkCreate", {
  route: "todo/bulk",
  authLevel: "anonymous",
  handler: async function bulkCreate(
    request: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    const cid = correlationId(request);

    // ── Parse body ────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return {
        status: 400,
        headers: { "x-correlation-id": cid },
        jsonBody: { correlationId: cid, error: "Request body must be valid JSON." },
      };
    }

    // ── Validate top-level shape ──────────────────────
    if (!body || !Array.isArray((body as any).items)) {
      return {
        status: 400,
        headers: { "x-correlation-id": cid },
        jsonBody: {
          correlationId: cid,
          error: "Request body must be an object with an 'items' array.  Example: { \"items\": [{ \"title\": \"...\" }] }",
        },
      };
    }

    const items: unknown[] = (body as any).items;

    if (items.length === 0) {
      return {
        status: 400,
        headers: { "x-correlation-id": cid },
        jsonBody: { correlationId: cid, error: "'items' array must not be empty." },
      };
    }

    // ── Per-item pre-validation ───────────────────────
    const errors: ValidationError[] = [];
    const validItems: TodoItem[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i] as Record<string, unknown>;
      if (!item || typeof item !== "object" || typeof item.title !== "string" || (item.title as string).trim().length === 0) {
        errors.push({ index: i, message: "Each item must be an object with a non-empty 'title' string." });
      } else {
        validItems.push({ title: (item.title as string).trim() });
      }
    }

    if (errors.length > 0) {
      return {
        status: 400,
        headers: { "x-correlation-id": cid },
        jsonBody: {
          correlationId: cid,
          error: "Validation failed for one or more items.",
          validationErrors: errors,
        },
      };
    }

    // ── Batched insert via service ────────────────────
    const results = todoService.bulkCreate(validItems);
    const succeeded = results.filter((r) => r.success).length;
    const failed = results.length - succeeded;

    context.log(`[${cid}] bulkCreate: ${succeeded} succeeded, ${failed} failed out of ${results.length}`);

    const response: BulkCreateResponse = {
      correlationId: cid,
      total: results.length,
      succeeded,
      failed,
      results,
    };

    return {
      status: failed > 0 ? 207 : 201,
      headers: { "x-correlation-id": cid },
      jsonBody: response,
    };
  },
});

// ── DELETE /api/todo ─────────────────────────────────────

app.deleteRequest("deleteAll", {
  route: "todo",
  authLevel: "anonymous",
  handler: async function deleteAll(
    request: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    todoService.deleteAll();
    return { jsonBody: todoService.getAll() };
  },
});
