// app/_layout.tsx
import { initiateDatabase } from "@/database/initDb"; // Sesuaikan path-nya
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    // Jalankan pembuatan tabel saat aplikasi pertama kali dibuka
    initiateDatabase();

    // Beri tanda bahwa database sudah siap
    setIsDbReady(true);
  }, []);

  // Cegah aplikasi menampilkan index.tsx sebelum tabel selesai dibuat
  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Memuat Database...</Text>
      </View>
    );
  }

  // Jika sudah siap, tampilkan navigasi
  return <Stack screenOptions={{ headerShown: false }} />;
}
