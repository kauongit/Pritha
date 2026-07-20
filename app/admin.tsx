import { useCallback, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/auth";
import { api } from "@/src/api";
import { colors, fonts, spacing, radius } from "@/src/theme";

const TABS = ["Requests", "Consults", "Users", "Payments"] as const;
type Tab = typeof TABS[number];

export default function Admin() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [tab, setTab] = useState<Tab>("Requests");
  const [stats, setStats] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setStats(await api("/admin/stats", { token }));
      const path = tab === "Requests" ? "/admin/diet-requests" :
                   tab === "Consults" ? "/admin/consultations" :
                   tab === "Users" ? "/admin/users" : "/admin/payments";
      setData(await api(path, { token }));
    } catch {} finally { setLoading(false); }
  }, [token, tab]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (user?.role !== "admin") {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.deny}>Admin only.</Text>
        <Pressable onPress={() => router.replace("/(tabs)")}><Text style={{ color: colors.brandPrimary, textAlign: "center" }}>Back</Text></Pressable>
      </SafeAreaView>
    );
  }

  const complete = async (rid: string) => {
    try { await api(`/admin/diet-requests/${rid}/complete`, { method: "POST", token }); await load(); } catch {}
  };
  const completeConsult = async (cid: string) => {
    try { await api(`/admin/consultations/${cid}/complete`, { method: "POST", token }); await load(); } catch {}
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.head}>
        <Pressable onPress={() => router.back()}><Feather name="arrow-left" size={22} color={colors.onSurface} /></Pressable>
        <Text style={styles.title}>Admin · Yogini</Text>
        <View style={{ width: 22 }} />
      </View>

      {stats && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricsRow}>
          <Metric label="Users" val={stats.users} />
          <Metric label="Pending" val={stats.diet_pending} tone={colors.warning} />
          <Metric label="Completed" val={stats.diet_completed} tone={colors.success} />
          <Metric label="Consults" val={stats.consultations} />
          <Metric label="Revenue" val={`₹${stats.revenue}`} tone={colors.brandPrimary} />
        </ScrollView>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
        {TABS.map(t => (
          <Pressable key={t} onPress={() => setTab(t)} testID={`admin-tab-${t}`} style={[styles.tab, tab === t && styles.tabOn]}>
            <Text style={[styles.tabTxt, tab === t && styles.tabTxtOn]}>{t}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? <ActivityIndicator color={colors.brandPrimary} style={{ marginTop: 30 }} /> : (
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
          {data.length === 0 && <Text style={styles.empty}>No {tab.toLowerCase()} yet.</Text>}
          {tab === "Requests" && data.map(r => (
            <View key={r.id} style={styles.card}>
              <View style={styles.cardHead}>
                <Text style={styles.cardTitle}>{r.user_name} ({r.age})</Text>
                <View style={[styles.statusPill, { backgroundColor: r.status === "completed" ? colors.success : colors.warning }]}>
                  <Text style={styles.statusTxt}>{r.status}</Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>{r.gender} · {r.height}cm · {r.weight}kg · {r.dietary_preference}</Text>
              <Text style={styles.cardGoal} numberOfLines={2}>Goal: {r.goals}</Text>
              <View style={styles.cardFoot}>
                <Text style={styles.cardPrice}>₹{r.price} · {r.payment_status}</Text>
                {r.status !== "completed" && (
                  <Pressable testID={`mark-${r.id}`} onPress={() => complete(r.id)} style={styles.tinyBtn}>
                    <Text style={styles.tinyBtnTxt}>Mark complete</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
          {tab === "Consults" && data.map(c => (
            <View key={c.id} style={styles.card}>
              <View style={styles.cardHead}>
                <Text style={styles.cardTitle}>{c.user_name}</Text>
                <View style={[styles.statusPill, { backgroundColor: c.status === "completed" ? colors.success : colors.info ?? colors.brand }]}>
                  <Text style={styles.statusTxt}>{c.status}</Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>{c.date} · {c.time_slot}</Text>
              {c.notes ? <Text style={styles.cardGoal}>{c.notes}</Text> : null}
              <View style={styles.cardFoot}>
                <Text style={styles.cardPrice}>₹{c.price} · {c.payment_status}</Text>
                {c.status !== "completed" && (
                  <Pressable testID={`mark-c-${c.id}`} onPress={() => completeConsult(c.id)} style={styles.tinyBtn}>
                    <Text style={styles.tinyBtnTxt}>Mark complete</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
          {tab === "Users" && data.map(u => (
            <View key={u.id} style={styles.card}>
              <Text style={styles.cardTitle}>{u.name}</Text>
              <Text style={styles.cardMeta}>{u.email}</Text>
              <Text style={styles.cardMeta}>{u.is_student ? "Student" : "Regular"} · joined {new Date(u.created_at).toLocaleDateString()}</Text>
            </View>
          ))}
          {tab === "Payments" && data.map(p => (
            <View key={p.id} style={styles.card}>
              <View style={styles.cardHead}>
                <Text style={styles.cardTitle}>₹{p.amount} · {p.kind}</Text>
                <View style={[styles.statusPill, { backgroundColor: p.status === "paid" ? colors.success : colors.warning }]}>
                  <Text style={styles.statusTxt}>{p.status}</Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>{p.order_id}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
function Metric({ label, val, tone }: any) {
  return (
    <View style={[styles.metric, tone && { borderColor: tone, borderWidth: 1 }]}>
      <Text style={styles.metricVal}>{val}</Text>
      <Text style={styles.metricLbl}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontFamily: fonts.displayBold, fontSize: 18, color: colors.onSurface },
  deny: { fontFamily: fonts.body, color: colors.error, textAlign: "center", marginTop: 100 },
  metricsRow: { padding: spacing.lg, gap: 10 },
  metric: { flexShrink: 0, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surfaceSecondary, minWidth: 90 },
  metricVal: { fontFamily: fonts.displayBold, fontSize: 20, color: colors.onSurface },
  metricLbl: { fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 2 },
  tabsRow: { paddingHorizontal: spacing.lg, gap: 8, paddingBottom: 4, height: 56, alignItems: "center" },
  tab: { flexShrink: 0, paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.surfaceSecondary, height: 36, justifyContent: "center" },
  tabOn: { backgroundColor: colors.brandPrimary },
  tabTxt: { fontFamily: fonts.bodyMed, fontSize: 13, color: colors.onSurface },
  tabTxtOn: { color: "#fff" },
  empty: { textAlign: "center", color: colors.muted, fontFamily: fonts.body, marginTop: 40 },
  card: { backgroundColor: colors.surfaceSecondary, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.sm },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  cardTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.onSurface },
  cardMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  cardGoal: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceSecondary, marginTop: 6 },
  cardFoot: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm },
  cardPrice: { fontFamily: fonts.bodyMed, fontSize: 12, color: colors.onSurface },
  statusPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  statusTxt: { fontFamily: fonts.bodyBold, fontSize: 10, color: "#fff", letterSpacing: 0.5, textTransform: "uppercase" },
  tinyBtn: { backgroundColor: colors.brandPrimary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  tinyBtnTxt: { color: "#fff", fontFamily: fonts.bodyMed, fontSize: 11 },
});
