import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "@/src/theme";

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=srgb&fm=jpg&w=900&q=80",
    eyebrow: "PILLAR ONE",
    h: "Personalized Nutrition",
    p: "Custom diet plans crafted by Yogini, rooted in your body's rhythm — not trends.",
  },
  {
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&w=900&q=80",
    eyebrow: "PILLAR TWO",
    h: "Sustainable Habits",
    p: "Small, kind rituals — sipped warm water, mindful meals — that last a lifetime.",
  },
  {
    img: "https://images.unsplash.com/photo-1612367980327-7454a7276aa7?crop=entropy&cs=srgb&fm=jpg&w=900&q=80",
    eyebrow: "PILLAR THREE",
    h: "Holistic Wellness",
    p: "Body, mind, and emotion — journal, reflect, and grow at your own pace.",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const { width } = useWindowDimensions();
  const slide = SLIDES[i];
  const next = () => i < SLIDES.length - 1 ? setI(i + 1) : router.replace("/(auth)/sign-up");

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.logo}>Pritha</Text>
        <Pressable onPress={() => router.replace("/(auth)/sign-up")} testID="onboarding-skip">
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        <View style={styles.imgWrap}>
          <Image source={{ uri: slide.img }} style={[styles.img, { width: width - spacing.xl * 2, height: width - spacing.xl * 2 }]} />
        </View>
        <Text style={styles.eyebrow}>— {slide.eyebrow}</Text>
        <Text style={styles.h} testID={`onboarding-title-${i}`}>{slide.h}</Text>
        <Text style={styles.p}>{slide.p}</Text>
        <View style={styles.dots}>
          {SLIDES.map((_, idx) => (
            <View key={idx} style={[styles.dot, idx === i && styles.dotOn]} />
          ))}
        </View>
      </View>
      <Pressable style={styles.btn} onPress={next} testID="onboarding-next">
        <Text style={styles.btnTxt}>{i === SLIDES.length - 1 ? "Enter Sanctuary" : "Next"}</Text>
        <Feather name="arrow-right" size={18} color={colors.onBrandPrimary} />
      </Pressable>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface, paddingHorizontal: spacing.xl },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.md },
  logo: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.brandPrimary },
  skip: { fontFamily: fonts.bodyMed, color: colors.onSurfaceSecondary, fontSize: 14 },
  body: { flex: 1, alignItems: "center", justifyContent: "center" },
  imgWrap: { borderRadius: radius.lg * 2, overflow: "hidden", marginBottom: spacing.xl },
  img: { resizeMode: "cover" },
  eyebrow: { fontFamily: fonts.bodyMed, color: colors.brandSecondary, letterSpacing: 2, fontSize: 11, marginBottom: spacing.sm },
  h: { fontFamily: fonts.displayBold, fontSize: 32, color: colors.onSurface, textAlign: "center", marginBottom: spacing.md },
  p: { fontFamily: fonts.body, fontSize: 15, color: colors.onSurfaceSecondary, textAlign: "center", lineHeight: 22, paddingHorizontal: spacing.md },
  dots: { flexDirection: "row", marginTop: spacing.xl, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotOn: { backgroundColor: colors.brandPrimary, width: 24 },
  btn: { backgroundColor: colors.brandPrimary, paddingVertical: 16, borderRadius: radius.pill, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: spacing.md },
  btnTxt: { color: colors.onBrandPrimary, fontFamily: fonts.bodyMed, fontSize: 16 },
});
