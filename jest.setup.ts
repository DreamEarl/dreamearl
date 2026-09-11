import "@testing-library/jest-dom";

// Prevent cart state from leaking across tests via localStorage
afterEach(() => {
  localStorage.clear();
});

// Default fetch mock so CartContext's product-detail enrichment doesn't crash
// tests that don't care about it. Individual test files can override this
// in their own beforeEach, which runs after this one.
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ items: [] }),
    }),
  ) as unknown as typeof fetch;
});
