import { useCallback, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, TextInput, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/auth";
import { api } from "@/src/api";
import { colors, fonts, spacing, radius, moodPalette } from "@/src/theme";

const MOODS = ["Great", "Good", "Okay", "Low", "Exhausted"] as const;

export default function Journal() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<string>("Good");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setEntries(await api("/journal/mine", { token })); } catch {}
    setLoading(false);
  }, [token]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    setBusy(true);
    try {
      await api("/journal", { method: "POST", body: { mood, note }, token });
      setOpen(false); setNote(""); setMood("Good"); await load();
    } catch {} finally { setBusy(false); }
  };

  const counts: Record<string, number> = {};
  entries.forEach(e => { counts[e.mood] = (counts[e.mood] || 0) + 1; });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>— YOUR JOURNAL</Text>
          <Text style={styles.h1}>A quiet space</Text>
        </View>
        <Pressable testID="journal-new" style={styles.fab} onPress={() => setOpen(true)}>
          <Feather name="plus" size={22} color="#fff" />
        </Pressable>
      </View>

      {entries.length > 0 && (
        <View style={styles.statsRow}>
          {MOODS.map(m => (
            <View key={m} style={styles.stat}>
              <View style={[styles.statDot, { backgroundColor: moodPalette[m] }]} />
              <Text style={styles.statNum}>{counts[m] || 0}</Text>
              <Text style={styles.statLbl}>{m}</Text>
            </View>
          ))}
        </View>
      )}

      {loading ? <ActivityIndicator color={colors.brandPrimary} style={{ marginTop: 40 }} /> : (
        entries.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="book-open" size={40} color={colors.borderStrong} />
            <Text style={styles.emptyTxt}>Your journal is empty.{"
"}Take a deep breath and write your first entry.</Text>
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={[styles.entry, { borderLeftColor: moodPalette[item.mood] }]} testID={`journal-entry-${item.id}`}>
                <View style={styles.entryHead}>
                  <Text style={styles.entryMood}>{item.mood}</Text>
                  <Text style={styles.entryDate}>{new Date(item.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</Text>
                </View>
                {item.note ? <Text style={styles.entryNote}>{item.note}</Text> : null}
              </View>
            )}
          />
        )
      )}

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.grip} />
            <Text style={styles.sheetTitle}>New reflection</Text>
            <Text style={styles.sheetLbl}>How do you feel?</Text>
            <View style={styles.moodPicker}>
              {MOODS.map(m => (
                <Pressable key={m} testID={`new-mood-${m}`} onPress={() => setMood(m)} style={[styles.moodOpt, mood === m && { backgroundColor: moodPalette[m] + "33", borderColor: moodPalette[m] }]}>
                  <View style={[styles.moodDot, { backgroundColor: moodPalette[m] }]} />
                  <Text style={styles.moodOptTxt}>{m}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.sheetLbl}>A few words (optional)</Text>
            <TextInput testID="journal-note" multiline value={note} onChangeText={setNote} placeholder="Whatever rises in you..." placeholderTextColor={colors.muted} style={styles.noteInput} />
            <Pressable testID="journal-save" style={styles.saveBtn} onPress={save} disabled={busy}>
              {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>Save entry</Text>}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  eyebrow: { fontFamily: fonts.bodyMed, color: colors.brandSecondary, letterSpacing: 2, fontSize: 11 },
  h1: { fontFamily: fonts.displayBold, fontSize: 28, color: colors.onSurface, marginTop: 4 },
  fab: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.brandPrimary, alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  stat: { alignItems: "center" },
  statDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
  statNum: { fontFamily: fonts.displayBold, fontSize: 18, color: colors.onSurface },
  statLbl: { fontFamily: fonts.body, fontSize: 10, color: colors.muted },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl, gap: 12 },
  emptyTxt: { fontFamily: fonts.body, color: colors.onSurfaceSecondary, textAlign: "center", lineHeight: 22 },
  entry: { backgroundColor: colors.surfaceSecondary, padding: spacing.lg, borderRadius: radius.lg, borderLeftWidth: 4, marginBottom: spacing.sm },
  entryHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  entryMood: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.onSurface },
  entryDate: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  entryNote: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceSecondary, marginTop: 6, lineHeight: 20 },
  modalRoot: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(45,52,48,0.5)" },
  sheet: { backgroundColor: colors.surface, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxl, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  grip: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: "center", marginBottom: spacing.md },
  sheetTitle: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.onSurface, marginBottom: spacing.lg },
  sheetLbl: { fontFamily: fonts.bodyMed, fontSize: 12, color: colors.onSurfaceSecondary, marginBottom: 8, letterSpacing: 0.5 },
  moodPicker: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.lg },
  moodOpt: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.surfaceSecondary, borderWidth: 2, borderColor: "transparent" },
  moodDot: { width: 8, height: 8, borderRadius: 4 },
  moodOptTxt: { fontFamily: fonts.bodyMed, fontSize: 13, color: colors.onSurface },
  noteInput: { backgroundColor: colors.surfaceSecondary, padding: spacing.lg, borderRadius: radius.md, minHeight: 100, fontFamily: fonts.body, fontSize: 14, color: colors.onSurface, textAlignVertical: "top", marginBottom: spacing.lg },
  saveBtn: { backgroundColor: colors.brandPrimary, paddingVertical: 16, borderRadius: radius.pill, alignItems: "center" },
  saveTxt: { color: "#fff", fontFamily: fonts.bodyMed, fontSize: 15 },
});
