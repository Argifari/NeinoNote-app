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

import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/constants/theme";
import { Project } from "@/database/taskQueries";
import DateTimePicker from "@react-native-community/datetimepicker";

interface TaskFormModalProps {
  visible: boolean;
    projectId?: number | null; // 1. Tambahan prop agar modal tahu ia dibuka di mana
    projectList?: Project[];
  onClose: () => void;
  onSave: (
    title: string,
    tags: string[],
    deadline: string,
    project_id: number | null,
  ) => void;
}

export function TaskFormModal({
  visible,
  projectId = null, // Set default ke null (Root) jika tidak diisi
  projectList = [],
  onClose,
  onSave,
}: TaskFormModalProps) {
  const [newTitle, setJudulBaru] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [selectedProject, setSelectedProject] = useState<number | null>(
    projectId,
  );

  useEffect(() => {
    if (visible) {
      setJudulBaru("");
      setTagInput("");
      setDeadline(new Date());
      setSelectedProject(projectId);
    }
  }, [visible, projectId]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    // Matikan picker untuk Android, biarkan untuk iOS
    if (Platform.OS !== "ios") {
      setShowPicker(false);
    }

    // Jika user menekan tombol OK/Simpan di kalender
    if (event.type === "set" && selectedDate) {
      setDeadline(selectedDate);
    }
  };

  const formatTanggalTeks = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleSimpan = () => {
    if (newTitle === "") return;

    const tagsArray = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag != "");

    const tenggatWaktu = formatTanggalTeks(deadline);

    onSave(
      newTitle,
      tagsArray.length > 0 ? tagsArray : ["Baru"],
      tenggatWaktu,
      selectedProject, // 2. Perbaikan dari 'projek_idg' menjadi 'projectId' dari props
    );

    setJudulBaru("");
    setTagInput("");
    setDeadline(new Date());
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
                <Text style={styles.modalTitle}>Tugas Baru</Text>
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
                placeholder="Misal: Rapat Evaluasi"
                placeholderTextColor="#555"
                value={newTitle}
                onChangeText={setJudulBaru}
                autoFocus={true}
              />
              <TextInput
                style={styles.inputForm}
                placeholder="Tags (PKM, Urgent)"
                placeholderTextColor="#555"
                value={tagInput}
                onChangeText={setTagInput}
              />
              <Text style={styles.labelSection}>Simpan ke Folder:</Text>
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
                        selectedProject === null && styles.folderChipActive,
                      ]}
                    >
                      / (Root)
                    </Text>
                  </TouchableOpacity>
                  {projectList.map((projek) => (
                    <TouchableOpacity
                      key={projek.id}
                      style={[
                        styles.folderChip,
                        selectedProject === projek.id &&
                          styles.folderChipActive,
                      ]}
                      onPress={() => setSelectedProject(projek.id)}
                    >
                      <Text
                        style={[
                          styles.folderChipText,
                          selectedProject === projek.id &&
                            styles.folderChipTextActive,
                        ]}
                      >
                        {projek.projectTitle}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <TouchableOpacity
                style={styles.inputForm}
                onPress={() => setShowPicker(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={{ color: COLORS.neutral, fontFamily: FONTS.regular }}
                >
                  Tenggat: {formatTanggalTeks(deadline)}
                </Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={deadline}
                  mode="date"
                  display="default"
                  onValueChange={onChangeDate} // 3. Perbaikan dari onValueChange ke onChange
                />
              )}
              <TouchableOpacity
                style={[
                  styles.btnSimpan,
                  newTitle.trim() === "" && styles.btnSimpanDisable,
                ]}
                onPress={handleSimpan}
                disabled={newTitle.trim() === ""}
              >
                <Text style={styles.btnSimpanText}>Simpan Tugas</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ... (Bagian StyleSheet tetap sama persis)
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
  modalTitle: {
    color: COLORS.neutral,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
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
  btnSimpanDisable: {
    backgroundColor: "#333",
  },
  btnSimpanText: {
    color: "#000",
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.large,
  },
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
