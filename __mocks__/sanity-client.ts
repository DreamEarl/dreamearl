export const client = {
  fetch: jest.fn(() => Promise.resolve(null)),
};

export const urlFor = jest.fn(() => ({
  width: jest.fn().mockReturnThis(),
  height: jest.fn().mockReturnThis(),
  quality: jest.fn().mockReturnThis(),
  url: jest.fn(() => "/mock-image.jpg"),
}));
