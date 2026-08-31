import { router } from "expo-router";
import { ArrowLeft, Camera, PenLine } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddMealScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={22} color="#F5F5F2" />
        </Pressable>
        <Text style={styles.headerTitle}>Add a meal</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.options}>
        <Pressable
          style={styles.optionCard}
          onPress={() => router.push("/(tabs)/scan")}
        >
          <View style={styles.optionIcon}>
            <Camera size={24} color="#B8D7A8" />
          </View>
          <Text style={styles.optionTitle}>Scan a Photo</Text>
          <Text style={styles.optionSubtitle}>
            Take a photo and let AI identify it
          </Text>
        </Pressable>

        <Pressable
          style={styles.optionCard}
          onPress={() => router.push("/manual-entry")}
        >
          <View style={styles.optionIcon}>
            <PenLine size={24} color="#B8D7A8" />
          </View>
          <Text style={styles.optionTitle}>Describe a Meal</Text>
          <Text style={styles.optionSubtitle}>
            Type what you ate and AI will estimate it
          </Text>
        </Pressable>
      </View>
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
  options: { paddingHorizontal: 20, gap: 14, marginTop: 20 },
  optionCard: {
    backgroundColor: "#1A1C19",
    borderRadius: 18,
    padding: 20,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#252724",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  optionTitle: { fontSize: 16, fontWeight: "600", color: "#F5F5F2" },
  optionSubtitle: { fontSize: 13, color: "#92958D", marginTop: 4 },
});
