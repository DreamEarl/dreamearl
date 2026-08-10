export const createImageUrlBuilder = jest.fn(() => ({
  image: jest.fn(() => ({
    width: jest.fn().mockReturnThis(),
    height: jest.fn().mockReturnThis(),
    quality: jest.fn().mockReturnThis(),
    url: jest.fn(() => "/mock-image.jpg"),
  })),
}));
