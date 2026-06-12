import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import * as Font from "expo-font";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useIconFonts } from "@/src/hooks/use-icon-fonts";
import { AuthProvider } from "@/src/auth";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

const FONTS = {
  Fraunces_500Medium: "https://fonts.gstatic.com/s/fraunces/v37/6NUh8FyLNQOQZAnv9bYL0vXJjGSi2HU.ttf",
  Fraunces_600SemiBold: "https://fonts.gstatic.com/s/fraunces/v37/6NUh8FyLNQOQZAnv9bYL0vXJjGSi2HU.ttf",
  DMSans_400Regular: "https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAop6joR-d.ttf",
  DMSans_500Medium: "https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAop6jVw-d.ttf",
  DMSans_700Bold: "https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAop6jrwGd.ttf",
};

export default function RootLayout() {
  const [iconsLoaded, iconsErr] = useIconFonts();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync(FONTS as any)
      .then(() => setFontsLoaded(true))
      .catch(() => setFontsLoaded(true));
  }, []);

  useEffect(() => {
    if ((iconsLoaded || iconsErr) && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [iconsLoaded, iconsErr, fontsLoaded]);

  if ((!iconsLoaded && !iconsErr) || !fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#FBF9F6" } }} />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
