import { Tabs } from "expo-router";
import { Home, Scan, BookOpen } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#151614",
          borderTopColor: "#252724",
          height: 85,
          paddingTop: 8,
        },

        tabBarActiveTintColor: "#B8D7A8",
        tabBarInactiveTintColor: "#6F726B",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => <Scan size={24} color={color} />,diary.tsx
        }}
      />

      <Tabs.Screen
        name="diary"
        options={{
          title: "Diary",
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}