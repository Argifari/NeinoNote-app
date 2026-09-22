import { db } from "./initDb";

export interface Project {
  id: number;
  projectTitle: string;
}

export interface Task {
  id: number;
  taskTitle: string;
  tags: string[];
  deadline: string;
  doneStatus: number;
}

export interface note {
  id: number;
  noteTitle: string;
  noteText: string;
}

export interface data {
  project: Project[];
  tasks: Task[];
  notes: note[];
}
/* ==========================================================================
   PROJECT / FOLDER QUERIES
   ========================================================================== */

export function getAllProjects() {
  try {
    return db.getAllSync<any>(`
      SELECT p.*, COUNT(t.id) AS task_count
      FROM project p
      LEFT JOIN tasks t ON p.id = t.project_id
      GROUP BY p.id
      ORDER BY p.id DESC
    `);
  } catch (error) {
    console.error("Gagal mengambil daftar folder:", error);
    return [];
  }
}

export function getFolderData(projectId: number) {
  try {
    const data: { project: any; tasks: any[]; notes: any[] } = {
      project: null,
      tasks: [],
      notes: [],
    };

    // 1. Ambil info folder
    data.project = db.getFirstSync<any>("SELECT * FROM project WHERE id = ?", [
      projectId,
    ]);

    // 2. Ambil tugas dalam folder ini
    const rawTasks = db.getAllSync<any>(
      "SELECT * FROM tasks WHERE project_id = ? ORDER BY isDone ASC, deadline ASC",
      [projectId],
    );

    data.tasks = rawTasks.map((row) => {
      let parseTags: string[] = [];
      try {
        if (row.tags) parseTags = JSON.parse(row.tags);
      } catch (e) {}
      return {
        ...row,
        tags: parseTags,
      };
    });

    // 3. Ambil catatan dalam folder ini
    data.notes = db.getAllSync<any>(
      "SELECT * FROM notes WHERE project_id = ? ORDER BY id DESC",
      [projectId],
    );

    return data;
  } catch (error) {
    console.error("Gagal mengambil data folder:", error);
    return null;
  }
}

export function addProject(projectTitle: string) {
  try {
    db.runSync("INSERT INTO project (projectTitle) VALUES (?)", [projectTitle]);
    return true;
  } catch (error) {
    console.error("Gagal menambahkan folder:", error);
    return false;
  }
}

export function deleteProject(id: number) {
  try {
    db.runSync("DELETE FROM project WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("Gagal menghapus folder:", error);
    return false;
  }
}

/* ==========================================================================
   TASK QUERIES
   ========================================================================== */

export function getAllTasks() {
  try {
    const rawTasks = db.getAllSync<any>(
      "SELECT * FROM tasks ORDER BY isDone ASC, deadline ASC",
    );

    return rawTasks.map((row) => {
      let parseTags: string[] = [];
      try {
        if (row.tags) parseTags = JSON.parse(row.tags);
      } catch (e) {}
      return {
        ...row,
        tags: parseTags,
      };
    });
  } catch (error) {
    console.error("Gagal mengambil semua tugas:", error);
    return [];
  }
}

export function addTask(
  title: string,
  tags: string[],
  deadline: string,
  project_id: number | null,
) {
  try {
    const tagsJson = JSON.stringify(tags || []);
    db.runSync(
      "INSERT INTO tasks (title, tags, deadline, isDone, project_id) VALUES (?, ?, ?, 0, ?)",
      [title, tagsJson, deadline, project_id],
    );
    return true;
  } catch (error) {
    console.error("Gagal menambahkan tugas:", error);
    return false;
  }
}

export function updateDoneStatus(id: number, isDone: number) {
  try {
    db.runSync("UPDATE tasks SET isDone = ? WHERE id = ?", [isDone, id]);
    return true;
  } catch (error) {
    console.error("Gagal memperbarui status tugas:", error);
    return false;
  }
}

export function deleteTask(id: number) {
  try {
    db.runSync("DELETE FROM tasks WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("Gagal menghapus tugas:", error);
    return false;
  }
}

/* ==========================================================================
   NOTE QUERIES
   ========================================================================== */

export function getAllNotes() {
  try {
    return db.getAllSync<any>("SELECT * FROM notes ORDER BY id DESC");
  } catch (error) {
    console.error("Gagal mengambil semua catatan:", error);
    return [];
  }
}

export function addNote(
  noteTitle: string,
  noteText: string,
  project_id: number | null,
) {
  try {
    db.runSync(
      "INSERT INTO notes (noteTitle, noteText, project_id) VALUES (?, ?, ?)",
      [noteTitle, noteText, project_id],
    );
    return true;
  } catch (error) {
    console.error("Gagal menambahkan catatan:", error);
    return false;
  }
}

export function updateNote(
  id: number,
  noteTitle: string,
  noteText: string,
  project_id: number | null,
) {
  try {
    db.runSync(
      "UPDATE notes SET noteTitle = ?, noteText = ?, project_id = ? WHERE id = ?",
      [noteTitle, noteText, project_id, id],
    );
    return true;
  } catch (error) {
    console.error("Gagal memperbarui catatan:", error);
    return false;
  }
}

export function deleteNote(id: number) {
  try {
    db.runSync("DELETE FROM notes WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("Gagal menghapus catatan:", error);
    return false;
  }
}
