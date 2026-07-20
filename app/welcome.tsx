import { View, Text, Pressable, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fonts, spacing, radius } from "@/src/theme";

export default function Welcome() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1612795023439-592dd43f47fe?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80" }}
        style={styles.bg}
        imageStyle={{ resizeMode: "cover" }}
      >
        <LinearGradient
          colors={["rgba(45,52,48,0.0)", "rgba(45,52,48,0.2)", "rgba(251,249,246,1)"]}
          locations={[0, 0.5, 0.95]}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
          <View style={styles.top}>
            <Text style={styles.logo} testID="welcome-logo">Pritha</Text>
            <Text style={styles.tagline}>Daughter of Earth</Text>
          </View>
          <View style={styles.bottom}>
            <Text style={styles.h1}>Your sanctuary for sustainable wellness.</Text>
            <Text style={styles.p}>Small, sustainable habits create lifelong wellness. Welcome to Yogini&apos;s mindful nutrition space.</Text>
            <Pressable testID="welcome-get-started" style={styles.primaryBtn} onPress={() => router.push("/onboarding")}>
              <Text style={styles.primaryBtnTxt}>Begin Your Journey</Text>
            </Pressable>
            <Pressable testID="welcome-sign-in" style={styles.linkBtn} onPress={() => router.push("/(auth)/sign-in")}>
              <Text style={styles.linkTxt}>I already have an account</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: "space-between" },
  top: { paddingTop: spacing.xxl, alignItems: "center" },
  logo: { fontFamily: fonts.displayBold, fontSize: 44, color: colors.brandPrimary, letterSpacing: 0.5 },
  tagline: { fontFamily: fonts.body, fontSize: 13, color: colors.brandSecondary, marginTop: 4, letterSpacing: 2, textTransform: "uppercase" },
  bottom: { paddingBottom: spacing.lg },
  h1: { fontFamily: fonts.displayBold, fontSize: 32, color: colors.onSurface, lineHeight: 38, marginBottom: spacing.md },
  p: { fontFamily: fonts.body, fontSize: 15, color: colors.onSurfaceSecondary, lineHeight: 22, marginBottom: spacing.xl },
  primaryBtn: { backgroundColor: colors.brandPrimary, paddingVertical: 16, borderRadius: radius.pill, alignItems: "center", marginBottom: spacing.md },
  primaryBtnTxt: { color: colors.onBrandPrimary, fontFamily: fonts.bodyMed, fontSize: 16, letterSpacing: 0.5 },
  linkBtn: { paddingVertical: 12, alignItems: "center" },
  linkTxt: { color: colors.brandPrimary, fontFamily: fonts.bodyMed, fontSize: 14 },
});
