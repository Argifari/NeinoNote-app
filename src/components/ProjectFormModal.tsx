import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/constants/theme";

interface ProjectFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
}

export function ProjectFormModal({
  visible,
  onClose,
  onSave,
}: ProjectFormModalProps) {
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (visible) {
      setNewTitle("");
    }
  }, [visible]);

  const handleSimpan = () => {
    if (newTitle === "") return;
    onSave(newTitle);

    setNewTitle("");
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
                <Text style={styles.modalTitle}>New Project</Text>
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
                placeholder="Example : My Project"
                placeholderTextColor="#555"
                value={newTitle}
                onChangeText={setNewTitle}
                autoFocus={true}
              />
              <TouchableOpacity
                style={[
                  styles.btnSimpan,
                  newTitle.trim() === "" && styles.btnSimpanDisable,
                ]}
                onPress={handleSimpan}
                disabled={newTitle.trim() === ""}
              >
                <Text style={styles.btnSimpanText}>Save</Text>
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
