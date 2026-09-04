import "@testing-library/jest-dom";

// Prevent cart state from leaking across tests via localStorage
afterEach(() => {
  localStorage.clear();
});
