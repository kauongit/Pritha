import { AntDesign, Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";

export function useIconFonts() {
  return useFonts({
    ...AntDesign.font,
    ...Feather.font,
  });
}
