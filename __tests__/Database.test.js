import { Database } from "../components/Database";
import { stringMd5 } from "react-native-quick-md5";

const mockExecuteSql = jest.fn();

jest.mock("expo-sqlite", () => ({
  openDatabase: () => ({
    transaction: (callback) => callback({ executeSql: mockExecuteSql }),
  }),
}));

describe("getSemesters", () => {
  let database;

  beforeEach(() => {
    database = new Database();
    mockExecuteSql.mockClear();
  });
  it("should return semesters on success", async () => {
    const mockSemesters = [{ semester: "Весна" }, { semester: "Осень" }];

    mockExecuteSql.mockImplementationOnce((_, __, success) => {
      success(null, { rows: { _array: mockSemesters } });
    });

    const semesters = await database.getSemesters();
    expect(semesters).toEqual(mockSemesters);
    expect(mockExecuteSql).toHaveBeenCalledWith(
      "SELECT DISTINCT semester FROM Semesters",
      [],
      expect.any(Function),
      expect.any(Function)
    );
  });
  it("should reject with error if no semesters are found", async () => {
    mockExecuteSql.mockImplementationOnce((_, __, success) => {
      success(null, { rows: { _array: [] } });
    });

    await expect(database.getSemesters()).rejects.toEqual("Error 3");
    expect(mockExecuteSql).toHaveBeenCalledWith(
      "SELECT DISTINCT semester FROM Semesters",
      [],
      expect.any(Function),
      expect.any(Function)
    );
  });
  it("should reject with error on query failure", async () => {
    const error = new Error("Query failed");

    mockExecuteSql.mockImplementationOnce((_, __, ___, errorCb) => {
      errorCb(null, error);
    });

    await expect(database.getSemesters()).rejects.toEqual(error);
    expect(mockExecuteSql).toHaveBeenCalledWith(
      "SELECT DISTINCT semester FROM Semesters",
      [],
      expect.any(Function),
      expect.any(Function)
    );
  });
});

describe("loginFunc", () => {
  let database;

  beforeEach(() => {
    database = new Database();
    mockExecuteSql.mockClear();
  });
  it("should resolve with 1 on successful login", async () => {
    const login = "testlogin";
    const password = "testpassword";
    const hashedPassword = stringMd5(password);

    mockExecuteSql.mockImplementationOnce((_, __, success) => {
      success(null, { rows: { length: 1 } });
    });

    await expect(database.loginFunc(login, password)).resolves.toEqual(1);
    expect(mockExecuteSql).toHaveBeenLastCalledWith(
      "SELECT * FROM Teachers WHERE login = ? AND password = ?",
      [login, hashedPassword],
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should reject with 'Неверный логин или пароль.' if login or password is incorrect", async () => {
    const login = "testlogin";
    const password = "testpassword";
    const hashedPassword = stringMd5(password);

    mockExecuteSql.mockImplementationOnce((_, __, success) => {
      success(null, { rows: { length: 0 } });
    });

    await expect(database.loginFunc(login, password)).rejects.toEqual(
      "Неверный логин или пароль."
    );
    expect(mockExecuteSql).toHaveBeenLastCalledWith(
      "SELECT * FROM Teachers WHERE login = ? AND password = ?",
      [login, hashedPassword],
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should reject with 'Ошибка входа' if query fails", async () => {
    const login = "testlogin";
    const password = "testpassword";
    const hashedPassword = stringMd5(password);
    const error = new Error("query error");

    mockExecuteSql.mockImplementationOnce((_, __, ___, failure) => {
      failure(null, error);
    });

    await expect(database.loginFunc(login, password)).rejects.toEqual(
      "Ошибка входа"
    );
    expect(mockExecuteSql).toHaveBeenLastCalledWith(
      "SELECT * FROM Teachers WHERE login = ? AND password = ?",
      [login, hashedPassword],
      expect.any(Function),
      expect.any(Function)
    );
  });
});

describe("getGrades", () => {
  const studentId = 1;
  const year = 2022;
  const semester = "осень";
  let database;

  beforeEach(() => {
    database = new Database();
    mockExecuteSql.mockClear();
  });

  it("should return grades on success", async () => {
    const mockGrades = [
      {
        subject_name: "Математика",
        grade: 4,
        score_1k: 45,
        score_2k: 60,
      },
      {
        subject_name: "Физика",
        grade: 5,
        score_1k: 50,
        score_2k: 70,
      },
    ];

    mockExecuteSql.mockImplementationOnce((_, __, success) => {
      success(null, { rows: { _array: mockGrades } });
    });

    await expect(
      database.getGrades(studentId, year, semester)
    ).resolves.toEqual(mockGrades);
    expect(mockExecuteSql).toHaveBeenLastCalledWith(
      expect.stringContaining(
        "SELECT s.subject_name, g.grade, sc.score_1k, sc.score_2k"
      ),
      [studentId, year, semester],
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should reject with error on failure", async () => {
    const error = "Error 4";

    mockExecuteSql.mockImplementationOnce((_, __, success) => {
      success(null, { rows: { _array: [] } });
    });

    await expect(database.getGrades(studentId, year, semester)).rejects.toEqual(
      error
    );
    expect(mockExecuteSql).toHaveBeenLastCalledWith(
      expect.stringContaining(
        "SELECT s.subject_name, g.grade, sc.score_1k, sc.score_2k"
      ),
      [studentId, year, semester],
      expect.any(Function),
      expect.any(Function)
    );
  });
});
