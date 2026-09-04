import {
    addNote,
    addTask,
    data,
    deleteNotes,
    deleteTask,
    getDataInProject,
    updateDoneStatus,
} from "@/database/taskQueries";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const folderId = Number(id);

  const [folderName, setFolderName] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);

  const muatDataFolder = () => {
    const hasil: data = getDataInProject(folderId);

    setTasks(hasil?.tasks || []);
    setNotes(hasil?.notes || []);
  };

  useEffect(() => {
    muatDataFolder();
  }, [folderId]);

  // handle tugas
  const handleToggleTask = (id: number, currentStatus: number) => {
    const statusBaru = currentStatus === 0 ? 1 : 0;

    const berhasil = updateDoneStatus(id, statusBaru);
    if (berhasil) {
      muatDataFolder();
    }
  };

  const handleDeleteTask = (id: number) => {
    deleteTask(id);
    muatDataFolder();
  };

  const handleSimpanTugas = (
    judul: string,
    tags: string[],
    tenggat: string,
    projek_id: number | null,
  ) => {
    const idBaru = addTask(judul, tags, tenggat, projek_id);

    // Langsung tutup modal dan muat ulang data
    setTaskModalVisible(false);
    muatDataFolder();
    console.log("Berhasil Id :", idBaru);
  };
  const handleSimpanNote = (
    noteTitle: string,
    noteText: string,
    project_id: number | null,
  ) => {
    const idBaru = addNote(noteTitle, noteText, project_id);
    if (idBaru != null) {
      setNoteModalVisible(false);
      muatDataFolder();
    }
  };

  const handleDeleteNote = (id: number) => {
    deleteNotes(id);
    muatDataFolder();
  };

  return 0;
}
