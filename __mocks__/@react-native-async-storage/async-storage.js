const storageCache = {};

const AsyncStorageMock = {
  setItem: jest.fn((key, value) => {
    return new Promise((resolve) => {
      storageCache[key] = value;
      resolve(null);
    });
  }),
  getItem: jest.fn((key) => {
    return new Promise((resolve) => {
      resolve(storageCache[key] || null);
    });
  }),
  removeItem: jest.fn((key) => {
    return new Promise((resolve) => {
      delete storageCache[key];
      resolve(null);
    });
  }),
  clear: jest.fn(() => {
    return new Promise((resolve) => {
      storageCache = {};
      resolve(null);
    });
  }),
};

export default AsyncStorageMock;
