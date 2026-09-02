import { COLORS, FONT_SIZES, FONTS, RADIUS, SPACING } from "@/constants/theme";
import { note } from "@/database/taskQueries";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
interface NoteCardProps {
  note: note;
  onPress: (id: number, namaFolder: string) => void;
  onDelete: (id: number) => void;
}

export function NoteCard({ note, onPress, onDelete }: NoteCardProps) {
  const handleLongPress = () => {
    Alert.alert(
      "Hapus Folder",
      `Apakah kamu yakin ingin menghapus Note "${note.noteTitle}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => onDelete(note.id),
        },
      ],
    );
  };
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(note.id, note.noteTitle)}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <Text style={styles.title}>{note.noteTitle}</Text>
      <Text style={styles.text} numberOfLines={3}>
        {note.noteText}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    padding: SPACING.medium,
    marginBottom: 12,
  },
  title: {
    color: COLORS.neutral,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.large,
    marginBottom: 8,
  },
  text: {
    color: COLORS.gray,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.medium,
    lineHeight: 20,
  },
});
