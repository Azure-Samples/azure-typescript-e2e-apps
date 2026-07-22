import { TodoItem, BulkItemResult } from "../models";

// ── In-memory store ──────────────────────────────────────
let nextId = 2;
let todos: Record<string, string> = { "1": "Say hello" };

// ── Single-item operations ───────────────────────────────
export function getAll(): Record<string, string> {
  return todos;
}

export function addOne(title: string): string {
  const id = String(nextId++);
  todos[id] = title;
  return id;
}

export function deleteAll(): void {
  todos = {};
  nextId = 1;
}

// ── Batched bulk insert ──────────────────────────────────
// Performs a single pass over the array — no per-item async work.
export function bulkCreate(items: TodoItem[]): BulkItemResult[] {
  const results: BulkItemResult[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      if (!item.title || typeof item.title !== "string" || item.title.trim().length === 0) {
        results.push({ index: i, success: false, error: "title must be a non-empty string" });
        continue;
      }
      const id = addOne(item.title.trim());
      results.push({ index: i, success: true, id, title: item.title.trim() });
    } catch (err) {
      results.push({ index: i, success: false, error: String(err) });
    }
  }

  return results;
}
