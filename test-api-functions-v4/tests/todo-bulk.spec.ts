/* eslint-disable notice/notice */

/**
 * Integration tests for POST /api/todo/bulk
 *
 * Requires the api-inmemory Functions host running locally:
 *   cd api-inmemory && npm start
 *
 * Then from this project:
 *   npx playwright test tests/todo-bulk.spec.ts
 */

import { test, expect } from "@playwright/test";

test.use({
  baseURL: "http://localhost:7071",
});

// Reset the in-memory store before each test so results are deterministic.
test.beforeEach(async ({ request }) => {
  await request.delete("/api/todo");
});

// ── 1. Happy path: 3 valid items ─────────────────────────

test("bulk create with 3 valid items returns 201 with per-item results and correlationId", async ({
  request,
}) => {
  const correlationId = "test-corr-happy-path";

  const response = await request.post("/api/todo/bulk", {
    headers: { "x-correlation-id": correlationId },
    data: {
      items: [
        { title: "Buy milk" },
        { title: "Read docs" },
        { title: "Ship feature" },
      ],
    },
  });

  expect(response.status()).toBe(201);

  // Correlation ID echoed in response header
  expect(response.headers()["x-correlation-id"]).toBe(correlationId);

  const body = await response.json();

  // Correlation ID in body
  expect(body.correlationId).toBe(correlationId);

  // Counts
  expect(body.total).toBe(3);
  expect(body.succeeded).toBe(3);
  expect(body.failed).toBe(0);

  // Per-item results
  expect(body.results).toHaveLength(3);
  for (let i = 0; i < 3; i++) {
    expect(body.results[i].index).toBe(i);
    expect(body.results[i].success).toBe(true);
    expect(body.results[i].id).toBeDefined();
    expect(body.results[i].title).toBeDefined();
  }

  expect(body.results[0].title).toBe("Buy milk");
  expect(body.results[1].title).toBe("Read docs");
  expect(body.results[2].title).toBe("Ship feature");

  // Verify they actually exist via GET /api/todo
  const getResp = await request.get("/api/todo");
  const todos = await getResp.json();
  const titles = Object.values(todos);
  expect(titles).toContain("Buy milk");
  expect(titles).toContain("Read docs");
  expect(titles).toContain("Ship feature");
});

test("bulk create generates correlationId when header is not provided", async ({
  request,
}) => {
  const response = await request.post("/api/todo/bulk", {
    data: { items: [{ title: "Auto-corr test" }] },
  });

  expect(response.status()).toBe(201);

  // A correlation ID should still be present
  const cid = response.headers()["x-correlation-id"];
  expect(cid).toBeDefined();
  expect(cid!.length).toBeGreaterThan(0);

  const body = await response.json();
  expect(body.correlationId).toBe(cid);
});

// ── 2. Validation error: body is not an array ────────────

test("returns 400 when body has no items array", async ({ request }) => {
  const response = await request.post("/api/todo/bulk", {
    data: { notItems: "oops" },
  });

  expect(response.status()).toBe(400);

  const body = await response.json();
  expect(body.correlationId).toBeDefined();
  expect(body.error).toContain("items");
});

test("returns 400 when body is a plain array instead of { items: [...] }", async ({
  request,
}) => {
  const response = await request.post("/api/todo/bulk", {
    data: [{ title: "wrong shape" }],
  });

  expect(response.status()).toBe(400);

  const body = await response.json();
  expect(body.error).toContain("items");
});

// ── 3. Validation error: items array is empty ────────────

test("returns 400 when items array is empty", async ({ request }) => {
  const response = await request.post("/api/todo/bulk", {
    headers: { "x-correlation-id": "test-empty" },
    data: { items: [] },
  });

  expect(response.status()).toBe(400);

  const body = await response.json();
  expect(body.correlationId).toBe("test-empty");
  expect(body.error).toContain("empty");
});

// ── 4. Validation error: missing required field(s) ───────

test("returns 400 with per-item errors when title is missing", async ({
  request,
}) => {
  const response = await request.post("/api/todo/bulk", {
    headers: { "x-correlation-id": "test-missing-field" },
    data: {
      items: [
        { title: "Valid item" },
        { description: "no title here" },       // missing title
        {},                                      // empty object
      ],
    },
  });

  expect(response.status()).toBe(400);

  const body = await response.json();
  expect(body.correlationId).toBe("test-missing-field");
  expect(body.error).toContain("Validation failed");
  expect(body.validationErrors).toBeDefined();
  expect(body.validationErrors).toHaveLength(2);

  // Errors reference the correct indices
  const errorIndices = body.validationErrors.map((e: { index: number }) => e.index);
  expect(errorIndices).toContain(1);
  expect(errorIndices).toContain(2);

  // Each error has a message
  for (const err of body.validationErrors) {
    expect(err.message).toBeDefined();
    expect(err.message.length).toBeGreaterThan(0);
  }
});

test("returns 400 when title is empty string", async ({ request }) => {
  const response = await request.post("/api/todo/bulk", {
    data: {
      items: [{ title: "" }],
    },
  });

  expect(response.status()).toBe(400);

  const body = await response.json();
  expect(body.validationErrors).toHaveLength(1);
  expect(body.validationErrors[0].index).toBe(0);
});

test("returns 400 when title is non-string type", async ({ request }) => {
  const response = await request.post("/api/todo/bulk", {
    data: {
      items: [{ title: 12345 }],
    },
  });

  expect(response.status()).toBe(400);

  const body = await response.json();
  expect(body.validationErrors).toHaveLength(1);
});
