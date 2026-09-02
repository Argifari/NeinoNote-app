import * as SQLite from "expo-sqlite";

export let db = SQLite.openDatabaseSync("./neino_local.db");

export function initiateDatabase() {
  try {
    db.withTransactionSync(() => {
      db.runSync(`CREATE TABLE IF NOT EXISTS project(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        projectTitle TEXT NOT NULL
    ); `);
      db.runSync(`CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskTitle TEXT NOT NULL,
        tags TEXT,
        deadline TEXT,
        doneStatus INTEGER DEFAULT 0,
        project_id INTEGER,
        FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE
    ); `);

      db.runSync(`CREATE TABLE IF NOT EXISTS notes(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        noteTitle TEXT NOT NULL,
        noteText TEXT NOT NULL,
        project_id INTEGER,
        FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE
      ); `);
    });
    console.log("Berhasil : Struktur tabel file manager siap");
  } catch (error) {
    console.error("Gagal inisiasi Database :", error);
  }
}
