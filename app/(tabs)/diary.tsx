import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { Calendar } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getMealsByDate, MealType, SavedMeal } from "../../utils/mealStorage";

const MEAL_META: Record<MealType, { label: string; emoji: string }> = {
  breakfast: { label: "Breakfast", emoji: "🍳" },
  lunch: { label: "Lunch", emoji: "🥗" },
  dinner: { label: "Dinner", emoji: "🍽️" },
  snack: { label: "Snack", emoji: "🍎" },
};

function formatTime(timestamp: string) {
  return new Date(Number(timestamp)).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export default function DiaryScreen() {
  const [meals, setMeals] = useState<SavedMeal[]>([]);
  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];

  useFocusEffect(
    useCallback(() => {
      getMealsByDate(todayKey).then(setMeals);
    }, [todayKey]),
  );

  const totalCaloriesFor = (meal: SavedMeal) => meal.total.calories;

  const descriptionFor = (meal: SavedMeal) =>
    meal.items.map((item) => item.name).join(", ");

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaskedView
            maskElement={<Text style={styles.title}>Nutrition+</Text>}
          >
            <LinearGradient
              colors={["#B8D7A8", "#DCECCF", "#8FBF9F"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.title, { opacity: 0 }]}>Nutrition+</Text>
            </LinearGradient>
          </MaskedView>
          <Text style={styles.subtitle}>Meal History</Text>
        </View>

        {/* Date selector */}
        <View style={styles.dateSelector}>
          <View>
            <Text style={styles.dateLabel}>TODAY</Text>
            <Text style={styles.date}>{formatDate(today)}</Text>
          </View>

          <Calendar size={24} color="#B8D7A8" />
        </View>

        {/* Meals */}
        <Text style={styles.sectionTitle}>Today's meals</Text>

        {meals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>No meals logged yet</Text>
            <Text style={styles.emptySubtitle}>
              Scan your first meal of the day to get started
            </Text>
          </View>
        ) : (
          meals.map((meal) => {
            const meta = MEAL_META[meal.mealType];
            return (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.mealIcon}>
                  <Text style={styles.emoji}>{meta.emoji}</Text>
                </View>

                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meta.label}</Text>
                  <Text style={styles.mealDescription} numberOfLines={1}>
                    {descriptionFor(meal)}
                  </Text>
                  <Text style={styles.mealTime}>{formatTime(meal.id)}</Text>
                </View>

                <Text style={styles.calories}>
                  {totalCaloriesFor(meal)} kcal
                </Text>
              </View>
            );
          })
        )}

        {/* add meal */}
        <Pressable
          style={styles.addMeal}
          onPress={() => router.push("/add-meal")}
        >
          <Text style={styles.addIcon}>+</Text>

          <View>
            <Text style={styles.addTitle}>Add a meal</Text>

            <Text style={styles.addSubtitle}>Scan or manually add food</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B110D",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 30,
  },

  header: {
    marginBottom: 28,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F5F5F2",
  },

  subtitle: {
    fontSize: 14,
    color: "#92958D",
    marginTop: 7,
  },

  dateSelector: {
    backgroundColor: "#1A1C19",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  dateLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#92958D",
  },

  date: {
    fontSize: 19,
    fontWeight: "600",
    color: "#F5F5F2",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#F5F5F2",
    marginBottom: 14,
  },

  mealCard: {
    backgroundColor: "#1A1C19",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  mealIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#252724",
    justifyContent: "center",
    alignItems: "center",
  },

  emoji: {
    fontSize: 25,
  },

  mealInfo: {
    flex: 1,
    marginLeft: 13,
  },

  mealName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F5F5F2",
  },

  mealDescription: {
    fontSize: 12,
    color: "#92958D",
    marginTop: 3,
  },

  mealTime: {
    fontSize: 11,
    color: "#686B64",
    marginTop: 4,
  },

  calories: {
    fontSize: 13,
    fontWeight: "600",
    color: "#B8D7A8",
  },

  addMeal: {
    backgroundColor: "#151614",
    borderWidth: 1,
    borderColor: "#30332E",
    borderStyle: "dashed",
    borderRadius: 18,
    padding: 18,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  addIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#283526",
    color: "#B8D7A8",
    fontSize: 27,
    textAlign: "center",
    lineHeight: 39,
    marginRight: 14,
  },

  addTitle: {
    color: "#F5F5F2",
    fontSize: 15,
    fontWeight: "600",
  },

  addSubtitle: {
    color: "#92958D",
    fontSize: 12,
    marginTop: 3,
  },
  emptyState: {
    backgroundColor: "#1A1C19",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    marginBottom: 10,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F5F5F2",
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#92958D",
    marginTop: 4,
    textAlign: "center",
  },
});
