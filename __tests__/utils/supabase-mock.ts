/**
 * Minimal fake of the Supabase JS fluent query builder for Route Handler tests.
 * Each chain method returns the same chainable object; awaiting it (or calling
 * `.single()`) resolves to the configured `{ data, error }` result.
 */
type ChainResult = { data: unknown; error?: unknown; count?: number };

function makeChain(result: ChainResult) {
  const chain: Record<string, unknown> = {};
  const passthrough = [
    "select",
    "eq",
    "neq",
    "in",
    "order",
    "limit",
    "insert",
    "update",
  ];
  for (const method of passthrough) {
    chain[method] = jest.fn(() => chain);
  }
  chain.single = jest.fn(() => Promise.resolve(result));
  chain.then = (onFulfilled: (value: typeof result) => unknown) =>
    Promise.resolve(result).then(onFulfilled);
  return chain;
}

interface SupabaseMockOptions {
  user?: { id: string; email?: string } | null;
  selectResult?: ChainResult;
  insertResult?: ChainResult;
  updateResult?: ChainResult;
  deleteResult?: ChainResult;
}

export function createSupabaseMock({
  user = { id: "user-1", email: "jane@example.com" },
  selectResult = { data: null, error: null },
  insertResult = { data: null, error: null },
  updateResult = { data: null, error: null },
  deleteResult = { data: null, error: null },
}: SupabaseMockOptions) {
  const from = jest.fn(() => ({
    select: jest.fn(() => makeChain(selectResult)),
    insert: jest.fn(() => makeChain(insertResult)),
    update: jest.fn(() => makeChain(updateResult)),
    delete: jest.fn(() => makeChain(deleteResult)),
  }));

  return {
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user } }) },
    from,
  };
}
