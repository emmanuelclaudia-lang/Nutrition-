import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check, Pencil } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveMeal, MealType } from "../utils/mealStorage";

type FoodItem = {
  name: string;
  portion_estimate: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? "http://localhost:8081";

export default function ScanResultScreen() {
  const { result } = useLocalSearchParams<{ result: string }>();
  const parsed = result ? JSON.parse(result) : null;

  const [items, setItems] = useState<FoodItem[]>(parsed?.items ?? []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [recalculating, setRecalculating] = useState<number | null>(null);
  const [recalcError, setRecalcError] = useState<string | null>(null);

  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [saving, setSaving] = useState(false);

  if (!parsed) return null;

  const updateItem = (
    index: number,
    field: "name" | "portion_estimate",
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const recalculateItem = async (index: number) => {
    setRecalculating(index);
    setRecalcError(null);
    try {
      const item = items[index];
      const res = await fetch(`${API_BASE}/api/recalculate-item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          portion_estimate: item.portion_estimate,
        }),
      });

      if (!res.ok) {
        throw new Error("Couldn't recalculate, try again.");
      }
      const macros = await res.json();

      setItems((prev) =>
        prev.map((it, i) => (i === index ? { ...it, ...macros } : it)),
      );
      setEditingIndex(null);
    } catch (err) {
      console.error(err);
      setRecalcError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setRecalculating(null);
    }
  };

  const total = items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein_g: acc.protein_g + item.protein_g,
      carbs_g: acc.carbs_g + item.carbs_g,
      fat_g: acc.fat_g + item.fat_g,
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveMeal({
        id: Date.now().toString(),
        mealType,
        date: new Date().toISOString().split("T")[0],
        items,
        total,
      });
      router.push("/(tabs)/diary");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Meal Breakdown</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {items.map((item, i) => {
            const isEditing = editingIndex === i;

            return (
              <View key={i} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Pressable
                    onPress={() => setEditingIndex(isEditing ? null : i)}
                    hitSlop={8}
                  >
                    {isEditing ? (
                      <Check size={18} color="#4A7A3D" />
                    ) : (
                      <Pencil size={16} color="#767676" />
                    )}
                  </Pressable>
                </View>

                {isEditing ? (
                  <View style={styles.editBlock}>
                    <TextInput
                      style={styles.nameInput}
                      value={item.name}
                      onChangeText={(v) => updateItem(i, "name", v)}
                      placeholder="Food name"
                      autoFocus
                    />
                    <TextInput
                      style={styles.portionInput}
                      value={item.portion_estimate}
                      onChangeText={(v) => updateItem(i, "portion_estimate", v)}
                      placeholder="Portion size"
                      autoFocus
                    />
                    <Pressable
                      style={styles.recalcButton}
                      onPress={() => recalculateItem(i)}
                      disabled={recalculating === i}
                    >
                      {recalculating === i ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <Text style={styles.recalcButtonText}>Recalculate</Text>
                      )}
                      {recalcError && isEditing && (
                        <Text style={styles.recalcErrorText}>
                          {recalcError}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                ) : (
                  <>
                    <Text style={styles.itemPortion}>
                      {item.portion_estimate}
                    </Text>
                    <View style={styles.macroRow}>
                      <Text style={styles.macroText}>{item.calories} kcal</Text>
                      <Text style={styles.macroText}>P {item.protein_g}g</Text>
                      <Text style={styles.macroText}>C {item.carbs_g}g</Text>
                      <Text style={styles.macroText}>F {item.fat_g}g</Text>
                    </View>
                  </>
                )}
              </View>
            );
          })}

          <View style={styles.totalCard}>
            <Text style={styles.totalTitle}>Total</Text>
            <View style={styles.macroRow}>
              <Text style={styles.totalMacro}>{total.calories} kcal</Text>
              <Text style={styles.totalMacro}>P {total.protein_g}g</Text>
              <Text style={styles.totalMacro}>C {total.carbs_g}g</Text>
              <Text style={styles.totalMacro}>F {total.fat_g}g</Text>
            </View>
            <Text style={styles.confidence}>
              Confidence: {parsed.confidence}
            </Text>
          </View>

          <View style={styles.mealTypeRow}>
            {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map(
              (type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.mealTypePill,
                    mealType === type && styles.mealTypePillActive,
                  ]}
                  onPress={() => setMealType(type)}
                >
                  <Text
                    style={[
                      styles.mealTypeText,
                      mealType === type && styles.mealTypeTextActive,
                    ]}
                  >
                    {type[0].toUpperCase() + type.slice(1)}
                  </Text>
                </Pressable>
              ),
            )}
          </View>

          <Pressable
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save to {mealType}</Text>
            )}
          </Pressable>
        </ScrollView>
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
  headerTitle: { fontSize: 17, fontWeight: "600", color: "#1A1A1A" },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  itemCard: { backgroundColor: "#F7F7F7", borderRadius: 14, padding: 16 },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: { fontSize: 16, fontWeight: "600", color: "#1A1A1A", flex: 1 },
  itemPortion: {
    fontSize: 13,
    color: "#767676",
    marginTop: 2,
    marginBottom: 8,
  },
  macroRow: { flexDirection: "row", gap: 14 },
  macroText: { fontSize: 13, color: "#3A3A3A" },
  editBlock: { marginTop: 8, gap: 10 },
  portionInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  nameInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  recalcButton: {
    backgroundColor: "#4A7A3D",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  recalcButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  totalCard: {
    backgroundColor: "#EAF3E2",
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
  },
  totalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  totalMacro: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },
  confidence: { fontSize: 12, color: "#767676", marginTop: 8 },

  mealTypeRow: { flexDirection: "row", gap: 8, marginTop: 16 },
  mealTypePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  mealTypePillActive: { backgroundColor: "#4A7A3D" },
  mealTypeText: { fontSize: 13, color: "#3A3A3A", fontWeight: "500" },
  mealTypeTextActive: { color: "#FFFFFF" },
  saveButton: {
    backgroundColor: "#4A7A3D",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  saveButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },

  recalcErrorText: {
    color: "#FF9B9B",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
});
