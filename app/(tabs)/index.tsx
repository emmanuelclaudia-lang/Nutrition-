import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Menu, Scan } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
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

          <Pressable style={styles.menuButton}>
            <Menu size={24} color="#F5F5F2" />
          </Pressable>
        </View>

        {/* Calorie Card */}
        <View style={styles.calorieCard}>
          <Text style={styles.cardLabel}>TODAY'S CALORIES</Text>

          <View style={styles.calorieRow}>
            <Text style={styles.calories}>1,240</Text>
            <Text style={styles.calorieUnit}> kcal</Text>
          </View>

          <Text style={styles.goalText}>of 2,000 kcal goal</Text>

          {/* Progress bar */}
          <View style={styles.progressBackground}>
            <View style={styles.progress} />
          </View>

          <Text style={styles.remaining}>760 kcal remaining</Text>
        </View>

        {/* Macro section */}
        <Text style={styles.sectionTitle}>Today's nutrition</Text>

        <View style={styles.macroContainer}>
          <View style={styles.macro}>
            <Text style={styles.macroValue}>82g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.macro}>
            <Text style={styles.macroValue}>120g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.macro}>
            <Text style={styles.macroValue}>42g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>

        {/* Scan CTA */}
        <Link href="/scan" asChild>
          <Pressable style={styles.scanButton}>
            <View style={styles.scanIcon}>
              <Scan size={28} color="#B8D7A8" />
            </View>

            <View>
              <Text style={styles.scanTitle}>Scan your meal</Text>
              <Text style={styles.scanSubtitle}>
                Get an instant nutrition estimate
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </Link>

        {/* Recent meals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <Text style={styles.seeAll}>View all</Text>
        </View>

        <View style={styles.mealCard}>
          <View style={styles.mealIcon}>
            <Text>🍳</Text>
          </View>

          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>Breakfast</Text>
            <Text style={styles.mealDescription}>Eggs, toast & avocado</Text>
          </View>

          <Text style={styles.mealCalories}>350 kcal</Text>
        </View>

        <View style={styles.mealCard}>
          <View style={styles.mealIcon}>
            <Text>🥗</Text>
          </View>

          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>Lunch</Text>
            <Text style={styles.mealDescription}>Chicken salad</Text>
          </View>

          <Text style={styles.mealCalories}>520 kcal</Text>
        </View>

        <View style={styles.mealCard}>
          <View style={styles.mealIcon}>
            <Text>🍎</Text>
          </View>

          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>Snack</Text>
            <Text style={styles.mealDescription}>Apple & almonds</Text>
          </View>

          <Text style={styles.mealCalories}>180 kcal</Text>
        </View>
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
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F5F5F2",
  },

  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1A1C19",
    justifyContent: "center",
    alignItems: "center",
  },

  menuIcon: {
    color: "#F5F5F2",
    fontSize: 22,
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F5F5F2",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#DDE8D8",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#34432F",
  },

  calorieCard: {
    backgroundColor: "#1A1C19",
    borderRadius: 26,
    padding: 24,
    marginBottom: 28,
  },

  cardLabel: {
    color: "#A9A9A9",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 12,
  },

  calories: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
  },

  calorieUnit: {
    color: "#A9A9A9",
    fontSize: 16,
  },

  goalText: {
    color: "#A9A9A9",
    fontSize: 14,
    marginTop: 2,
  },

  progressBackground: {
    height: 8,
    backgroundColor: "#3A3A3A",
    borderRadius: 10,
    marginTop: 24,
    overflow: "hidden",
  },

  progress: {
    width: "62%",
    height: "100%",
    backgroundColor: "#B8D7A8",
    borderRadius: 10,
  },

  remaining: {
    color: "#B8D7A8",
    fontSize: 13,
    marginTop: 12,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#F5F5F2",
    marginBottom: 14,
  },

  macroContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1C19",
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 24,
    alignItems: "center",
  },

  macro: {
    flex: 1,
    alignItems: "center",
  },

  macroValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F5F5F2",
  },

  macroLabel: {
    fontSize: 12,
    color: "#92958D",
    marginTop: 5,
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: "#E5E5E5",
  },

  scanButton: {
    backgroundColor: "#283526",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  scanIcon: {
    marginRight: 16,
  },

  scanTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F5F5F2",
  },

  scanSubtitle: {
    fontSize: 12,
    color: "#AAB6A4",
    marginTop: 3,
  },

  arrow: {
    fontSize: 28,
    color: "#52604D",
    marginLeft: "auto",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  seeAll: {
    color: "#687B5F",
    fontSize: 13,
    fontWeight: "600",
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
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F3F3F0",
    justifyContent: "center",
    alignItems: "center",
  },

  mealInfo: {
    marginLeft: 13,
    flex: 1,
  },

  mealName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F5F5F2",
  },

  mealDescription: {
    fontSize: 12,
    color: "#92958D",
    marginTop: 4,
  },

  mealCalories: {
    fontSize: 13,
    fontWeight: "600",
    color: "#B8D7A8",
  },
});
