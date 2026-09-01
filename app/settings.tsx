import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCalorieGoal, setCalorieGoal } from "../utils/settingsStorage";

export default function SettingsScreen() {
  const [goal, setGoal] = useState("2000");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCalorieGoal().then((g) => {
      setGoal(String(g));
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    const parsed = Number(goal);
    if (!parsed || parsed <= 0) return;

    setSaving(true);
    try {
      await setCalorieGoal(parsed);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={22} color="#F5F5F2" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.label}>Daily calorie goal</Text>

          {loading ? (
            <ActivityIndicator color="#B8D7A8" />
          ) : (
            <TextInput
              style={styles.input}
              value={goal}
              onChangeText={setGoal}
              keyboardType="numeric"
              placeholder="2000"
              placeholderTextColor="#686B64"
            />
          )}

          <Pressable
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving || loading}
          >
            {saving ? (
              <ActivityIndicator color="#0B110D" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B110D" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: "600", color: "#F5F5F2" },
  content: { paddingHorizontal: 20, marginTop: 20 },
  label: { fontSize: 14, color: "#92958D", marginBottom: 8 },
  input: {
    backgroundColor: "#1A1C19",
    borderRadius: 14,
    padding: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#F5F5F2",
  },
  saveButton: {
    backgroundColor: "#B8D7A8",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#0B110D", fontWeight: "700", fontSize: 15 },
});