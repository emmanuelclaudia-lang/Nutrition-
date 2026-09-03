import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
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

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? "http://localhost:8081";

export default function ManualEntryScreen() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<String | null>(null);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/analyze-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const rawText = await res.text();

      if (!res.ok) {
        throw new Error(
          "We couldn't estimate that meal. Please try rephrasing it.",
        );
      }

      const result = JSON.parse(rawText);

      router.push({
        pathname: "/scan-result",
        params: { result: JSON.stringify(result) },
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={22} color="#F5F5F2" />
        </Pressable>
        <Text style={styles.headerTitle}>Describe your meal</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}
          <Text style={styles.label}>What did you eat?</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. 2 scrambled eggs, a slice of sourdough toast, and a black coffee"
            placeholderTextColor="#686B64"
            multiline
            autoFocus
          />

          <Pressable
            style={[
              styles.analyzeButton,
              !description.trim() && styles.analyzeButtonDisabled,
            ]}
            onPress={handleAnalyze}
            disabled={!description.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#0B110D" />
            ) : (
              <Text style={styles.analyzeButtonText}>Estimate Macros</Text>
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
  content: { paddingHorizontal: 20, marginTop: 12 },
  label: { fontSize: 14, color: "#92958D", marginBottom: 8 },
  input: {
    backgroundColor: "#1A1C19",
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: "#F5F5F2",
    minHeight: 120,
    textAlignVertical: "top",
  },
  analyzeButton: {
    backgroundColor: "#B8D7A8",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  analyzeButtonDisabled: { opacity: 0.4 },
  analyzeButtonText: { color: "#0B110D", fontWeight: "700", fontSize: 15 },

  errorBanner: {
    backgroundColor: "#3A1F1F",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  errorText: {
    color: "#FF9B9B",
    fontSize: 13,
    textAlign: "center",
  },
});
