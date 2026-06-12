declare module "*.png" {
  const value: unknown;
  export default value;
}

declare module "expo-router" {
  export const Stack: any;
  export const Tabs: any;
  export const Link: any;
  export function useRouter(): any;
  export function useFocusEffect(effect: any): void;
  export function useLocalSearchParams(): Record<string, string | string[]>;
}

declare module "expo-splash-screen" {
  export function preventAutoHideAsync(): Promise<boolean>;
  export function hideAsync(): Promise<boolean>;
}

declare module "expo-status-bar" {
  export const StatusBar: any;
}

declare module "expo-linear-gradient" {
  export const LinearGradient: any;
}

declare module "react" {
  export type ReactNode = any;
  export type ComponentType<P = any> = any;

  export function createContext<T>(value: T): any;
  export function useContext<T>(ctx: any): T;
  export function useEffect(
    effect: () => void | (() => void),
    deps?: readonly unknown[],
  ): void;
  export function useState<T>(initial: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps?: readonly unknown[]): T;
  export function useRef<T>(initial: T): { current: T };

  const React: any;
  export default React;
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module "react-native" {
  export const ActivityIndicator: any;
  export const FlatList: any;
  export const Image: any;
  export const ImageBackground: any;
  export const KeyboardAvoidingView: any;
  export const Modal: any;
  export const Platform: any;
  export const Pressable: any;
  export const ScrollView: any;
  export const Text: any;
  export const TextInput: any;
  export const View: any;
  export function useWindowDimensions(): { width: number; height: number };
  export const StyleSheet: {
    create<T extends Record<string, unknown>>(styles: T): T;
  };
}

declare module "@expo/vector-icons" {
  export const AntDesign: any;
  export const Feather: any;
  export const Ionicons: {
    font: Record<string, unknown>;
  };
}

declare module "expo-font" {
  export function loadAsync(map: Record<string, unknown>): Promise<void>;
  export function useFonts(
    map: Record<string, unknown>,
  ): [boolean, Error | null];
}

declare module "expo-secure-store" {
  export function getItemAsync(key: string): Promise<string | null>;
  export function setItemAsync(key: string, value: string): Promise<void>;
  export function deleteItemAsync(key: string): Promise<void>;
}

declare module "react-native-safe-area-context" {
  export const SafeAreaProvider: any;
  export const SafeAreaView: any;
}

declare module "react-native-gesture-handler" {
  export const GestureHandlerRootView: any;
}

declare const require: (path: string) => unknown;

declare const process: {
  env: {
    EXPO_PUBLIC_BACKEND_URL?: string;
  };
};

declare namespace JSX {
  type Element = any;

  interface ElementClass {
    render: any;
  }

  interface ElementAttributesProperty {
    props: any;
  }

  interface IntrinsicElements {
    [elementName: string]: any;
  }
}
