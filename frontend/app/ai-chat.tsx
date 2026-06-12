import { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/auth";
import { aiStream } from "@/src/api";
import { colors, fonts, spacing, radius } from "@/src/theme";

type Msg = { role: "user" | "assistant"; text: string };
const SUGGESTIONS = [
  "I feel bloated after dinner — gentle tips?",
  "What's a kind breakfast for PCOS?",
  "How do I make hydration a habit?",
];

export default function AiChat() {
  const router = useRouter();
  const { token } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", text: "Hello, kindred soul. I'm Pritha — your gentle wellness companion. What's stirring in you today?" }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const sessRef = useRef(`s_${Date.now()}`);
  const scrollRef = useRef<ScrollView>(null);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || busy || !token) return;
    setInput("");
    setMsgs(m => [...m, { role: "user", text: msg }, { role: "assistant", text: "" }]);
    setBusy(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    try {
      await aiStream(msg, sessRef.current, token, (chunk) => {
        setMsgs(m => {
          const last = m[m.length - 1];
          return [...m.slice(0, -1), { ...last, text: last.text + chunk }];
        });
        scrollRef.current?.scrollToEnd({ animated: false });
      });
    } catch (e: any) {
      setMsgs(m => {
        const last = m[m.length - 1];
        return [...m.slice(0, -1), { ...last, text: last.text || "I'm resting a moment. Try again gently." }];
      });
    } finally { setBusy(false); }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.head}>
        <Pressable onPress={() => router.back()} testID="ai-back"><Feather name="arrow-left" size={22} color={colors.onSurface} /></Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Pritha Companion</Text>
          <Text style={styles.sub}>Gentle • Always non-judgmental</Text>
        </View>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={20}>
        <ScrollView ref={scrollRef} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 20 }}>
          {msgs.map((m, i) => (
            <View key={i} style={[styles.bubble, m.role === "user" ? styles.bubbleU : styles.bubbleA]}>
              <Text style={[styles.bubbleTxt, m.role === "user" && { color: "#fff" }]}>
                {m.text || (busy && i === msgs.length - 1 ? "..." : "")}
              </Text>
            </View>
          ))}
          {msgs.length === 1 && (
            <View style={styles.suggest}>
              {SUGGESTIONS.map(s => (
                <Pressable key={s} onPress={() => send(s)} style={styles.suggestChip} testID={`ai-suggest-${s.slice(0, 8)}`}>
                  <Text style={styles.suggestTxt}>{s}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={styles.inputBar}>
          <TextInput testID="ai-input" value={input} onChangeText={setInput} placeholder="Share gently..." placeholderTextColor={colors.muted} style={styles.input} multiline />
          <Pressable testID="ai-send" onPress={() => send()} style={[styles.sendBtn, (!input.trim() || busy) && { opacity: 0.5 }]} disabled={!input.trim() || busy}>
            {busy ? <ActivityIndicator color="#fff" size="small" /> : <Feather name="arrow-up" size={18} color="#fff" />}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  head: { flexDirection: "row", alignItems: "center", padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.onSurface },
  sub: { fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 2 },
  bubble: { padding: 14, borderRadius: 18, marginBottom: 10, maxWidth: "85%" },
  bubbleA: { backgroundColor: colors.surfaceSecondary, alignSelf: "flex-start", borderBottomLeftRadius: 4 },
  bubbleU: { backgroundColor: colors.brandPrimary, alignSelf: "flex-end", borderBottomRightRadius: 4 },
  bubbleTxt: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurface, lineHeight: 20 },
  suggest: { gap: 8, marginTop: spacing.md },
  suggestChip: { padding: 12, backgroundColor: colors.brandTertiary, borderRadius: radius.md },
  suggestTxt: { fontFamily: fonts.body, fontSize: 13, color: colors.brandPrimary },
  inputBar: { flexDirection: "row", alignItems: "flex-end", gap: 8, padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, maxHeight: 100, backgroundColor: colors.surfaceSecondary, paddingHorizontal: spacing.lg, paddingVertical: 12, borderRadius: radius.lg, fontFamily: fonts.body, color: colors.onSurface, fontSize: 14 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.brandPrimary, alignItems: "center", justifyContent: "center" },
});
