import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors, fonts } from "@/src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandPrimary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 80,
          paddingTop: 8,
          paddingBottom: 20,
        },
        tabBarLabelStyle: { fontFamily: fonts.bodyMed, fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Feather name="home" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="journal" options={{ title: "Journal", tabBarIcon: ({ color, size }) => <Feather name="book-open" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="consult" options={{ title: "Consult", tabBarIcon: ({ color, size }) => <Feather name="message-circle" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <Feather name="user" size={size - 2} color={color} /> }} />
    </Tabs>
  );
}
