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

export function getHomeData(): data {
  try {
    const homeData: data = { project: [], tasks: [], notes: [] };
    const folderProject = db.getAllSync<{
      id: number;
      projectTitle: string;
    }>("SELECT * FROM project");
    const rootTasks = db.getAllSync<{
      id: number;
      taskTitle: string;
      tags: string;
      deadline: string;
      doneStatus: number;
    }>("SELECT * FROM tasks WHERE project_id IS NULL ORDER BY deadline ASC");

    const rootNotes = db.getAllSync<{
      id: number;
      noteTitle: string;
      noteText: string;
    }>("SELECT * FROM notes WHERE project_id IS NULL ORDER BY id DESC");

    folderProject.forEach((row) => {
      homeData.project.push({
        id: row.id,
        projectTitle: row.projectTitle,
      });
    });
    rootTasks.forEach((row) => {
      let parseTags: string[] = [];
      try {
        if (row.tags) {
          parseTags = JSON.parse(row.tags);
        }
      } catch (error) {
        console.error(
          "Gagal melakukan parse tag pada tugas ID",
          row.id,
          " :",
          error,
        );
      }

      homeData.tasks.push({
        id: row.id,
        taskTitle: row.taskTitle,
        tags: parseTags,
        deadline: row.deadline,
        doneStatus: row.doneStatus,
      });
    });

    rootNotes.forEach((row) => {
      homeData.notes.push({
        id: row.id,
        noteTitle: row.noteTitle,
        noteText: row.noteText,
      });
    });
    return homeData;
  } catch (error) {
    console.error("Gagal mengambil isi beranda:", error);
    return { project: [], tasks: [], notes: [] };
  }
}

export function getDataInProject(idProjek: number): data {
  try {
    const dataProject: data = { project: [], tasks: [], notes: [] };
    const tasks = db.getAllSync<{
      id: number;
      taskTitle: string;
      tags: string;
      deadline: string;
      doneStatus: number;
    }>("SELECT * FROM tasks WHERE project_id = ? ORDER BY deadline ASC", [
      idProjek,
    ]);
    const notes = db.getAllSync<{
      id: number;
      noteTitle: string;
      noteText: string;
    }>("SELECT * FROM notes WHERE project_id = ? ORDER BY id DESC", [idProjek]);

    tasks.forEach((row) => {
      let parseTags: string[] = [];
      try {
        if (row.tags) {
          parseTags = JSON.parse(row.tags);
        }
      } catch (error) {
        console.error(
          "Gagal melakukan parse tag pada tugas ID",
          row.id,
          " :",
          error,
        );
      }

      dataProject.tasks.push({
        id: row.id,
        taskTitle: row.taskTitle,
        tags: parseTags,
        deadline: row.deadline,
        doneStatus: row.doneStatus,
      });
    });
    notes.forEach((row) => {
      dataProject.notes.push({
        id: row.id,
        noteTitle: row.noteTitle,
        noteText: row.noteText,
      });
    });

    return dataProject;
  } catch (error) {
    console.error("Gagal mengambil isi projek:", error);
    return { project: [], tasks: [], notes: [] };
  }
}

// Di dalam file taskQueries.ts
export function addTask(
  title: string,
  array_tags: string[],
  deadline: string,
  project_id: number | null,
): number | null {
  const textTags = JSON.stringify(array_tags);
  try {
    let idBaru = 0;
    db.withTransactionSync(() => {
      const hasil = db.runSync(
        "INSERT INTO tasks (taskTitle, tags, deadline, project_id) VALUES (?, ?, ?, ?)",
        [title, textTags, deadline, project_id],
      );
      idBaru = hasil.lastInsertRowId;
    });
    return idBaru;
  } catch (error) {
    // 🔴 TAMBAHKAN BARIS INI UNTUK MELIHAT PENYEBAB ASLINYA
    console.error("Gagal menambahkan tugas ke SQLite:", error);
    return null;
  }
}

export function addProject(title: string): number | null {
  try {
    let idBaru = 0;
    db.withTransactionSync(() => {
      const hasil = db.runSync(
        "INSERT INTO project (projectTitle) VALUES (?)",
        [title],
      );
      idBaru = hasil.lastInsertRowId;
    });
    return idBaru;
  } catch (error) {
    return null;
  }
}

export function addNote(
  noteTitle: string,
  noteText: string,
  projectId: number | null,
): number | null {
  try {
    let idBaru = 0;
    db.withTransactionSync(() => {
      const hasil = db.runSync(
        "INSERT INTO notes (noteTitle, noteText, project_id) VALUES (?, ?, ?)",
        [noteTitle, noteText, projectId],
      );
      idBaru = hasil.lastInsertRowId;
    });
    return idBaru;
  } catch (error) {
    return null;
  }
}

export function getTask(): Task[] {
  const cleanData: Task[] = [];

  try {
    const hasil = db.getAllSync<{
      id: number;
      taskTitle: string;
      tags: string;
      deadline: string;
      doneStatus: number;
    }>("SELECT * FROM tasks ORDER BY deadline ASC");

    hasil.forEach((row) => {
      let parseTags: string[] = [];
      try {
        if (row.tags) {
          parseTags = JSON.parse(row.tags);
        }
      } catch (error) {
        console.error(
          "Gagal melakukan parse tag pada tugas ID",
          row.id,
          " :",
          error,
        );
      }

      cleanData.push({
        id: row.id,
        taskTitle: row.taskTitle,
        tags: parseTags,
        deadline: row.deadline,
        doneStatus: row.doneStatus,
      });
    });

    return cleanData;
  } catch (error) {
    console.error("Gagal mengambil tugas :", error);
    return [];
  }
}

export function updateDoneStatus(id: number, newStatus: number): boolean {
  try {
    db.withTransactionSync(() => {
      const update = db.runSync(
        "UPDATE tasks SET doneStatus = ? WHERE id = ?",
        [newStatus, id],
      );
    });
    console.log(`Berhasil : Status Task ID ${id} diubah menjadi ${newStatus}`);
    return true;
  } catch (error) {
    console.error(`Gagal memperbarui status Task ID ${id}:`, error);
    return false;
  }
}

export function deleteTask(id: number): boolean {
  try {
    db.runSync("DELETE FROM tasks WHERE id = ?", [id]);
    console.log(`Berhasil : Task ID ${id} dihapus`);
    return true;
  } catch (error) {
    console.error(`Gagal menghapus Task ID ${id} :`, error);
    return false;
  }
}

export function deleteNotes(id: number): boolean {
  try {
    db.runSync("DELETE FROM note WHERE id = ?", [id]);
    console.log(`Berhasil : Note ID ${id} dihapus`);
    return true;
  } catch (error) {
    console.error(`Gagal menghapus note ID ${id} :`, error);
    return false;
  }
}

export function deleteProject(id: number): boolean {
  try {
    db.runSync("DELETE FROM project WHERE id = ?", [id]);
    console.log(`Berhasil : Folder ID ${id} dihapus`);
    return true;
  } catch (error) {
    console.error(`Gagal menghapus Folder ID ${id} :`, error);
    return false;
  }
}
