import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

export function useIconFonts(): [boolean, Error | null] {
  const [loaded, error] = useFonts({
    ...Ionicons.font,
  });

  return [loaded, error ?? null];
}
