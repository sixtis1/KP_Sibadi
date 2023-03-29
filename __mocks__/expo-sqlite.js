const mockTransaction = {
  executeSql: jest.fn((sql, args, success, error) => {
    success(null, null);
  }),
};

const mockDatabase = {
  transaction: jest.fn((callback) => {
    callback(mockTransaction);
  }),
};

export default {
  openDatabase: jest.fn(() => mockDatabase),
};
