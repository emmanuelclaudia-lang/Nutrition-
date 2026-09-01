import AsyncStorage from "@react-native-async-storage/async-storage";

const GOAL_KEY = "calorie_goal";
const DEFAULT_GOAL = 2000;

export async function getCalorieGoal(): Promise<number> {
  const raw = await AsyncStorage.getItem(GOAL_KEY);
  return raw ? Number(raw) : DEFAULT_GOAL;
}

export async function setCalorieGoal(goal: number): Promise<void> {
  await AsyncStorage.setItem(GOAL_KEY, String(goal));
}