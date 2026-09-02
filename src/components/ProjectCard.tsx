import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/constants/theme";
import { Project } from "@/database/taskQueries";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
interface FolderCardProps {
  folder: Project;
  onPress: (id: number, namaFolder: string) => void;
  onDelete: (id: number) => void;
}

export function ProjectCard({ folder, onPress, onDelete }: FolderCardProps) {
  const handleLongPress = () => {
    Alert.alert(
      "Hapus Folder",
      `Apakah kamu yakin ingin menghapus folde "${folder.projectTitle}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => onDelete(folder.id),
        },
      ],
    );
  };
  return (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => onPress(folder.id, folder.projectTitle)}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.tagBadge}>
        <Text style={styles.tagText}>FOLDER</Text>
      </View>
      <Text style={styles.projectTitle}>{folder.projectTitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
