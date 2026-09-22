import {
    addNote,
    addProject,
    addTask,
    deleteNote,
    deleteProject,
    deleteTask,
    getAllNotes,
    getAllProjects,
    getAllTasks,
    getFolderData,
    updateDoneStatus,
    updateNote,
} from "@/database/taskQueries";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

export function useTaskManager(projectId: number | null = null) {
  const router = useRouter();

  // Data States
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [folderName, setFolderName] = useState<string>("");

  // Modal States
  const [isProjectModalVisible, setProjectModalVisible] = useState(false);
  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<any | null>(null);

  // Fungsi Refresh Data (Otomatis menyesuaikan Beranda vs Folder)
  const refreshData = useCallback(() => {
    if (projectId !== null) {
      // Data untuk Halaman Detail Folder
      const data = getFolderData(projectId);
      if (data) {
        setFolderName(data.project?.projectTitle || "Folder");
        setTasks(data.tasks || []);
        setNotes(data.notes || []);
      }
    } else {
      // Data untuk Halaman Beranda
      setProjects(getAllProjects());
      setTasks(getAllTasks());
      setNotes(getAllNotes());
    }
  }, [projectId]);

  // --- HANDLER Projek (PROJECT) ---
  const handleSimpanProject = (judul: string) => {
    const berhasil = addProject(judul);

    if (berhasil != null) {
      setTaskModalVisible(false);
      refreshData();
    }
  };
  const handlePressProject = (id: number, projectTitle: string) => {
    router.push(`./project/${id}`);
  };

  const handleDeleteFolder = (id: number) => {
    deleteProject(id);
    refreshData();
  };

  // --- HANDLER TUGAS (TASK) ---
  const handleToggleTask = (taskId: number, currentStatus: number) => {
    updateDoneStatus(taskId, currentStatus === 0 ? 1 : 0);
    refreshData();
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTask(taskId);
    refreshData();
  };

  const handleSimpanTugas = (
    judul: string,
    tags: string[],
    tenggat: string,
    pid: number | null,
  ) => {
    addTask(judul, tags, tenggat, pid ?? projectId);
    setTaskModalVisible(false);
    refreshData();
  };

  // --- HANDLER CATATAN (NOTE) ---
  const handlePressNote = (note: any) => {
    setEditingNote(note);
    setNoteModalVisible(true);
  };

  const handleDeleteNote = (noteId: number) => {
    deleteNote(noteId);
    refreshData();
  };

  const handleSimpanNote = (
    judul: string,
    teks: string,
    pid: number | null,
    id?: number,
  ) => {
    if (id) {
      updateNote(id, judul, teks, pid ?? projectId);
    } else {
      addNote(judul, teks, pid ?? projectId);
    }
    setEditingNote(null);
    setNoteModalVisible(false);
    refreshData();
  };

  const handleCloseNoteModal = () => {
    setEditingNote(null);
    setNoteModalVisible(false);
  };

  return {
    // States
    tasks,
    notes,
    projects,
    folderName,
    isProjectModalVisible,
    isTaskModalVisible,
    isNoteModalVisible,
    editingNote,

    // Modal Setters
    setProjectModalVisible,
    setTaskModalVisible,
    setNoteModalVisible,
    handleCloseNoteModal,

    // Handlers
    refreshData,
    handleSimpanProject,
    handlePressProject,
    handleDeleteFolder,
    handleToggleTask,
    handleDeleteTask,
    handleSimpanTugas,
    handlePressNote,
    handleDeleteNote,
    handleSimpanNote,
  };
}
