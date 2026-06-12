import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/auth";
import { colors, fonts, spacing, radius } from "@/src/theme";

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(null); setBusy(true);
    try {
      await signUp(email.trim(), password, name.trim() || "Earth Friend", isStudent);
      router.replace("/(tabs)");
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={22} color={colors.onSurface} /></Pressable>
          <Text style={styles.eyebrow}>— BEGIN</Text>
          <Text style={styles.h1}>Plant your first{"
"}seed.</Text>
          <Text style={styles.sub}>Create your account and join Yogini&apos;s sanctuary.</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Your Name</Text>
            <View style={styles.inputRow}><Feather name="user" size={16} color={colors.muted} />
              <TextInput testID="signup-name" value={name} onChangeText={setName} placeholder="Maya" placeholderTextColor={colors.muted} style={styles.input} /></View>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}><Feather name="mail" size={16} color={colors.muted} />
              <TextInput testID="signup-email" value={email} onChangeText={setEmail} placeholder="hello@wellness.com" placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="email-address" style={styles.input} /></View>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password (min 6)</Text>
            <View style={styles.inputRow}><Feather name="lock" size={16} color={colors.muted} />
              <TextInput testID="signup-password" value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={colors.muted} secureTextEntry style={styles.input} /></View>
          </View>

          <Pressable testID="signup-student-toggle" style={styles.toggle} onPress={() => setIsStudent(!isStudent)}>
            <View style={[styles.checkbox, isStudent && styles.checkboxOn]}>{isStudent && <Feather name="check" size={14} color="#fff" />}</View>
            <Text style={styles.toggleTxt}>I&apos;m a student (unlocks ₹250 diet plans)</Text>
          </Pressable>

          {err && <Text style={styles.err} testID="signup-error">{err}</Text>}

          <Pressable testID="signup-submit" style={styles.primary} onPress={submit} disabled={busy}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryTxt}>Create Account</Text>}
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerTxt}>Already on Pritha? </Text>
            <Link href="/(auth)/sign-in" asChild><Pressable testID="signup-to-signin"><Text style={styles.footerLink}>Log In</Text></Pressable></Link>
          </View>
          <Text style={styles.terms}>By joining, you agree to our Terms of Service and Privacy Policy.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  scroll: { padding: spacing.xl, paddingTop: spacing.md },
  back: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center", marginBottom: spacing.lg },
  eyebrow: { fontFamily: fonts.bodyMed, color: colors.brandSecondary, letterSpacing: 2, fontSize: 11, marginBottom: spacing.sm },
  h1: { fontFamily: fonts.displayBold, fontSize: 36, color: colors.onSurface, lineHeight: 42 },
  sub: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceSecondary, marginTop: spacing.sm, marginBottom: spacing.xl },
  field: { marginBottom: spacing.md },
  label: { fontFamily: fonts.bodyMed, fontSize: 12, color: colors.onSurfaceSecondary, marginBottom: 6, letterSpacing: 0.5 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.surfaceSecondary, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: 14 },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.onSurface, padding: 0 },
  toggle: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: spacing.md, paddingVertical: spacing.sm },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
  checkboxOn: { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimary },
  toggleTxt: { fontFamily: fonts.body, color: colors.onSurface, fontSize: 14 },
  err: { fontFamily: fonts.bodyMed, color: colors.error, marginTop: spacing.sm, fontSize: 13 },
  primary: { backgroundColor: colors.brandPrimary, paddingVertical: 16, borderRadius: radius.pill, alignItems: "center", marginTop: spacing.lg },
  primaryTxt: { color: colors.onBrandPrimary, fontFamily: fonts.bodyMed, fontSize: 16 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: spacing.xl },
  footerTxt: { fontFamily: fonts.body, color: colors.onSurfaceSecondary, fontSize: 14 },
  footerLink: { fontFamily: fonts.bodyBold, color: colors.brandPrimary, fontSize: 14 },
  terms: { fontFamily: fonts.body, fontSize: 11, color: colors.muted, textAlign: "center", marginTop: spacing.md, lineHeight: 16 },
});
