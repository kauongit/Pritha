import * as SecureStore from "expo-secure-store";

const memoryStore = new Map<string, string>();

const isWeb = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const storage = {
  async getItem(key: string) {
    if (isWeb) {
      return window.localStorage.getItem(key);
    }

    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return memoryStore.get(key) ?? null;
    }
  },

  async setItem(key: string, value: string) {
    if (isWeb) {
      window.localStorage.setItem(key, value);
      return;
    }

    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      memoryStore.set(key, value);
    }
  },

  async removeItem(key: string) {
    if (isWeb) {
      window.localStorage.removeItem(key);
      return;
    }

    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      memoryStore.delete(key);
    }
  },
};
