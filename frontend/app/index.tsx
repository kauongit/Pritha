import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/auth";
import { colors } from "@/src/theme";

export default function Index() {
  const { ready, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!ready) return;
    if (user) router.replace("/(tabs)");
    else router.replace("/welcome");
  }, [ready, user]);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface }}>
      <ActivityIndicator color={colors.brandPrimary} />
    </View>
  );
}
