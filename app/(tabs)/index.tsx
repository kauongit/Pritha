import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, ImageBackground, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/auth";
import { api } from "@/src/api";
import { colors, fonts, spacing, radius, moodPalette } from "@/src/theme";

const QUOTES = [
  "Nourish slowly. Bloom gently.",
  "Small habits, lifelong wellness.",
  "Your body is your oldest friend — listen.",
  "Eat seasons. Move softly. Rest deeply.",
];
const TIPS = [
  { t: "Warm Water Ritual", d: "Sip 200ml warm water on waking — gently awakens digestion." },
  { t: "Plate of Colors", d: "Aim for 3+ natural colors per meal. Variety = micronutrients." },
  { t: "Mindful First Bite", d: "Pause. Breathe. Notice. The first bite sets the meal's tone." },
];
const MOODS = ["Great", "Good", "Okay", "Low", "Exhausted"] as const;

export default function Home() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [mood, setMood] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const checkin = async (m: string) => {
    setMood(m); setBusy(true);
    try { await api("/journal", { method: "POST", body: { mood: m, note: "Daily check-in" }, token }); } catch {}
    setBusy(false);
  };
  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greet}>{greet()},</Text>
            <Text style={styles.name} testID="home-username">{user?.name?.split(" ")[0] || "friend"}</Text>
          </View>
          <Pressable testID="home-ai-btn" style={styles.aiBtn} onPress={() => router.push("/ai-chat")}>
            <Feather name="message-circle" size={18} color={colors.brandPrimary} />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1612795023439-592dd43f47fe?crop=entropy&cs=srgb&fm=jpg&w=900&q=80" }}
            style={styles.heroBg} imageStyle={{ borderRadius: radius.lg }}
          >
            <LinearGradient colors={["rgba(45,52,48,0.1)", "rgba(45,52,48,0.85)"]} style={[StyleSheet.absoluteFillObject, { borderRadius: radius.lg }]} />
            <View style={styles.heroContent}>
              <Text style={styles.heroEyebrow}>— DAILY WHISPER</Text>
              <Text style={styles.heroQuote}>&ldquo;{quote}&rdquo;</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodRow}>
            {MOODS.map((m) => (
              <Pressable key={m} testID={`mood-${m}`} disabled={busy} onPress={() => checkin(m)} style={[styles.moodChip, { backgroundColor: moodPalette[m] + "33", borderColor: mood === m ? moodPalette[m] : "transparent" }]}>
                <View style={[styles.moodDot, { backgroundColor: moodPalette[m] }]} />
                <Text style={styles.moodTxt}>{m}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick rituals</Text>
          <View style={styles.actionsGrid}>
            <Pressable testID="quick-diet" style={styles.actionCard} onPress={() => router.push("/diet-plan")}>
              <View style={[styles.actionIcon, { backgroundColor: colors.brandTertiary }]}><Feather name="feather" size={20} color={colors.brandPrimary} /></View>
              <Text style={styles.actionTitle}>Request Diet Plan</Text>
              <Text style={styles.actionSub}>From ₹250</Text>
            </Pressable>
            <Pressable testID="quick-consult" style={styles.actionCard} onPress={() => router.push("/(tabs)/consult")}>
              <View style={[styles.actionIcon, { backgroundColor: "#F0DBC9" }]}><Feather name="video" size={20} color={colors.brandSecondary} /></View>
              <Text style={styles.actionTitle}>Book Consultation</Text>
              <Text style={styles.actionSub}>₹750</Text>
            </Pressable>
            <Pressable testID="quick-journal" style={styles.actionCard} onPress={() => router.push("/(tabs)/journal")}>
              <View style={[styles.actionIcon, { backgroundColor: colors.surfaceTertiary }]}><Feather name="book-open" size={20} color={colors.onSurfaceSecondary} /></View>
              <Text style={styles.actionTitle}>Journal</Text>
              <Text style={styles.actionSub}>Free • daily</Text>
            </Pressable>
            <Pressable testID="quick-ai" style={styles.actionCard} onPress={() => router.push("/ai-chat")}>
              <View style={[styles.actionIcon, { backgroundColor: "#E8E5DF" }]}><Feather name="message-square" size={20} color={colors.brandPrimary} /></View>
              <Text style={styles.actionTitle}>AI Companion</Text>
              <Text style={styles.actionSub}>Free • always here</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition tips</Text>
          {TIPS.map((t, i) => (
            <View key={i} style={styles.tipCard}>
              <View style={styles.tipDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitle}>{t.t}</Text>
                <Text style={styles.tipDesc}>{t.d}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.section, styles.yoginiCard]}>
          <Image source={{ uri: "https://images.unsplash.com/photo-1541657333963-d31b55f58de1?crop=entropy&cs=srgb&fm=jpg&w=400&q=80" }} style={styles.yoginiImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.yoginiEyebrow}>— MEET YOUR GUIDE</Text>
            <Text style={styles.yoginiName}>Yogini Kurtadkar</Text>
            <Text style={styles.yoginiBio}>BSc Nutrition student & dietician. Calm, trustworthy, practices what she teaches.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gentle pricing</Text>
          <View style={styles.priceRow}>
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Student Diet Plan</Text>
              <Text style={styles.priceVal}>₹250</Text>
            </View>
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Regular Diet Plan</Text>
              <Text style={styles.priceVal}>₹500</Text>
            </View>
          </View>
          <View style={[styles.priceCard, { marginTop: spacing.sm, backgroundColor: colors.brandTertiary }]}>
            <Text style={styles.priceLabel}>1:1 Video Consultation</Text>
            <Text style={[styles.priceVal, { color: colors.brandPrimary }]}>₹750</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.md },
  greet: { fontFamily: fonts.body, color: colors.onSurfaceSecondary, fontSize: 13 },
  name: { fontFamily: fonts.displayBold, fontSize: 28, color: colors.onSurface },
  aiBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.brandTertiary, alignItems: "center", justifyContent: "center" },
  heroCard: { marginHorizontal: spacing.xl, marginBottom: spacing.lg, borderRadius: radius.lg, overflow: "hidden" },
  heroBg: { height: 180, justifyContent: "flex-end" },
  heroContent: { padding: spacing.lg },
  heroEyebrow: { color: "#fff", fontFamily: fonts.bodyMed, letterSpacing: 2, fontSize: 11, opacity: 0.9, marginBottom: 6 },
  heroQuote: { color: "#fff", fontFamily: fonts.display, fontSize: 22, lineHeight: 28 },
  section: { paddingHorizontal: spacing.xl, marginBottom: spacing.xl },
  sectionTitle: { fontFamily: fonts.displayBold, fontSize: 20, color: colors.onSurface, marginBottom: spacing.md },
  moodRow: { gap: 10, paddingVertical: 4 },
  moodChip: { flexShrink: 0, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.pill, borderWidth: 2 },
  moodDot: { width: 8, height: 8, borderRadius: 4 },
  moodTxt: { fontFamily: fonts.bodyMed, fontSize: 13, color: colors.onSurface },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  actionCard: { width: "47%", backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, padding: spacing.lg },
  actionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  actionTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.onSurface },
  actionSub: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  tipCard: { flexDirection: "row", gap: 12, backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm },
  tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brandSecondary, marginTop: 8 },
  tipTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.onSurface },
  tipDesc: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceSecondary, marginTop: 4, lineHeight: 18 },
  yoginiCard: { flexDirection: "row", gap: 14, backgroundColor: colors.surfaceSecondary, marginHorizontal: spacing.xl, padding: spacing.lg, borderRadius: radius.lg, alignItems: "center" },
  yoginiImg: { width: 72, height: 72, borderRadius: 36 },
  yoginiEyebrow: { fontFamily: fonts.bodyMed, color: colors.brandSecondary, fontSize: 10, letterSpacing: 1.5, marginBottom: 4 },
  yoginiName: { fontFamily: fonts.displayBold, fontSize: 18, color: colors.onSurface },
  yoginiBio: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 4, lineHeight: 17 },
  priceRow: { flexDirection: "row", gap: 12 },
  priceCard: { flex: 1, backgroundColor: colors.surfaceSecondary, padding: spacing.lg, borderRadius: radius.lg },
  priceLabel: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceSecondary },
  priceVal: { fontFamily: fonts.displayBold, fontSize: 24, color: colors.onSurface, marginTop: 4 },
});
