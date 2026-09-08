import AddIcon from "@/assets/images/addIcon.svg";
import {
  addNote,
  addTask,
  data,
  deleteNotes,
  deleteTask,
  getDataInProject,
  updateDoneStatus,
} from "@/database/taskQueries";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NoteCard } from "@/components/NoteCard";
import { NoteFormModal } from "@/components/NoteFormModal";
import { TaskCard } from "@/components/TaskCard";
import { TaskFormModal } from "@/components/TaskFormModal";
import { COLORS, FONTS, FONT_SIZES, SPACING } from "@/constants/theme";

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

    setFolderName(hasil.project[0]?.projectTitle ?? "");
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

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>{" < back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{folderName}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView>
        {/** SECTION TASK */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Folder Text</Text>
            <TouchableOpacity onPress={() => setTaskModalVisible(true)}>
              <AddIcon width={20} height={20} />
            </TouchableOpacity>

            {tasks.length === 0 ? (
              <Text style={styles.emptyText}>none</Text>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </View>

          {/**SECTION NOTES */}
          <View style={(styles.section, { paddingBottom: 40 })}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Folder Notes</Text>
              <TouchableOpacity onPress={() => setNoteModalVisible(true)}>
                <AddIcon width={20} height={20} />
              </TouchableOpacity>
              {notes.length === 0 ? (
                <Text style={styles.emptyText}>None</Text>
              ) : (
                notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onPress={() => console.log("Masuk ke note :", note.id)}
                    onDelete={handleDeleteNote}
                  />
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/**MODAL */}
      <TaskFormModal
        visible={isTaskModalVisible}
        projectId={folderId}
        projectList={[{ id: folderId, projectTitle: folderName }]}
        onClose={() => setTaskModalVisible(false)}
        onSave={handleSimpanTugas}
      />
      <NoteFormModal
        visible={isNoteModalVisible}
        projectId={folderId}
        projectList={[{ id: folderId, projectTitle: folderName }]}
        onClose={() => setNoteModalVisible(false)}
        onSave={handleSimpanNote}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.large,
  },
  backButton: { padding: 8, marginLeft: -8 },
  backText: {
    color: COLORS.gray,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.medium,
  },
  headerTitle: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.large,
  },
  section: { marginTop: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.neutral,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.large,
  },
  emptyText: { color: COLORS.gray, marginTop: 10, fontFamily: FONTS.regular },
});
