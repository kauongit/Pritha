import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useAuth } from "@/src/auth";
import { colors, fonts, spacing, radius } from "@/src/theme";

export default function SignIn() {
  const router = useRouter();
  const { signIn, googleSignIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(null); setBusy(true);
    try { await signIn(email.trim(), password); router.replace("/(tabs)"); }
    catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };
  const google = async () => {
    setBusy(true);
    try { await googleSignIn("guest@google.pritha.app", "Earth Friend", undefined); router.replace("/(tabs)"); }
    catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={22} color={colors.onSurface} /></Pressable>
          <Text style={styles.eyebrow}>— WELCOME BACK</Text>
          <Text style={styles.h1}>Hello, kindred soul.</Text>
          <Text style={styles.sub}>Sign in to return to your sanctuary.</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Feather name="mail" size={16} color={colors.muted} />
              <TextInput testID="signin-email" value={email} onChangeText={setEmail} placeholder="hello@wellness.com" placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Feather name="lock" size={16} color={colors.muted} />
              <TextInput testID="signin-password" value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={colors.muted} secureTextEntry={!show} style={styles.input} />
              <Pressable onPress={() => setShow(!show)}><Feather name={show ? "eye-off" : "eye"} size={16} color={colors.muted} /></Pressable>
            </View>
          </View>

          {err && <Text style={styles.err} testID="signin-error">{err}</Text>}

          <Pressable testID="signin-submit" style={styles.primary} onPress={submit} disabled={busy}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryTxt}>Log In</Text>}
          </Pressable>

          <View style={styles.divider}><View style={styles.line} /><Text style={styles.dividerTxt}>or continue with</Text><View style={styles.line} /></View>

          <Pressable testID="signin-google" style={styles.social} onPress={google}>
            <AntDesign name="google" size={18} color={colors.brandSecondary} />
            <Text style={styles.socialTxt}>Continue with Google</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerTxt}>New to Pritha? </Text>
            <Link href="/(auth)/sign-up" asChild><Pressable testID="signin-to-signup"><Text style={styles.footerLink}>Sign Up</Text></Pressable></Link>
          </View>
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
  err: { fontFamily: fonts.bodyMed, color: colors.error, marginTop: spacing.sm, fontSize: 13 },
  primary: { backgroundColor: colors.brandPrimary, paddingVertical: 16, borderRadius: radius.pill, alignItems: "center", marginTop: spacing.lg },
  primaryTxt: { color: colors.onBrandPrimary, fontFamily: fonts.bodyMed, fontSize: 16 },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: spacing.xl },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerTxt: { fontFamily: fonts.body, color: colors.muted, fontSize: 12 },
  social: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, backgroundColor: "#fff" },
  socialTxt: { fontFamily: fonts.bodyMed, color: colors.onSurface, fontSize: 14 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: spacing.xl },
  footerTxt: { fontFamily: fonts.body, color: colors.onSurfaceSecondary, fontSize: 14 },
  footerLink: { fontFamily: fonts.bodyBold, color: colors.brandPrimary, fontSize: 14 },
});
