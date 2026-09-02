// src/components/TaskCard.tsx
import CheckIcon from "@/assets/images/check.svg";
import ClockIcon from "@/assets/images/clock.svg";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/constants/theme";
import { Task } from "@/database/taskQueries";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Properti yang diterima oleh komponen ini
interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: number, currentStatus: number) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onToggleStatus, onDelete }: TaskCardProps) {
  const handleLongPress = () => {
    Alert.alert(
      "Hapus Tugas",
      `Apakah kamu yakin ingin menghapus "${task.taskTitle}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => onDelete(task.id),
        },
      ],
    );
  };
  // Logika UI: Jika status selesai (1), beri gaya redup
  const isSelesai = task.doneStatus === 1;

  return (
    <TouchableOpacity
      style={[styles.card, isSelesai && styles.cardSelesai]}
      onPress={() => onToggleStatus(task.id, task.doneStatus)}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      {/* Bagian Kiri: Judul dan Tag */}
      <View style={styles.contentContainer}>
        {!isSelesai ? (
          <Text style={styles.deadlineText}>{task.deadline}</Text>
        ) : (
          <Text style={styles.deadlineTextSelesai}>COMPLETED</Text>
        )}
        <Text style={[styles.title, isSelesai && styles.textSelesai]}>
          {task.taskTitle}
        </Text>
        {task.tags && task.tags.length > 0 && (
          <View style={styles.tagContainer}>
            {task.tags.map((tag, index) => {
              // Logika visual: Tag yang mengandung kata "Revisi" atau "Urgent" berwarna merah
              const isUrgent =
                tag.toLowerCase().includes("revisi") ||
                tag.toLowerCase().includes("urgent");

              return (
                <View
                  key={index}
                  style={[
                    styles.tagPill,
                    isUrgent ? styles.tagPillRed : styles.tagPillGreen,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      isUrgent ? styles.tagTextRed : styles.tagTextGreen,
                    ]}
                  >
                    {tag}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Bagian Kanan: Tombol Checkbox */}
      <View style={[styles.checkbox, isSelesai && styles.checkboxSelesai]}>
        {isSelesai ? (
          <CheckIcon width={28} height={28} />
        ) : (
          <ClockIcon width={28} height={28} />
        )}
      </View>
    </TouchableOpacity>
  );
}

// Gaya (Styling) Neino Dark Mode
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.round,
    padding: SPACING.large,
    marginBottom: SPACING.medium,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSelesai: {
    opacity: 0.5,
    borderWidth: 0, // Aksen hijau jika selesai
  },
  contentContainer: {
    flex: 1,
    paddingRight: SPACING.medium,
  },
  title: {
    color: COLORS.neutral,
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    marginBottom: SPACING.small,
  },
  textSelesai: {
    textDecorationLine: "line-through",
    color: COLORS.gray,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.small,
    marginBottom: SPACING.small,
  },
  tagPill: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.small / 2,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  tagPillGreen: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
    borderColor: COLORS.primary,
  },
  tagPillRed: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderColor: COLORS.secondary,
  },
  tagText: {
    fontSize: FONT_SIZES.small,
    fontWeight: "600",
  },
  tagTextGreen: {
    color: COLORS.primary,
  },
  tagTextRed: {
    color: COLORS.secondary,
  },
  deadlineText: {
    color: COLORS.gray,
    fontSize: FONT_SIZES.medium,
  },
  deadlineTextSelesai: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelesai: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    opacity: 0.5,
  },
  checkIcon: {
    width: 28, // Ukuran sedikit lebih kecil dari lingkaran (28) agar ada jarak
    height: 28,
    resizeMode: "contain",
  },
});
