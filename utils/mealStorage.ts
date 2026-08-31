import AsyncStorage from "@react-native-async-storage/async-storage";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type SavedMeal = {
  id: string;
  mealType: MealType;
  date: string; 
  items: {
    name: string;
    portion_estimate: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  }[];
  total: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
};

const STORAGE_KEY = "meals";

export async function saveMeal(meal: SavedMeal) {
  const existing = await getAllMeals();
  const updated = [...existing, meal];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function getAllMeals(): Promise<SavedMeal[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function getMealsByDate(date: string): Promise<SavedMeal[]> {
  const all = await getAllMeals();
  return all.filter((m) => m.date === date);
}
