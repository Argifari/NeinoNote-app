import AddNoteIcon from "@/assets/images/addNote.svg";

import { COLORS, FONT_SIZES, FONTS, RADIUS, SPACING } from "@/constants/theme";
import {
  addNote,
  addProject,
  addTask,
  data,
  deleteNotes,
  deleteProject,
  deleteTask,
  getHomeData,
  Project,
  updateDoneStatus,
} from "@/database/taskQueries";
import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddIcon from "@/assets/images/addIcon.svg";
import { NoteCard } from "@/components/NoteCard";
import { NoteFormModal } from "@/components/NoteFormModal";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFormModal } from "@/components/ProjectFormModal";
import { TaskCard } from "@/components/TaskCard";
import { TaskFormModal } from "@/components/TaskFormModal";
SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [isProjectModalVisible, setProjectModalVisible] = useState(false);
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);

  const muatDataBeranda = () => {
    const hasil: data = getHomeData();

    setProjects(hasil?.project || []);
    setTasks(hasil?.tasks || []);
  };

  useEffect(() => {
    if (fontsLoaded) {
      muatDataBeranda();
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // handle tugas
  const handleToggleTask = (id: number, currentStatus: number) => {
    const statusBaru = currentStatus === 0 ? 1 : 0;

    const berhasil = updateDoneStatus(id, statusBaru);
    if (berhasil) {
      muatDataBeranda();
    }
  };

  const handleDeleteTask = (id: number) => {
    deleteTask(id);
    muatDataBeranda();
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
    muatDataBeranda();
    console.log("Berhasil Id :", idBaru);
  };

  // handler project
  const handleSimpanProject = (judul: string) => {
    const berhasil = addProject(judul);

    if (berhasil != null) {
      setTaskModalVisible(false);
      muatDataBeranda();
    }
  };

  const handlePressProject = (id: number, projectTitle: string) => {
    console.log(`Pindah ke folder: ${projectTitle}`);
  };

  const handleDeleteFolder = (id: number) => {
    deleteProject(id);
    muatDataBeranda();
  };

  const handleSimpanNote = (
    noteTitle: string,
    noteText: string,
    project_id: number | null,
  ) => {
    const idBaru = addNote(noteTitle, noteText, project_id);
    if (idBaru != null) {
      setNoteModalVisible(false);
      muatDataBeranda();
    }
  };

  const handleDeleteNote = (id: number) => {
    deleteNotes(id);
    muatDataBeranda();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*Header*/}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NEINO</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsHorizontalScrollIndicator={false}>
        {/** Seksi 1: URGENT TASK (Tugas di Root)*/}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Urgent Tasks</Text>
              <TouchableOpacity
                onPress={() => {
                  setTaskModalVisible(true);
                }}
              >
                <AddIcon width={20} height={20} />
              </TouchableOpacity>
            </View>
            <Text style={styles.activeCount}>
              {(tasks || []).filter((t) => t.doneStatus === 0).length} Active
            </Text>
          </View>
          {!tasks || tasks.length === 0 ? (
            <Text
              style={{
                color: COLORS.gray,
                marginTop: 10,
                fontFamily: FONTS.regular,
              }}
            >
              Tidak ada tugas di root.
            </Text>
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
        {/**SEKSI 2: PROJECTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Projects</Text>
              <TouchableOpacity onPress={() => setProjectModalVisible(true)}>
                <AddIcon width={20} height={20} />
              </TouchableOpacity>
            </View>
          </View>
          {projects.length === 0 ? (
            <Text
              style={{
                color: COLORS.gray,
                marginTop: 10,
                fontFamily: FONTS.regular,
              }}
            >
              Belum ada folder project
            </Text>
          ) : (
            projects.map((projek) => (
              <ProjectCard
                key={projek.id}
                folder={projek}
                onPress={handlePressProject}
                onDelete={handleDeleteFolder}
              />
            ))
          )}
        </View>
        {/** SEKSI 3: SHORTCUTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shortcuts</Text>
          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() => setNoteModalVisible(true)}
          >
            <AddNoteIcon height={20} width={20} />
            <Text style={styles.shortcutText}>+ New Note</Text>
          </TouchableOpacity>
        </View>
        {/** SEKSI 4: RECENT NOTES */}
        {notes && notes.length > 0 && (
          <View style={[styles.section, { paddingBottom: 40 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Notes</Text>
            </View>
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPress={handlePressProject}
                onDelete={handleDeleteNote}
              />
            ))}
          </View>
        )}
      </ScrollView>
      {/* RENDER MODAL */}
      <TaskFormModal
        visible={isTaskModalVisible}
        projectList={projects}
        projectId={null}
        onClose={() => setTaskModalVisible(false)}
        onSave={handleSimpanTugas}
      />

      <ProjectFormModal
        visible={isProjectModalVisible}
        onClose={() => setProjectModalVisible(false)}
        onSave={handleSimpanProject}
      />
      <NoteFormModal
        visible={isNoteModalVisible}
        projectId={null}
        projectList={projects}
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
  headerTitle: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.large,
    letterSpacing: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    color: COLORS.neutral,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.large,
  },
  activeCount: {
    color: "#ff8888",
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.small,
  },
  taskCard: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.round,
    padding: SPACING.medium,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  taskStatus: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 4,
  },
  taskTitle: {
    color: COLORS.neutral,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.medium,
  },
  projectCard: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.round,
    padding: SPACING.medium,
    marginBottom: 12,
  },
  tagBadge: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  tagText: {
    color: "#000000",
    fontFamily: FONTS.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  projectTitle: {
    color: COLORS.neutral,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.large,
    marginBottom: 4,
  },
  shortcutCard: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.round,
    padding: SPACING.large,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  shortcutText: {
    color: COLORS.neutral,
    fontFamily: FONTS.regular,
    marginTop: 8,
  },
});
