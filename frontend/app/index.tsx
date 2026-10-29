import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/auth";
import { colors, fonts, radius, spacing } from "@/src/theme";

const PHOTO = {
  hero: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=85",
  food: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",
  table: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=85",
  greens: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=85",
};

const OFFERINGS = [
  {
    number: "01",
    title: "Student diet plan",
    price: "₹250",
    note: "Thoughtful guidance that respects student life, budgets, and busy days.",
    image: PHOTO.food,
    icon: "feather" as const,
  },
  {
    number: "02",
    title: "Personal diet plan",
    price: "₹500",
    note: "A more personal starting point for your goals, preferences, and routine.",
    image: PHOTO.table,
    icon: "sun" as const,
  },
  {
    number: "03",
    title: "One-to-one consultation",
    price: "₹750",
    note: "Dedicated time to talk through your questions and next steps.",
    image: PHOTO.greens,
    icon: "heart" as const,
  },
];

const PRINCIPLES = [
  {
    icon: "coffee" as const,
    title: "Start with real life",
    text: "Your routine, food preferences, budget, and goals matter more than a trend.",
  },
  {
    icon: "leaf" as const,
    title: "Keep it sustainable",
    text: "Small, repeatable habits can feel kinder than chasing perfection.",
  },
  {
    icon: "heart" as const,
    title: "Make room for you",
    text: "Wellness should feel supportive, personal, and free from shame.",
  },
];

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const scrollRef = useRef<ScrollView | null>(null);
  const [sectionY, setSectionY] = useState({ services: 0, about: 0, approach: 0 });

  const go = (path: string) => router.push(path as any);
  const start = () => go(user ? "/(tabs)" : "/onboarding");
  const choosePlan = (kind: "diet" | "consult") => {
    if (!user) {
      go("/onboarding");
      return;
    }
    go(kind === "diet" ? "/diet-plan" : "/(tabs)/consult");
  };
  const jump = (section: "services" | "about" | "approach") => {
    scrollRef.current?.scrollTo({ y: sectionY[section], animated: true });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >
        <View style={[styles.shell, styles.nav]}>
          <Pressable style={styles.brand} onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}>
            <View style={styles.brandMark}>
              <Feather name="feather" size={20} color={colors.onBrandPrimary} />
            </View>
            <View>
              <Text style={styles.brandName}>pritha</Text>
              <Text style={styles.brandTag}>DAUGHTER OF EARTH</Text>
            </View>
          </Pressable>

          {wide && (
            <View style={styles.navLinks}>
              <Pressable onPress={() => jump("approach")}><Text style={styles.navLink}>Our philosophy</Text></Pressable>
              <Pressable onPress={() => jump("services")}><Text style={styles.navLink}>Offerings</Text></Pressable>
              <Pressable onPress={() => jump("about")}><Text style={styles.navLink}>Meet Yogini</Text></Pressable>
            </View>
          )}

          <Pressable style={styles.navCta} onPress={start}>
            <Text style={styles.navCtaText}>{user ? "Open Pritha" : "Begin here"}</Text>
            <Feather name="arrow-up-right" size={16} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={[styles.shell, styles.hero, wide ? styles.heroWide : styles.heroNarrow]}>
          <View style={[styles.heroCopy, wide ? styles.heroCopyWide : null]}>
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowLine} />
              <Text style={styles.eyebrow}>A MORE HUMAN KIND OF WELLNESS</Text>
            </View>
            <Text style={[styles.heroTitle, wide ? styles.heroTitleWide : styles.heroTitleNarrow]}>
              A gentler way to{"\n"}nourish the life{"\n"}you live.
            </Text>
            <Text style={styles.heroText}>
              Personal nutrition guidance and everyday rituals, shaped around your life — not someone else’s rules.
            </Text>
            <View style={[styles.heroButtons, !wide ? styles.heroButtonsNarrow : null]}>
              <Pressable style={styles.primaryButton} onPress={() => jump("services")}>
                <Text style={styles.primaryButtonText}>Explore offerings</Text>
                <Feather name="arrow-right" size={17} color="#FFFFFF" />
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => jump("about")}>
                <Text style={styles.secondaryButtonText}>Meet Yogini</Text>
              </Pressable>
            </View>
            <View style={styles.promiseRow}>
              <Feather name="check-circle" size={17} color={colors.brandPrimary} />
              <Text style={styles.promiseText}>Personal. Practical. Sustainable.</Text>
            </View>
          </View>

          <View style={[styles.heroVisual, wide ? styles.heroVisualWide : styles.heroVisualNarrow]}>
            <ImageBackground source={{ uri: PHOTO.hero }} resizeMode="cover" style={styles.heroImage}>
              <LinearGradient
                colors={["rgba(29, 42, 32, 0.02)", "rgba(29, 42, 32, 0.12)", "rgba(29, 42, 32, 0.78)"]}
                locations={[0, 0.45, 1]}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.imageTopPill}>
                <View style={styles.statusDot} />
                <Text style={styles.imageTopPillText}>A LITTLE SPACE TO BLOOM</Text>
              </View>
              <View style={styles.imageBottom}>
                <Text style={styles.imageQuote}>“Care for yourself like something growing.”</Text>
                <View style={styles.imageRule} />
                <Text style={styles.imageSignature}>THE PRITHA PHILOSOPHY</Text>
              </View>
            </ImageBackground>
            <View style={styles.floatingNote}>
              <View style={styles.floatingIcon}><Feather name="sun" size={18} color={colors.brandPrimary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.floatingTitle}>Less pressure. More care.</Text>
                <Text style={styles.floatingSub}>A softer approach to everyday nourishment.</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.shell, styles.promiseStrip, wide ? styles.promiseStripWide : styles.promiseStripNarrow]}>
          <View style={styles.promiseItem}>
            <Feather name="leaf" size={19} color={colors.brandPrimary} />
            <Text style={styles.promiseItemText}>Rooted in everyday food</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.promiseItem}>
            <Feather name="heart" size={19} color={colors.brandPrimary} />
            <Text style={styles.promiseItemText}>Made for real life</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.promiseItem}>
            <Feather name="sunrise" size={19} color={colors.brandPrimary} />
            <Text style={styles.promiseItemText}>Progress, not perfection</Text>
          </View>
        </View>

        <View
          onLayout={(e) => setSectionY((s) => ({ ...s, approach: e.nativeEvent.layout.y }))}
          style={[styles.shell, styles.approachSection]}
        >
          <View style={styles.sectionIntro}>
            <Text style={styles.kicker}>A NOTE FROM PRITHA</Text>
            <Text style={[styles.sectionTitle, wide ? styles.sectionTitleWide : null]}>
              Wellness should fit your life — not take it over.
            </Text>
            <Text style={styles.sectionDesc}>
              No dramatic promises. No one-size-fits-all rules. Just a more thoughtful relationship with food, routines, and yourself.
            </Text>
          </View>
          <View style={[styles.principles, wide ? styles.principlesWide : null]}>
            {PRINCIPLES.map((item, index) => (
              <View key={item.title} style={[styles.principleCard, wide ? styles.principleCardWide : null]}>
                <View style={styles.principleNumber}><Text style={styles.principleNumberText}>0{index + 1}</Text></View>
                <View style={styles.principleIcon}><Feather name={item.icon} size={20} color={colors.brandPrimary} /></View>
                <Text style={styles.principleTitle}>{item.title}</Text>
                <Text style={styles.principleText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View
          onLayout={(e) => setSectionY((s) => ({ ...s, services: e.nativeEvent.layout.y }))}
          style={[styles.shell, styles.servicesSection]}
        >
          <View style={[styles.servicesHeader, wide ? styles.servicesHeaderWide : null]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>WAYS WE CAN WORK TOGETHER</Text>
              <Text style={[styles.sectionTitle, wide ? styles.sectionTitleWide : null]}>A little support, in the way you need it.</Text>
            </View>
            <Text style={[styles.sectionDesc, styles.servicesDesc]}>
              Start with the option that feels right for you. Every journey begins with understanding your needs.
            </Text>
          </View>
          <View style={[styles.offerings, wide ? styles.offeringsWide : null]}>
            {OFFERINGS.map((item, index) => (
              <View key={item.number} style={[styles.offerCard, wide ? styles.offerCardWide : null]}>
                <ImageBackground
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  style={styles.offerImage}
                  imageStyle={{ borderTopLeftRadius: 22, borderTopRightRadius: 22 }}
                >
                  <View style={styles.offerNumber}><Text style={styles.offerNumberText}>{item.number}</Text></View>
                </ImageBackground>
                <View style={styles.offerBody}>
                  <View style={styles.offerTitleRow}>
                    <View style={styles.offerIcon}><Feather name={item.icon} size={18} color={colors.brandPrimary} /></View>
                    <Text style={styles.offerPrice}>{item.price}</Text>
                  </View>
                  <Text style={styles.offerTitle}>{item.title}</Text>
                  <Text style={styles.offerText}>{item.note}</Text>
                  <Pressable
                    onPress={() => choosePlan(index === 2 ? "consult" : "diet")}
                    style={styles.offerLink}
                  >
                    <Text style={styles.offerLinkText}>{user ? "Continue" : "Get started"}</Text>
                    <Feather name="arrow-up-right" size={16} color={colors.brandPrimary} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.priceNote}>Prices shown are the current listed starting options. Any final plan or appointment details can be confirmed before proceeding.</Text>
        </View>

        <View
          onLayout={(e) => setSectionY((s) => ({ ...s, about: e.nativeEvent.layout.y }))}
          style={[styles.shell, styles.aboutWrap]}
        >
          <View style={[styles.aboutPanel, wide ? styles.aboutPanelWide : null]}>
            <View style={[styles.aboutVisual, wide ? styles.aboutVisualWide : null]}>
              <ImageBackground source={{ uri: PHOTO.greens }} resizeMode="cover" style={styles.aboutImage}>
                <View style={styles.aboutImageCaption}>
                  <Text style={styles.aboutCaptionSmall}>A PHILOSOPHY OF CARE</Text>
                  <Text style={styles.aboutCaption}>Nourish, don’t punish.</Text>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.aboutCopy}>
              <Text style={styles.aboutKicker}>THE PERSON BEHIND THE PRACTICE</Text>
              <Text style={styles.aboutTitle}>Meet Yogini.</Text>
              <Text style={styles.aboutText}>
                Pritha is Yogini Kudtarkar’s space for a calmer, more considered approach to nutrition and wellbeing.
              </Text>
              <Text style={styles.aboutText}>
                The belief is simple: guidance should make everyday choices feel clearer, not heavier. Your habits, preferences, and circumstances deserve a seat at the table.
              </Text>
              <View style={styles.signatureRow}>
                <View style={styles.signatureLeaf}><Feather name="feather" size={18} color="#E7D8B8" /></View>
                <View>
                  <Text style={styles.signatureName}>Yogini Kudtarkar</Text>
                  <Text style={styles.signatureSub}>A thoughtful approach to nourishment</Text>
                </View>
              </View>
              <Pressable style={styles.aboutButton} onPress={start}>
                <Text style={styles.aboutButtonText}>Step into Pritha</Text>
                <Feather name="arrow-right" size={16} color={colors.onSurface} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={[styles.shell, styles.closingSection]}>
          <View style={styles.closingLeaf}><Feather name="feather" size={24} color={colors.brandPrimary} /></View>
          <Text style={styles.closingKicker}>A SMALL REMINDER</Text>
          <Text style={[styles.closingTitle, wide ? styles.closingTitleWide : null]}>
            You don’t have to change everything. Just begin with care.
          </Text>
          <Text style={styles.closingText}>
            Your next step can be a small one. Let’s make it a little easier to take.
          </Text>
          <Pressable style={styles.primaryButton} onPress={start}>
            <Text style={styles.primaryButtonText}>{user ? "Return to your sanctuary" : "Begin your journey"}</Text>
            <Feather name="arrow-right" size={17} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.disclaimer}>
            Pritha offers supportive wellness guidance and is not a substitute for diagnosis, medical treatment, or advice from your healthcare professional.
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerInner}>
            <View style={styles.footerBrand}>
              <View style={styles.brandMark}><Feather name="feather" size={18} color={colors.onBrandPrimary} /></View>
              <View>
                <Text style={styles.footerBrandName}>pritha</Text>
                <Text style={styles.footerTag}>DAUGHTER OF EARTH</Text>
              </View>
            </View>
            <Text style={styles.footerLine}>Made with care, for the life you live.</Text>
            <Pressable onPress={() => go(user ? "/(tabs)" : "/(auth)/sign-in")} style={styles.footerLink}>
              <Text style={styles.footerLinkText}>{user ? "Open your space" : "Already part of Pritha? Sign in"}</Text>
              <Feather name="arrow-up-right" size={15} color="#E7D8B8" />
            </Pressable>
            <Text style={styles.copyright}>© {new Date().getFullYear()} Pritha. A little space to bloom.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F6F0" },
  page: { backgroundColor: "#F8F6F0", paddingBottom: 0 },
  shell: { width: "100%", maxWidth: 1220, alignSelf: "center", paddingHorizontal: 28 },
  nav: { minHeight: 88, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 18 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.brandPrimary, alignItems: "center", justifyContent: "center" },
  brandName: { color: colors.onSurface, fontFamily: fonts.displayBold, fontSize: 25, letterSpacing: -0.8 },
  brandTag: { color: colors.brandSecondary, fontFamily: fonts.bodyMed, fontSize: 8, letterSpacing: 2.1, marginTop: -1 },
  navLinks: { flexDirection: "row", alignItems: "center", gap: 30 },
  navLink: { color: colors.onSurfaceSecondary, fontFamily: fonts.bodyMed, fontSize: 13 },
  navCta: { backgroundColor: colors.brandPrimary, borderRadius: radius.pill, paddingVertical: 12, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", gap: 8 },
  navCtaText: { color: "#FFFFFF", fontFamily: fonts.bodyMed, fontSize: 13 },
  hero: { paddingTop: 35, paddingBottom: 68 },
  heroWide: { flexDirection: "row", alignItems: "center", gap: 54 },
  heroNarrow: { flexDirection: "column", gap: 34, paddingTop: 30, paddingBottom: 44 },
  heroCopy: { width: "100%" },
  heroCopyWide: { flex: 1, width: "auto", paddingVertical: 28 },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  eyebrowLine: { height: 1, width: 26, backgroundColor: colors.brandSecondary },
  eyebrow: { color: colors.brandSecondary, fontFamily: fonts.bodyMed, fontSize: 10, letterSpacing: 2.1 },
  heroTitle: { color: colors.onSurface, fontFamily: fonts.display, letterSpacing: -1.2, marginBottom: 18 },
  heroTitleWide: { fontSize: 58, lineHeight: 64 },
  heroTitleNarrow: { fontSize: 43, lineHeight: 48 },
  heroText: { maxWidth: 480, color: colors.onSurfaceSecondary, fontFamily: fonts.body, fontSize: 16, lineHeight: 26, marginBottom: 24 },
  heroButtons: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 12 },
  heroButtonsNarrow: { alignItems: "stretch" },
  primaryButton: { backgroundColor: colors.brandPrimary, borderRadius: radius.pill, paddingVertical: 15, paddingHorizontal: 21, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 14 },
  primaryButtonText: { color: "#FFFFFF", fontFamily: fonts.bodyMed, fontSize: 14 },
  secondaryButton: { borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: 21, alignItems: "center", justifyContent: "center" },
  secondaryButtonText: { color: colors.onSurface, fontFamily: fonts.bodyMed, fontSize: 14 },
  promiseRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 23 },
  promiseText: { color: colors.muted, fontFamily: fonts.body, fontSize: 12 },
  heroVisual: { borderRadius: 30, overflow: "visible", position: "relative" },
  heroVisualWide: { width: "43%", height: 490 },
  heroVisualNarrow: { width: "100%", height: 370, marginBottom: 34 },
  heroImage: { width: "100%", height: "100%", borderRadius: 30, overflow: "hidden", justifyContent: "space-between" },
  imageTopPill: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", margin: 20, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: radius.pill, paddingVertical: 9, paddingHorizontal: 12, gap: 8 },
  statusDot: { height: 7, width: 7, borderRadius: 4, backgroundColor: "#7C936E" },
  imageTopPillText: { fontFamily: fonts.bodyMed, fontSize: 9, letterSpacing: 1.3, color: colors.onSurface },
  imageBottom: { padding: 28 },
  imageQuote: { color: "#FFFFFF", fontFamily: fonts.display, fontSize: 29, lineHeight: 35, maxWidth: 330 },
  imageRule: { width: 44, height: 2, backgroundColor: "#D8C8A7", marginTop: 18, marginBottom: 12 },
  imageSignature: { fontFamily: fonts.bodyMed, fontSize: 9, letterSpacing: 2, color: "#F0E6D2" },
  floatingNote: { position: "absolute", left: -20, bottom: -20, maxWidth: 300, flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#EAE5D9", padding: 15, shadowColor: "#343A32", shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 7 }, elevation: 5 },
  floatingIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#EDF0E6", alignItems: "center", justifyContent: "center" },
  floatingTitle: { color: colors.onSurface, fontFamily: fonts.bodyMed, fontSize: 13 },
  floatingSub: { color: colors.muted, fontFamily: fonts.body, fontSize: 11, lineHeight: 16, marginTop: 3 },
  promiseStrip: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#E8E2D7", paddingVertical: 23 },
  promiseStripWide: { flexDirection: "row", alignItems: "center", justifyContent: "space-around" },
  promiseStripNarrow: { flexDirection: "column", alignItems: "flex-start", gap: 16 },
  promiseItem: { flexDirection: "row", alignItems: "center", gap: 11 },
  promiseItemText: { color: colors.onSurfaceSecondary, fontFamily: fonts.bodyMed, fontSize: 13 },
  stripDivider: { width: 1, height: 25, backgroundColor: "#DCD5C8" },
  approachSection: { paddingTop: 90, paddingBottom: 90 },
  sectionIntro: { maxWidth: 720, alignSelf: "center", alignItems: "center", marginBottom: 38 },
  kicker: { color: colors.brandSecondary, fontFamily: fonts.bodyMed, fontSize: 10, letterSpacing: 2.2, textAlign: "center", marginBottom: 14 },
  sectionTitle: { color: colors.onSurface, fontFamily: fonts.display, fontSize: 36, lineHeight: 43, letterSpacing: -0.7, textAlign: "center", marginBottom: 14 },
  sectionTitleWide: { fontSize: 45, lineHeight: 53 },
  sectionDesc: { color: colors.onSurfaceSecondary, fontFamily: fonts.body, fontSize: 15, lineHeight: 25, textAlign: "center" },
  principles: { flexDirection: "column", gap: 14 },
  principlesWide: { flexDirection: "row", alignItems: "stretch" },
  principleCard: { backgroundColor: "#F0EEE6", borderRadius: 22, borderWidth: 1, borderColor: "#E9E4D9", padding: 24, minHeight: 210 },
  principleCardWide: { flex: 1 },
  principleNumber: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#E1E6D8", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  principleNumberText: { color: colors.brandPrimary, fontFamily: fonts.bodyMed, fontSize: 11 },
  principleIcon: { marginBottom: 12 },
  principleTitle: { color: colors.onSurface, fontFamily: fonts.displayBold, fontSize: 22, marginBottom: 8 },
  principleText: { color: colors.onSurfaceSecondary, fontFamily: fonts.body, fontSize: 13, lineHeight: 21 },
  servicesSection: { paddingTop: 78, paddingBottom: 84, backgroundColor: "#F0EEE6", maxWidth: "100%", paddingHorizontal: 28 },
  servicesHeader: { gap: 18, marginBottom: 32 },
  servicesHeaderWide: { flexDirection: "row", alignItems: "flex-end", maxWidth: 1164, width: "100%", alignSelf: "center" },
  servicesDesc: { maxWidth: 380, textAlign: "left", marginBottom: 18 },
  offerings: { flexDirection: "column", gap: 18, width: "100%", maxWidth: 1164, alignSelf: "center" },
  offeringsWide: { flexDirection: "row", alignItems: "stretch" },
  offerCard: { flexDirection: "column", backgroundColor: "#FBFAF6", borderRadius: 22, borderWidth: 1, borderColor: "#E4DFD3", overflow: "hidden" },
  offerCardWide: { flex: 1 },
  offerImage: { height: 175, width: "100%", justifyContent: "flex-start", alignItems: "flex-end", padding: 14, overflow: "hidden" },
  offerNumber: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: "rgba(255,255,255,0.91)" },
  offerNumberText: { color: colors.onSurface, fontFamily: fonts.bodyMed, fontSize: 10, letterSpacing: 1 },
  offerBody: { padding: 22, flex: 1 },
  offerTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 },
  offerIcon: { height: 39, width: 39, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#E5EADF" },
  offerPrice: { color: colors.brandPrimary, fontFamily: fonts.displayBold, fontSize: 24 },
  offerTitle: { color: colors.onSurface, fontFamily: fonts.displayBold, fontSize: 23, marginBottom: 9 },
  offerText: { flex: 1, color: colors.onSurfaceSecondary, fontFamily: fonts.body, fontSize: 13, lineHeight: 21, marginBottom: 22 },
  offerLink: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#E7E2D8", paddingTop: 16, marginTop: "auto" },
  offerLinkText: { fontFamily: fonts.bodyMed, color: colors.brandPrimary, fontSize: 13 },
  priceNote: { maxWidth: 1164, alignSelf: "center", marginTop: 18, fontFamily: fonts.body, fontSize: 11, lineHeight: 17, color: colors.muted },
  aboutWrap: { paddingTop: 84, paddingBottom: 84 },
  aboutPanel: { backgroundColor: "#2F3C31", borderRadius: 30, overflow: "hidden" },
  aboutPanelWide: { flexDirection: "row", alignItems: "stretch" },
  aboutVisual: { height: 240 },
  aboutVisualWide: { width: "43%", height: "auto", minHeight: 480 },
  aboutImage: { width: "100%", height: "100%", minHeight: 240, justifyContent: "flex-end" },
  aboutImageCaption: { backgroundColor: "rgba(30,42,33,0.74)", padding: 23 },
  aboutCaptionSmall: { color: "#E8DDC5", fontFamily: fonts.bodyMed, fontSize: 9, letterSpacing: 1.7, marginBottom: 6 },
  aboutCaption: { color: "#FFFFFF", fontFamily: fonts.display, fontSize: 26 },
  aboutCopy: { padding: 30, flex: 1, justifyContent: "center" },
  aboutKicker: { color: "#D6C9A9", fontFamily: fonts.bodyMed, fontSize: 10, letterSpacing: 1.8, marginBottom: 14 },
  aboutTitle: { color: "#FFFFFF", fontFamily: fonts.display, fontSize: 42, lineHeight: 48, marginBottom: 17 },
  aboutText: { color: "#E6E7DF", fontFamily: fonts.body, fontSize: 14, lineHeight: 23, marginBottom: 13, maxWidth: 500 },
  signatureRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10, marginBottom: 24 },
  signatureLeaf: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#465448", alignItems: "center", justifyContent: "center" },
  signatureName: { color: "#FFFFFF", fontFamily: fonts.bodyMed, fontSize: 14 },
  signatureSub: { color: "#C1C7B9", fontFamily: fonts.body, fontSize: 11, marginTop: 4 },
  aboutButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F0E7D3", borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 13 },
  aboutButtonText: { color: colors.onSurface, fontFamily: fonts.bodyMed, fontSize: 13 },
  closingSection: { alignItems: "center", paddingTop: 18, paddingBottom: 95 },
  closingLeaf: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#E3E8DB", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  closingKicker: { color: colors.brandSecondary, fontFamily: fonts.bodyMed, fontSize: 10, letterSpacing: 2, marginBottom: 14 },
  closingTitle: { maxWidth: 690, color: colors.onSurface, fontFamily: fonts.display, textAlign: "center", fontSize: 36, lineHeight: 43, marginBottom: 14 },
  closingTitleWide: { fontSize: 49, lineHeight: 57 },
  closingText: { color: colors.onSurfaceSecondary, fontFamily: fonts.body, textAlign: "center", maxWidth: 490, fontSize: 15, lineHeight: 24, marginBottom: 24 },
  disclaimer: { maxWidth: 690, color: colors.muted, fontFamily: fonts.body, fontSize: 11, lineHeight: 18, textAlign: "center", marginTop: 23 },
  footer: { backgroundColor: "#253127", paddingVertical: 34, paddingHorizontal: 28 },
  footerInner: { width: "100%", maxWidth: 1164, alignSelf: "center", alignItems: "center" },
  footerBrand: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 15 },
  footerBrandName: { color: "#FFFFFF", fontFamily: fonts.displayBold, fontSize: 24 },
  footerTag: { color: "#DFD4BC", fontFamily: fonts.bodyMed, fontSize: 8, letterSpacing: 2, marginTop: -1 },
  footerLine: { color: "#E2E5DC", fontFamily: fonts.body, fontSize: 13, marginBottom: 14, textAlign: "center" },
  footerLink: { flexDirection: "row", alignItems: "center", gap: 7, padding: 8 },
  footerLinkText: { color: "#E7D8B8", fontFamily: fonts.bodyMed, fontSize: 12 },
  copyright: { color: "#AEB9AD", fontFamily: fonts.body, fontSize: 10, marginTop: 15 },
});
