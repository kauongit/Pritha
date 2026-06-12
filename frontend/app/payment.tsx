import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/auth";
import { api } from "@/src/api";
import { colors, fonts, spacing, radius } from "@/src/theme";

export default function Payment() {
  const router = useRouter();
  const { token } = useAuth();
  const { kind, ref_id, amount, is_student } = useLocalSearchParams<{ kind: string; ref_id: string; amount: string; is_student?: string }>();
  const [stage, setStage] = useState<"intro" | "processing" | "done" | "error">("intro");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const pay = async () => {
    setStage("processing"); setErr(null);
    try {
      const order = await api<any>("/payments/order", {
        method: "POST", token,
        body: { kind, ref_id, is_student: is_student === "true" },
      });
      setOrderId(order.order_id);
      // MOCK: pretend Razorpay checkout opened and succeeded after 1.5s
      await new Promise(r => setTimeout(r, 1500));
      await api("/payments/verify", {
        method: "POST", token,
        body: { order_id: order.order_id, razorpay_payment_id: "", razorpay_signature: "" },
      });
      setStage("done");
    } catch (e: any) { setErr(e.message); setStage("error"); }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.head}>
        <Pressable onPress={() => router.back()}><Feather name="x" size={22} color={colors.onSurface} /></Pressable>
        <Text style={styles.title}>Secure Payment</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.body}>
        {stage === "intro" && (
          <>
            <View style={styles.card}>
              <Text style={styles.eyebrow}>— ORDER SUMMARY</Text>
              <Text style={styles.itemTitle}>{kind === "diet_plan" ? "Custom Diet Plan" : "1:1 Video Consultation"}</Text>
              <Text style={styles.itemSub}>Crafted personally by Yogini Kurtadkar</Text>
              <View style={styles.divider} />
              <View style={styles.row}><Text style={styles.rowLbl}>Subtotal</Text><Text style={styles.rowVal}>₹{amount}</Text></View>
              <View style={styles.row}><Text style={styles.rowLbl}>Razorpay (mock)</Text><Text style={[styles.rowVal, { color: colors.success }]}>₹0</Text></View>
              <View style={[styles.row, { marginTop: 8 }]}><Text style={styles.totalLbl}>Total</Text><Text style={styles.total}>₹{amount}</Text></View>
            </View>
            <View style={styles.mockBox}>
              <Feather name="info" size={14} color={colors.brandSecondary} />
              <Text style={styles.mockTxt}>Mock payment mode. No real charge.</Text>
            </View>
            <Pressable testID="pay-now" style={styles.payBtn} onPress={pay}>
              <Feather name="lock" size={16} color="#fff" />
              <Text style={styles.payTxt}>Pay ₹{amount}</Text>
            </Pressable>
          </>
        )}
        {stage === "processing" && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.brandPrimary} />
            <Text style={styles.statusTxt}>Securing your payment...</Text>
          </View>
        )}
        {stage === "done" && (
          <View style={styles.center}>
            <View style={styles.successCircle}><Feather name="check" size={36} color="#fff" /></View>
            <Text style={styles.statusH}>Payment received</Text>
            <Text style={styles.statusTxt}>Yogini will reach out within 48 hours.</Text>
            <Text style={styles.orderId}>Order: {orderId}</Text>
            <Pressable testID="pay-done" style={[styles.payBtn, { marginTop: 32 }]} onPress={() => router.replace("/(tabs)")}>
              <Text style={styles.payTxt}>Back to sanctuary</Text>
            </Pressable>
          </View>
        )}
        {stage === "error" && (
          <View style={styles.center}>
            <Feather name="alert-circle" size={48} color={colors.error} />
            <Text style={styles.statusH}>Something stirred up</Text>
            <Text style={styles.statusTxt}>{err}</Text>
            <Pressable style={styles.payBtn} onPress={pay}><Text style={styles.payTxt}>Try again</Text></Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg },
  title: { fontFamily: fonts.bodyBold, color: colors.onSurface, fontSize: 15 },
  body: { flex: 1, padding: spacing.xl },
  card: { backgroundColor: colors.surfaceSecondary, padding: spacing.xl, borderRadius: radius.lg },
  eyebrow: { fontFamily: fonts.bodyMed, color: colors.brandSecondary, letterSpacing: 2, fontSize: 11, marginBottom: 6 },
  itemTitle: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.onSurface },
  itemSub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  rowLbl: { fontFamily: fonts.body, color: colors.onSurfaceSecondary, fontSize: 14 },
  rowVal: { fontFamily: fonts.bodyMed, color: colors.onSurface, fontSize: 14 },
  totalLbl: { fontFamily: fonts.bodyBold, color: colors.onSurface, fontSize: 16 },
  total: { fontFamily: fonts.displayBold, color: colors.onSurface, fontSize: 22 },
  mockBox: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, backgroundColor: colors.brandTertiary, borderRadius: radius.md, marginTop: spacing.lg },
  mockTxt: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceSecondary },
  payBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.brandPrimary, paddingVertical: 16, borderRadius: radius.pill, marginTop: spacing.xl },
  payTxt: { color: "#fff", fontFamily: fonts.bodyMed, fontSize: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.success, alignItems: "center", justifyContent: "center", marginBottom: spacing.lg },
  statusH: { fontFamily: fonts.displayBold, fontSize: 24, color: colors.onSurface, marginTop: spacing.md },
  statusTxt: { fontFamily: fonts.body, color: colors.onSurfaceSecondary, marginTop: 8, textAlign: "center" },
  orderId: { fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: spacing.xl },
});
