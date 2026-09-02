import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/constants/theme";
import { Project } from "@/database/taskQueries";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface NoteFormModalProps {
  projectId?: number | null; // 1. Tambahan prop agar modal tahu ia dibuka di mana
  projectList?: Project[];
  visible: boolean;
  onClose: () => void;
  onSave: (
    noteTitle: string,
    noteText: string,
    projectId: number | null,
  ) => void;
}

export function NoteFormModal({
  projectId = null,
  projectList = [],
  visible,
  onClose,
  onSave,
}: NoteFormModalProps) {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | null>(
    projectId,
  );

  useEffect(() => {
    if (visible) {
      setNoteText("");
      setNoteTitle("");
      setSelectedProject(projectId);
    }
  }, [visible]);

  const handleSimpan = () => {
    if (noteTitle.trim() === "" || noteText.trim() === "") return;
    onSave(noteTitle, noteText, selectedProject);
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <Pressable style={styles.modalContent}>
            <View>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>New Note</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text
                    style={{
                      color: COLORS.neutral,
                      fontSize: FONT_SIZES.large,
                    }}
                  >
                    X
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.inputForm}
                placeholder="Note Title"
                placeholderTextColor="#555"
                value={noteTitle}
                onChangeText={setNoteTitle}
              />
              <TextInput
                style={[
                  styles.inputForm,
                  { height: 120, textAlignVertical: "top" },
                ]}
                placeholder="Typing . . ."
                placeholderTextColor="#555"
                value={noteText}
                onChangeText={setNoteText}
                multiline={true}
              />
              {/** List Pilihan Folder */}
              <Text style={styles.labelSection}>Save to Folder:</Text>
              <View style={styles.folderListContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: SPACING.large }}
                >
                  <TouchableOpacity
                    style={[
                      styles.folderChip,
                      selectedProject === null && styles.folderChipActive,
                    ]}
                    onPress={() => setSelectedProject(null)}
                  >
                    <Text
                      style={[
                        styles.folderChipText,
                        selectedProject === null && styles.folderChipTextActive,
                      ]}
                    >
                      / (Root)
                    </Text>
                  </TouchableOpacity>
                  {projectList.map((project) => (
                    <TouchableOpacity
                      key={project.id}
                      style={[
                        styles.folderChip,
                        selectedProject === project.id &&
                          styles.folderChipActive,
                      ]}
                      onPress={() => setSelectedProject(project.id)}
                    >
                      <Text
                        style={[
                          styles.folderChipText,
                          selectedProject === project.id &&
                            styles.folderChipActive,
                        ]}
                      >
                        {project.projectTitle}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <TouchableOpacity
                style={[
                  styles.btnSimpan,
                  (noteTitle.trim() === "" || noteText.trim() === "") &&
                    styles.btnSimpanDisable,
                ]}
                onPress={handleSimpan}
                disabled={noteTitle.trim() === "" || noteText.trim() === ""}
              >
                <Text style={styles.btnSimpanText}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.round * 2,
    borderTopRightRadius: RADIUS.round * 2,
    padding: SPACING.large,
    paddingBottom: 40,
    borderTopWidth: 2,
    borderColor: COLORS.secondary,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.large,
  },
  modalTitle: { color: COLORS.neutral, fontSize: 16, fontFamily: FONTS.bold },
  inputForm: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.round,
    padding: SPACING.medium,
    color: COLORS.neutral,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.large,
    marginBottom: SPACING.large,
  },
  btnSimpan: {
    backgroundColor: COLORS.primary,
    padding: SPACING.medium,
    borderRadius: RADIUS.round,
    alignItems: "center",
  },
  btnSimpanDisable: { backgroundColor: "#333" },
  btnSimpanText: {
    color: "#000",
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.large,
  },

  // GAYA BARU UNTUK FOLDER CHIPS
  labelSection: {
    color: COLORS.neutral,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.small,
    marginBottom: 8,
    marginLeft: 4,
  },
  folderListContainer: {
    height: 45,
    marginBottom: SPACING.large,
  },
  folderChip: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.round,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  folderChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  folderChipText: {
    color: COLORS.neutral,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.medium,
  },
  folderChipTextActive: {
    color: "#000",
    fontFamily: FONTS.bold,
  },
});
