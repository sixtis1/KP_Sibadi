import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("myDB.db");

class Database {
  constructor() {
    db.transaction((tx) => {
      tx.executeSql(`
      CREATE TABLE IF NOT EXISTS Students (
        student_id INTEGER PRIMARY KEY,
        full_name TEXT NOT NULL,
        group_name TEXT NOT NULL,
        faculty TEXT NOT NULL
      );
    `);
      tx.executeSql(`
      CREATE TABLE IF NOT EXISTS Years (
        year_id INTEGER PRIMARY KEY,
        year INTEGER NOT NULL
      );
    `);

      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS Semesters (
          semester_id INTEGER PRIMARY KEY,
          semester TEXT NOT NULL
        );
      `);
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS Subjects (
          subject_id INTEGER PRIMARY KEY,
          subject_name TEXT NOT NULL,
          semester_id INTEGER NOT NULL,
          FOREIGN KEY (semester_id) REFERENCES Semesters(semester_id) ON DELETE CASCADE
        );
      `);

      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS Scores (
          score_id INTEGER PRIMARY KEY,
          student_id INTEGER NOT NULL,
          subject_id INTEGER NOT NULL,
          score_1k INTEGER,
          score_2k INTEGER,
          year_id INTEGER NOT NULL,
          semester_id INTEGER NOT NULL,
          FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
          FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
          FOREIGN KEY (year_id) REFERENCES Years(year_id) ON DELETE CASCADE,
          FOREIGN KEY (semester_id) REFERENCES Semesters(semester_id) ON DELETE CASCADE,
          UNIQUE (student_id, subject_id, year_id, semester_id)
        );
      `);

      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS Grades (
          grade_id INTEGER PRIMARY KEY,
          student_id INTEGER NOT NULL,
          subject_id INTEGER NOT NULL,
          grade INTEGER NOT NULL,
          year_id INTEGER NOT NULL,
          semester_id INTEGER NOT NULL,
          FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
          FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
          FOREIGN KEY (year_id) REFERENCES Years(year_id) ON DELETE CASCADE,
          FOREIGN KEY (semester_id) REFERENCES Semesters(semester_id) ON DELETE CASCADE,
          UNIQUE (student_id, subject_id, year_id, semester_id)
        );
      `);

      tx.executeSql(
        `INSERT INTO Students (full_name, group_name, faculty) VALUES
        ('Иванов Иван Иванович', 'Группа 1', 'Факультет информационных технологий'),
        ('Петров Петр Петрович', 'Группа 2', 'Факультет математики и механики'),
        ('Петров Петр Иванович', 'Группа 2', 'Факультет математики и механики');`
      );

      tx.executeSql(`INSERT INTO Years (year) VALUES (2022), (2021), (2020);`);

      tx.executeSql(
        `INSERT INTO Semesters (semester) VALUES ('Весна'), ('Осень');`
      );

      tx.executeSql(`INSERT INTO Subjects (subject_name, semester_id) VALUES
      ('Математика', (SELECT semester_id FROM Semesters WHERE semester = 'Весна')),
      ('Информатика', (SELECT semester_id FROM Semesters WHERE semester = 'Весна')),
      ('Физика', (SELECT semester_id FROM Semesters WHERE semester = 'Осень'));`);

      tx.executeSql(
        `INSERT INTO Scores (student_id, subject_id, score_1k, score_2k, year_id, semester_id)
        VALUES
        (1, 1, 75, 85, (SELECT year_id FROM Years WHERE year = 2022), (SELECT semester_id FROM Semesters WHERE semester = 'Весна')),
        (1, 2, 90, 95, (SELECT year_id FROM Years WHERE year = 2022), (SELECT semester_id FROM Semesters WHERE semester = 'Осень')),
        (2, 1, 80, 75, (SELECT year_id FROM Years WHERE year = 2021), (SELECT semester_id FROM Semesters WHERE semester = 'Осень')),
        (2, 3, 80, 75, (SELECT year_id FROM Years WHERE year = 2021), (SELECT semester_id FROM Semesters WHERE semester = 'Осень')),
        (2, 2, 95, 90, (SELECT year_id FROM Years WHERE year = 2021), (SELECT semester_id FROM Semesters WHERE semester = 'Весна')),
        (3, 1, 95, 90, (SELECT year_id FROM Years WHERE year = 2020), (SELECT semester_id FROM Semesters WHERE semester = 'Весна')),
        (3, 2, 95, 90, (SELECT year_id FROM Years WHERE year = 2020), (SELECT semester_id FROM Semesters WHERE semester = 'Весна'));`
      );

      tx.executeSql(
        `INSERT INTO Grades (student_id, subject_id, grade, year_id, semester_id)
        VALUES
        (1, 1, 5, (SELECT year_id FROM Years WHERE year = 2022), (SELECT semester_id FROM Semesters WHERE semester = 'Весна')),
        (1, 2, 4, (SELECT year_id FROM Years WHERE year = 2022), (SELECT semester_id FROM Semesters WHERE semester = 'Осень')),
        (2, 1, 3, (SELECT year_id FROM Years WHERE year = 2021), (SELECT semester_id FROM Semesters WHERE semester = 'Осень')),
        (2, 3, 3, (SELECT year_id FROM Years WHERE year = 2021), (SELECT semester_id FROM Semesters WHERE semester = 'Осень')),
        (2, 2, 5, (SELECT year_id FROM Years WHERE year = 2021), (SELECT semester_id FROM Semesters WHERE semester = 'Весна')),
        (3, 1, 5, (SELECT year_id FROM Years WHERE year = 2020), (SELECT semester_id FROM Semesters WHERE semester = 'Весна')),
        (3, 2, 5, (SELECT year_id FROM Years WHERE year = 2020), (SELECT semester_id FROM Semesters WHERE semester = 'Весна'));`
      );
    });
  }

  showDB() {
    db.transaction((tx) => {
      tx.executeSql("SELECT student_id FROM Students ", [], (tx, results) => {
        console.log("Студенты:");
        for (let i = 0; i < results.rows.length; i++) {
          console.log(results.rows.item(i).name);
        }
      });
    });
  }

  deleteDatabase() {
    db.transaction(
      (tx) => {
        tx.executeSql("DELETE FROM Students");
        tx.executeSql("DELETE FROM Years");
        tx.executeSql("DELETE FROM Semesters");
        tx.executeSql("DELETE FROM Subjects");
        tx.executeSql("DELETE FROM Scores");
        tx.executeSql("DELETE FROM Grades");
        tx.executeSql("DROP TABLE Students");
        tx.executeSql("DROP TABLE Years");
        tx.executeSql("DROP TABLE Semesters");
        tx.executeSql("DROP TABLE Subjects");
        tx.executeSql("DROP TABLE Scores");
        tx.executeSql("DROP TABLE Grades");
      },
      (error) => {
        console.log("Error deleting database: ", error);
      },
      () => {
        console.log("Database deleted successfully");
      }
    );
  }

  getYears() {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT DISTINCT year FROM Years",
          [],
          (_, { rows: { _array } }) => {
            console.log("Years:", _array);
            if (_array.length === 0) {
              reject("Error 1");
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

  getSubj() {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT DISTINCT subject_name FROM Subjects",
          [],
          (_, { rows: { _array } }) => {
            console.log("Subjects:", _array);
            if (_array.length === 0) {
              reject(" Error 2");
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

  getSemestersForSubject(subject_name) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT DISTINCT Semesters.semester
        FROM Semesters
        JOIN Subjects ON Subjects.semester_id = Semesters.semester_id
        WHERE Subjects.subject_name = ?`,
          [subject_name],
          (_, { rows: { _array } }) => {
            console.log(`Semesters with ${subject_name}:`, _array);
            if (_array.length === 0) {
              reject(`No data found in the database for ${subject_name}.`);
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

  getSemesters() {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT DISTINCT semester FROM Semesters",
          [],
          (_, { rows: { _array } }) => {
            console.log("Semesters:", _array);
            if (_array.length === 0) {
              reject("Error 3");
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
  getGrades(studentId, year, semester) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        console.log("Query parameters:", studentId, year, semester);
        tx.executeSql(
          `SELECT s.subject_name, g.grade, sc.score_1k, sc.score_2k 
          FROM Grades g INNER JOIN Subjects s ON g.subject_id = s.subject_id 
          INNER JOIN Scores sc ON g.student_id = sc.student_id AND g.subject_id = sc.subject_id 
          AND g.year_id = sc.year_id AND g.semester_id = sc.semester_id 
          WHERE g.student_id = ? AND g.year_id = 
          (SELECT year_id FROM Years WHERE year = ?) AND g.semester_id = (SELECT semester_id FROM Semesters WHERE semester = ?)`,
          [studentId, year, semester],
          (_, { rows: { _array } }) => {
            console.log("Grades:", _array);
            if (_array.length === 0) {
              reject("Error 4");
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

  addScoreAndGrade(studentId, subjectName, year, semester, score, grade) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT OR REPLACE INTO Scores (student_id, subject_id, year_id, semester_id, score_1k, score_2k) 
        VALUES (
          ?, 
          (SELECT subject_id FROM Subjects WHERE subject_name = ? AND semester_id = 
            (SELECT semester_id FROM Semesters WHERE semester = ?)), 
          (SELECT year_id FROM Years WHERE year = ?), 
          (SELECT semester_id FROM Semesters WHERE semester = ?), 
          ?,
          ?
        )`,
          [studentId, subjectName, semester, year, semester, score, score],
          (_, result) => {
            tx.executeSql(
              `INSERT OR REPLACE INTO Grades (student_id, subject_id, year_id, semester_id, grade) 
            VALUES (
              ?, 
              (SELECT subject_id FROM Subjects WHERE subject_name = ? AND semester_id = 
                (SELECT semester_id FROM Semesters WHERE semester = ?)), 
              (SELECT year_id FROM Years WHERE year = ?), 
              (SELECT semester_id FROM Semesters WHERE semester = ?), 
              ?
            )`,
              [studentId, subjectName, semester, year, semester, grade],
              (_, result) => {
                resolve(result.insertId);
              },
              (_, error) => {
                reject(error);
              }
            );
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
