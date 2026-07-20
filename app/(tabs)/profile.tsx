import { useCallback, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/auth";
import { api } from "@/src/api";
import { colors, fonts, spacing, radius } from "@/src/theme";

export default function Profile() {
  const router = useRouter();
  const { user, token, signOut } = useAuth();
  const [s, setS] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try { setS(await api("/profile/summary", { token })); } catch {} finally { setLoading(false); }
  }, [token]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>{(user?.name || "?").charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name} testID="profile-name">{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.is_student && <View style={styles.badge}><Text style={styles.badgeTxt}>STUDENT</Text></View>}
        </View>

        {loading ? <ActivityIndicator color={colors.brandPrimary} /> : s && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}><Text style={styles.statNum}>{s.diet_requests}</Text><Text style={styles.statLbl}>Diet plans</Text></View>
            <View style={styles.statCard}><Text style={styles.statNum}>{s.consultations}</Text><Text style={styles.statLbl}>Sessions</Text></View>
            <View style={styles.statCard}><Text style={styles.statNum}>{s.journal_entries}</Text><Text style={styles.statLbl}>Reflections</Text></View>
          </View>
        )}

        <View style={styles.menu}>
          <MenuItem icon="feather" label="My diet plans" onPress={() => router.push("/diet-plan")} testID="profile-diet" />
          <MenuItem icon="message-circle" label="AI Companion" onPress={() => router.push("/ai-chat")} testID="profile-ai" />
          {user?.role === "admin" && (
            <MenuItem icon="shield" label="Admin Dashboard" onPress={() => router.push("/admin")} testID="profile-admin" />
          )}
          <MenuItem icon="log-out" label="Sign out" onPress={async () => { await signOut(); router.replace("/welcome"); }} testID="profile-signout" danger />
        </View>

        <Text style={styles.footer}>Pritha — Daughter of Earth Made with care.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
function MenuItem({ icon, label, onPress, testID, danger }: any) {
  return (
    <Pressable testID={testID} style={styles.row} onPress={onPress}>
      <View style={[styles.rowIcon, danger && { backgroundColor: "#FAE6E2" }]}>
        <Feather name={icon} size={16} color={danger ? colors.error : colors.brandPrimary} />
      </View>
      <Text style={[styles.rowTxt, danger && { color: colors.error }]}>{label}</Text>
      <Feather name="chevron-right" size={18} color={colors.muted} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { alignItems: "center", paddingTop: spacing.xl, paddingBottom: spacing.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.brandTertiary, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  avatarTxt: { fontFamily: fonts.displayBold, fontSize: 32, color: colors.brandPrimary },
  name: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.onSurface },
  email: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceSecondary, marginTop: 2 },
  badge: { marginTop: 8, backgroundColor: colors.brandTertiary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  badgeTxt: { fontFamily: fonts.bodyBold, fontSize: 10, color: colors.brandPrimary, letterSpacing: 1 },
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: spacing.xl, marginVertical: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.surfaceSecondary, padding: spacing.lg, borderRadius: radius.lg, alignItems: "center" },
  statNum: { fontFamily: fonts.displayBold, fontSize: 24, color: colors.brandPrimary },
  statLbl: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 2 },
  menu: { paddingHorizontal: spacing.xl, gap: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.surfaceSecondary, padding: spacing.lg, borderRadius: radius.lg },
  rowIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.brandTertiary, alignItems: "center", justifyContent: "center" },
  rowTxt: { flex: 1, fontFamily: fonts.bodyMed, color: colors.onSurface, fontSize: 14 },
  footer: { textAlign: "center", color: colors.muted, fontFamily: fonts.body, fontSize: 11, marginTop: spacing.xxl, lineHeight: 18 },
});
