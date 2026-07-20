import { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/auth";
import { api } from "@/src/api";
import { colors, fonts, spacing, radius } from "@/src/theme";

export default function DietPlan() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "", age: "", gender: "Female", height: "", weight: "",
    activity_level: "Moderate", dietary_preference: "Vegetarian",
    allergies: "", medical_conditions: "", goals: "",
  });
  const [isStudent, setIsStudent] = useState(user?.is_student || false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const price = isStudent ? 250 : 500;
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const submit = async () => {
    setErr(null);
    if (!form.name || !form.age || !form.height || !form.weight || !form.goals) {
      setErr("Please fill name, age, height, weight, and goals."); return;
    }
    setBusy(true);
    try {
      const r = await api<any>("/diet-requests", {
        method: "POST", token,
        body: {
          ...form, age: parseInt(form.age), height: parseFloat(form.height),
          weight: parseFloat(form.weight), is_student: isStudent,
        }
      });
      router.replace({ pathname: "/payment", params: { kind: "diet_plan", ref_id: r.id, amount: String(price), is_student: String(isStudent) } });
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.head}>
          <Pressable onPress={() => router.back()}><Feather name="arrow-left" size={22} color={colors.onSurface} /></Pressable>
          <Text style={styles.headTitle}>Diet Plan Request</Text>
          <View style={{ width: 22 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
          <Text style={styles.eyebrow}>— TELL YOGINI ABOUT YOU</Text>
          <Text style={styles.h1}>A plan, rooted in your reality.</Text>

          <Pressable testID="diet-student-toggle" style={styles.priceToggle} onPress={() => setIsStudent(!isStudent)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.priceLbl}>{isStudent ? "Student price" : "Regular price"}</Text>
              <Text style={styles.priceVal}>₹{price}</Text>
            </View>
            <View style={[styles.switch, isStudent && styles.switchOn]}>
              <View style={[styles.dot, isStudent && styles.dotOn]} />
            </View>
            <Text style={styles.toggleHint}>{isStudent ? "Student" : "Regular"}</Text>
          </Pressable>

          {[
            { k: "name", l: "Full Name", ph: "Maya Sharma" },
            { k: "age", l: "Age", ph: "23", kt: "numeric" },
            { k: "height", l: "Height (cm)", ph: "165", kt: "numeric" },
            { k: "weight", l: "Weight (kg)", ph: "58", kt: "numeric" },
            { k: "allergies", l: "Allergies (optional)", ph: "Peanuts, dairy..." },
            { k: "medical_conditions", l: "Medical Conditions (optional)", ph: "PCOS, anemia..." },
          ].map(f => (
            <Field key={f.k} label={f.l}>
              <TextInput testID={`diet-${f.k}`} value={(form as any)[f.k]} onChangeText={(v) => set(f.k, v)} placeholder={f.ph} placeholderTextColor={colors.muted} keyboardType={(f.kt as any) || "default"} style={styles.input} />
            </Field>
          ))}

          <Field label="Gender">
            <Row>
              {["Female", "Male", "Other"].map(g => (
                <Pill key={g} active={form.gender === g} onPress={() => set("gender", g)} testID={`gender-${g}`}>{g}</Pill>
              ))}
            </Row>
          </Field>
          <Field label="Activity Level">
            <Row>
              {["Sedentary", "Light", "Moderate", "Active"].map(a => (
                <Pill key={a} active={form.activity_level === a} onPress={() => set("activity_level", a)} testID={`activity-${a}`}>{a}</Pill>
              ))}
            </Row>
          </Field>
          <Field label="Dietary Preference">
            <Row>
              {["Vegetarian", "Vegan", "Eggetarian", "Non-Veg"].map(d => (
                <Pill key={d} active={form.dietary_preference === d} onPress={() => set("dietary_preference", d)} testID={`diet-pref-${d}`}>{d}</Pill>
              ))}
            </Row>
          </Field>
          <Field label="Your Goals">
            <TextInput testID="diet-goals" multiline value={form.goals} onChangeText={(v) => set("goals", v)} placeholder="What does wellness look like for you?" placeholderTextColor={colors.muted} style={[styles.input, { minHeight: 90, textAlignVertical: "top" }]} />
          </Field>

          {err && <Text style={styles.err} testID="diet-error">{err}</Text>}
        </ScrollView>

        <View style={styles.foot}>
          <View><Text style={styles.priceLbl}>Total</Text><Text style={styles.priceVal}>₹{price}</Text></View>
          <Pressable testID="diet-submit" style={styles.submit} onPress={submit} disabled={busy}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitTxt}>Submit & Pay</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
function Field({ label, children }: any) {
  return <View style={{ marginBottom: spacing.md }}><Text style={styles.label}>{label}</Text>{children}</View>;
}
function Row({ children }: any) { return <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{children}</View>; }
function Pill({ children, active, onPress, testID }: any) {
  return (
    <Pressable testID={testID} onPress={onPress} style={[styles.pill, active && styles.pillOn]}>
      <Text style={[styles.pillTxt, active && styles.pillTxtOn]}>{children}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  headTitle: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.onSurface },
  eyebrow: { fontFamily: fonts.bodyMed, color: colors.brandSecondary, letterSpacing: 2, fontSize: 11 },
  h1: { fontFamily: fonts.displayBold, fontSize: 28, color: colors.onSurface, marginTop: 6, marginBottom: spacing.lg, lineHeight: 34 },
  priceToggle: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.brandTertiary, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.lg },
  priceLbl: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceSecondary },
  priceVal: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.onSurface },
  switch: { width: 44, height: 26, borderRadius: 13, backgroundColor: colors.borderStrong, justifyContent: "center", paddingHorizontal: 3 },
  switchOn: { backgroundColor: colors.brandPrimary },
  dot: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff" },
  dotOn: { alignSelf: "flex-end" },
  toggleHint: { fontFamily: fonts.bodyMed, fontSize: 12, color: colors.onSurface, width: 60, textAlign: "right" },
  label: { fontFamily: fonts.bodyMed, fontSize: 12, color: colors.onSurfaceSecondary, marginBottom: 6, letterSpacing: 0.4 },
  input: { backgroundColor: colors.surfaceSecondary, paddingHorizontal: spacing.lg, paddingVertical: 14, borderRadius: radius.md, fontFamily: fonts.body, color: colors.onSurface, fontSize: 14 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.surfaceSecondary },
  pillOn: { backgroundColor: colors.brandPrimary },
  pillTxt: { fontFamily: fonts.bodyMed, fontSize: 13, color: colors.onSurface },
  pillTxtOn: { color: "#fff" },
  err: { color: colors.error, marginTop: 8, fontFamily: fonts.bodyMed },
  foot: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  submit: { backgroundColor: colors.brandPrimary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: radius.pill },
  submitTxt: { color: "#fff", fontFamily: fonts.bodyMed, fontSize: 15 },
});
