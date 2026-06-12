import { useCallback, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/auth";
import { api } from "@/src/api";
import { colors, fonts, spacing, radius } from "@/src/theme";

const SLOTS = ["09:00", "10:30", "12:00", "15:00", "16:30", "18:00"];

function nextDays(n = 7) {
  const out: { iso: string; day: string; date: string }[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      day: d.toLocaleDateString(undefined, { weekday: "short" }),
      date: d.getDate().toString(),
    });
  }
  return out;
}

export default function Consult() {
  const router = useRouter();
  const { token } = useAuth();
  const days = nextDays(7);
  const [date, setDate] = useState(days[1].iso);
  const [slot, setSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try { setHistory(await api("/consultations/mine", { token })); } catch {}
  }, [token]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const book = async () => {
    if (!slot) { setMsg("Please pick a time"); return; }
    setBusy(true); setMsg(null);
    try {
      const r = await api<any>("/consultations", { method: "POST", body: { date, time_slot: slot, notes }, token });
      router.push({ pathname: "/payment", params: { kind: "consultation", ref_id: r.id, amount: "750" } });
    } catch (e: any) { setMsg(e.message); }
    setBusy(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>— 1:1 SESSION</Text>
          <Text style={styles.h1}>Speak with Yogini</Text>
          <Text style={styles.sub}>A 45-minute video consultation. Bring your questions, your patterns, and your patience.</Text>
        </View>

        <View style={styles.benefits}>
          {[
            ["clock", "45 min focused session"],
            ["video", "Private video call"],
            ["file-text", "Notes shared with you"],
            ["heart", "Non-judgmental space"],
          ].map(([i, t]) => (
            <View key={t} style={styles.benefit}>
              <Feather name={i as any} size={16} color={colors.brandPrimary} />
              <Text style={styles.benefitTxt}>{t}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Choose a date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
          {days.map(d => (
            <Pressable key={d.iso} testID={`day-${d.iso}`} onPress={() => setDate(d.iso)} style={[styles.dayChip, date === d.iso && styles.dayChipOn]}>
              <Text style={[styles.dayTxt, date === d.iso && styles.dayTxtOn]}>{d.day}</Text>
              <Text style={[styles.dayDate, date === d.iso && styles.dayTxtOn]}>{d.date}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.section}>Available times</Text>
        <View style={styles.slotsGrid}>
          {SLOTS.map(s => (
            <Pressable key={s} testID={`slot-${s}`} onPress={() => setSlot(s)} style={[styles.slot, slot === s && styles.slotOn]}>
              <Text style={[styles.slotTxt, slot === s && styles.slotTxtOn]}>{s}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.section}>Anything you&apos;d like to share?</Text>
        <View style={styles.notesWrap}>
          <TextInput testID="consult-notes" multiline value={notes} onChangeText={setNotes} placeholder="Optional: concerns, goals..." placeholderTextColor={colors.muted} style={styles.notes} />
        </View>

        {history.length > 0 && (
          <View style={styles.section as any}>
            <Text style={styles.section}>Your past sessions</Text>
            {history.slice(0, 5).map(h => (
              <View key={h.id} style={styles.histCard}>
                <Text style={styles.histDate}>{h.date} • {h.time_slot}</Text>
                <Text style={styles.histStatus}>{h.status} • {h.payment_status}</Text>
              </View>
            ))}
          </View>
        )}

        {msg && <Text style={styles.err}>{msg}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLbl}>Session price</Text>
          <Text style={styles.price}>₹750</Text>
        </View>
        <Pressable testID="consult-book" style={styles.bookBtn} onPress={book} disabled={busy}>
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookTxt}>Book Session</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md },
  eyebrow: { fontFamily: fonts.bodyMed, color: colors.brandSecondary, letterSpacing: 2, fontSize: 11 },
  h1: { fontFamily: fonts.displayBold, fontSize: 30, color: colors.onSurface, marginTop: 4 },
  sub: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceSecondary, marginTop: spacing.sm, lineHeight: 21 },
  benefits: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  benefit: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.surfaceSecondary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill },
  benefitTxt: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceSecondary },
  section: { fontFamily: fonts.displayBold, fontSize: 18, color: colors.onSurface, paddingHorizontal: spacing.xl, marginTop: spacing.lg, marginBottom: spacing.sm },
  daysRow: { paddingHorizontal: spacing.xl, gap: 8, paddingVertical: 4 },
  dayChip: { flexShrink: 0, width: 60, paddingVertical: 12, alignItems: "center", borderRadius: radius.md, backgroundColor: colors.surfaceSecondary },
  dayChipOn: { backgroundColor: colors.brandPrimary },
  dayTxt: { fontFamily: fonts.bodyMed, fontSize: 11, color: colors.onSurfaceSecondary, textTransform: "uppercase" },
  dayDate: { fontFamily: fonts.displayBold, fontSize: 20, color: colors.onSurface },
  dayTxtOn: { color: "#fff" },
  slotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: spacing.xl },
  slot: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.pill, backgroundColor: colors.surfaceSecondary },
  slotOn: { backgroundColor: colors.brandTertiary, borderWidth: 1, borderColor: colors.brandPrimary },
  slotTxt: { fontFamily: fonts.bodyMed, fontSize: 13, color: colors.onSurface },
  slotTxtOn: { color: colors.brandPrimary },
  notesWrap: { paddingHorizontal: spacing.xl },
  notes: { backgroundColor: colors.surfaceSecondary, padding: spacing.lg, borderRadius: radius.md, minHeight: 80, fontFamily: fonts.body, color: colors.onSurface, textAlignVertical: "top" },
  histCard: { marginHorizontal: spacing.xl, padding: spacing.md, backgroundColor: colors.surfaceSecondary, borderRadius: radius.md, marginBottom: 8 },
  histDate: { fontFamily: fonts.bodyBold, color: colors.onSurface, fontSize: 14 },
  histStatus: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  err: { color: colors.error, fontFamily: fonts.bodyMed, textAlign: "center", marginTop: 8 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  priceLbl: { fontFamily: fonts.body, fontSize: 11, color: colors.muted },
  price: { fontFamily: fonts.displayBold, fontSize: 24, color: colors.onSurface },
  bookBtn: { backgroundColor: colors.brandPrimary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: radius.pill },
  bookTxt: { color: "#fff", fontFamily: fonts.bodyMed, fontSize: 15 },
});
