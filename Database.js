import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase(
  "myDatabase.db",
  undefined,
  (error) => {
    console.log("Failed to open database:", error);
  },
  () => {
    console.log("Database opened successfully");
  }
);

class Database {
  constructor() {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Students (
        student_id INTEGER PRIMARY KEY,
        full_name TEXT NOT NULL,
        group_name TEXT NOT NULL,
        faculty TEXT NOT NULL
      );`
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Scores (
        score_id INTEGER PRIMARY KEY,
        student_id INTEGER,
        score_1k INTEGER,
        score_2k INTEGER,
        FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
      );`
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Grades (
        grade_id INTEGER PRIMARY KEY,
        student_id INTEGER,
        grade INTEGER NOT NULL,
        year INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE
      );`
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Subjects (
        subject_id INTEGER PRIMARY KEY,
        subject_name TEXT NOT NULL,
        semester TEXT NOT NULL
      );`
      );
      tx.executeSql(
        `INSERT INTO Students (student_id, full_name, group_name, faculty)
        VALUES (1, "John Doe", "Group 1", "Faculty 1"),
               (2, "Jane Smith", "Group 2", "Faculty 2");`
      );
      tx.executeSql(
        `INSERT INTO Scores (score_id, student_id, score_1k, score_2k)
        VALUES (1, 1, 80, 85),
               (2, 2, 90, 95);`
      );
      tx.executeSql(
        `INSERT INTO Subjects (subject_id, subject_name, semester)
         VALUES (1, "Math", "Весна"),
        (2, "English", "Осень");`
      );
      tx.executeSql(
        `INSERT INTO Grades (grade_id, student_id, grade, year, subject_id)
        VALUES (1, 1, 4, 2022, 1),
               (2, 1, 5, 2021, 2),
               (3, 2, 5, 2022, 1),
               (4, 2, 3, 2021, 2);`
      );
    });
  }

  getGrades(studentId, year, semester) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        console.log("Query parameters:", studentId, year, semester);
        tx.executeSql(
          "SELECT s.subject_name, g.grade, g.year FROM grades g INNER JOIN subjects s ON g.subject_id = s.subject_id WHERE g.student_id = ? AND g.year = ? AND s.semester = ?",
          [studentId, year, semester],
          (_, { rows: { _array } }) => {
            console.log("Grades:", _array);
            if (_array.length === 0) {
              reject("No data found in the database.");
            } else {
              resolve(_array);
            }
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }
}

export default Database;
