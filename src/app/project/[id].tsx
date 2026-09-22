import AddIcon from "@/assets/images/addIcon.svg";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
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
import { useTaskManager } from "@/hooks/useTaskManager";

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const folderId = Number(id);

  const {
    tasks,
    notes,
    folderName,
    isTaskModalVisible,
    isNoteModalVisible,
    editingNote,
    setTaskModalVisible,
    setNoteModalVisible,
    handleCloseNoteModal,
    refreshData,
    handleToggleTask,
    handleDeleteTask,
    handleSimpanTugas,
    handlePressNote,
    handleDeleteNote,
    handleSimpanNote,
  } = useTaskManager(folderId);

  useEffect(() => {
    refreshData();
  }, [folderId]);

  return (
    <SafeAreaView style={styles.container}>
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

      <ScrollView showsHorizontalScrollIndicator={false}>
        {/** SECTION TASK */}
        <View style={styles.section}>
          <View
            style={[styles.sectionHeader, { justifyContent: "space-between" }]}
          >
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Folder Text</Text>
              <TouchableOpacity onPress={() => setTaskModalVisible(true)}>
                <AddIcon width={20} height={20} />
              </TouchableOpacity>
            </View>
            <Text style={styles.activeCount}>
              {(tasks || []).filter((t) => t.doneStatus === 0).length} Active
            </Text>
          </View>
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

          {/**SECTION NOTES */}
          <View style={(styles.section, { paddingBottom: 40 })}>
            <View style={[styles.sectionHeader, { gap: 8 }]}>
              <Text style={styles.sectionTitle}>Folder Notes</Text>
              <TouchableOpacity onPress={() => setNoteModalVisible(true)}>
                <AddIcon width={20} height={20} />
              </TouchableOpacity>
            </View>
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
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.neutral,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.large,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeCount: {
    color: "#ff8888",
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.small,
  },
  emptyText: { color: COLORS.gray, marginTop: 10, fontFamily: FONTS.regular },
});
