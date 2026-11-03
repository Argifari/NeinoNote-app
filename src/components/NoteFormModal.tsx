import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/constants/theme";
import { Project } from "@/database/taskQueries";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
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
  noteToEdit?: any | null;
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
  noteToEdit,
  onClose,
  onSave,
}: NoteFormModalProps) {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | null>(
    projectId,
  );
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  // Isi form dengan data yang diedit saat modal terbuka
  useEffect(() => {
    if (visible) {
      if (noteToEdit) {
        setNoteTitle(noteToEdit.noteTitle || "");
        setNoteText(noteToEdit.noteText || "");
        setSelectedProject(noteToEdit.project_id ?? projectId);
      } else {
        setNoteTitle("");
        setNoteText("");
        setSelectedProject(projectId);
      }
      setShowFolderPicker(false);
    }
  }, [visible, noteToEdit, projectId]);

  const applyFormatting = (prefix: string, suffix: string = "") => {
    const { start, end } = selection;

    const before = noteText.substring(0, start);
    const selectedText = noteText.substring(start, end);
    const after = noteText.substring(end);

    const newText = `${before}${prefix}${selectedText}${suffix}${after}`;
    setNoteText(newText);
  };

  const handleSimpan = () => {
    if (noteTitle.trim() === "" || noteText.trim() === "") return;
    onSave(noteTitle, noteText, selectedProject);
  };
  // Mendapatkan nama folder aktif
  const getSelectedFolderName = () => {
    if (selectedProject === null) return "Root Folder";
    const found = projectList.find((p) => p.id === selectedProject);
    return found ? found.projectTitle : "Folder";
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* 1. TOP ACTION BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backText}>‹ Kembali</Text>
          </TouchableOpacity>

          <View style={styles.topRightActions}>
            <TouchableOpacity
              style={[
                styles.btnSimpanHeader,
                !noteTitle.trim() &&
                  !noteText.trim() &&
                  styles.btnSimpanDisabled,
              ]}
              onPress={handleSimpan}
              disabled={!noteTitle.trim() && !noteText.trim()}
            >
              <Text style={styles.btnSimpanText}>
                {noteToEdit ? "Simpan" : "Selesai"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. SUB-HEADER: FOLDER DROPDOWN & METADATA */}
        <View style={styles.subHeader}>
          <TouchableOpacity
            style={styles.folderSelector}
            onPress={() => setShowFolderPicker(!showFolderPicker)}
          >
            <Text style={styles.folderIcon}>📁</Text>
            <Text style={styles.folderName}>{getSelectedFolderName()}</Text>
            <Text style={styles.dropdownArrow}>
              {showFolderPicker ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* INLINE FOLDER PICKER DROPDOWN */}
        {showFolderPicker && (
          <View style={styles.pickerDropdownContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.chipFolder,
                  selectedProject === null && styles.chipFolderActive,
                ]}
                onPress={() => {
                  setSelectedProject(null);
                  setShowFolderPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.chipFolderText,
                    selectedProject === null && styles.chipFolderTextActive,
                  ]}
                >
                  / Root
                </Text>
              </TouchableOpacity>

              {projectList.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.chipFolder,
                    selectedProject === p.id && styles.chipFolderActive,
                  ]}
                  onPress={() => {
                    setSelectedProject(p.id);
                    setShowFolderPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.chipFolderText,
                      selectedProject === p.id && styles.chipFolderTextActive,
                    ]}
                  >
                    {p.projectTitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 3. EDITOR AREA (TITLE & BODY) */}
        <ScrollView
          style={styles.editorScroll}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.titleInput}
            placeholder="Judul Catatan..."
            placeholderTextColor="#444"
            value={noteTitle}
            onChangeText={setNoteTitle}
            multiline={true}
          />

          <TextInput
            style={styles.bodyInput}
            placeholder="Mulai mengetik catatan di sini..."
            placeholderTextColor="#333"
            value={noteText}
            onChangeText={setNoteText}
            multiline={true}
            textAlignVertical="top"
            onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
          />
        </ScrollView>

        {/* 4. FORMATTING TOOLBAR (STICKY BOTTOM) */}

        {/* Header / Sub-judul Markdown (# Teks) */}
        <View style={styles.formattingToolbar}>
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() => applyFormatting("\n#")}
          >
            <Text style={styles.toolTextBold}>T</Text>
          </TouchableOpacity>

          {/**Bullet List (-Text) */}
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() => applyFormatting("\n-")}
          >
            <Text style={styles.toolText}>≔</Text>
          </TouchableOpacity>

          {/**Underline (<u>Teks</u>)*/}
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() => applyFormatting("<u>", "</u>")}
          >
            <Text
              style={[styles.toolText, { textDecorationLine: "underline" }]}
            >
              U
            </Text>

            {/**Italic (*Text*) */}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() => applyFormatting("*", "*")}
          >
            <Text style={[styles.toolText, { fontStyle: "italic" }]}>I</Text>
          </TouchableOpacity>

          {/* Bold (**Text**) */}
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() => applyFormatting("**", "**")}
          >
            <Text style={styles.toolTextBold}>B</Text>
          </TouchableOpacity>

          {/* Strikethrough (~~Text~~) */}
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() => applyFormatting("~~", "~~")}
          >
            <Text
              style={[styles.toolText, { textDecorationLine: "line-through" }]}
            >
              S
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  // Top Bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  backButton: {
    padding: SPACING.small,
  },
  backText: {
    color: COLORS.gray,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.large,
  },
  topRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconActionBtn: {
    padding: 6,
  },
  iconActionText: {
    fontSize: 18,
  },
  btnSimpanHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.round,
  },
  btnSimpanDisabled: {
    backgroundColor: "#222",
  },
  btnSimpanText: {
    color: "#000",
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.medium,
  },
  // Sub Header
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.medium,
    marginVertical: SPACING.small,
  },
  folderSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  folderIcon: {
    fontSize: 14,
  },
  folderName: {
    color: COLORS.neutral,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.small,
  },
  dropdownArrow: {
    color: COLORS.gray,
    fontSize: 10,
  },
  metaIcons: {
    flexDirection: "row",
    gap: 8,
  },
  metaBtn: {
    padding: 4,
  },
  metaIconText: {
    fontSize: 16,
  },
  // Picker Dropdown
  pickerDropdownContainer: {
    paddingHorizontal: SPACING.medium,
    marginBottom: SPACING.small,
  },
  chipFolder: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.round,
    marginRight: 8,
  },
  chipFolderActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipFolderText: {
    color: COLORS.gray,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.small,
  },
  chipFolderTextActive: {
    color: "#000",
    fontFamily: FONTS.bold,
  },
  // Editor
  editorScroll: {
    flex: 1,
    paddingHorizontal: SPACING.large,
    marginTop: SPACING.small,
  },
  titleInput: {
    color: COLORS.neutral,
    fontFamily: FONTS.bold,
    fontSize: 26,
    marginBottom: 16,
    lineHeight: 32,
  },
  bodyInput: {
    color: "#d4d4d8",
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.large,
    lineHeight: 24,
    minHeight: 250,
  },
  // Formatting Toolbar
  formattingToolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#111",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  toolBtn: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 32,
  },
  toolText: {
    color: COLORS.neutral,
    fontSize: 18,
  },
  toolTextBold: {
    color: COLORS.neutral,
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
});
