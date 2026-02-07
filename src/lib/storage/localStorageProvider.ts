import type { StorageProvider } from "@/lib/storage/storage";
import { memoryStorage } from "@/lib/storage/storage";

export const localStorageProvider = (): StorageProvider => {
  if (typeof window === "undefined") {
    return memoryStorage();
  }

  return {
    get: async (key) => window.localStorage.getItem(key),
    set: async (key, value) => window.localStorage.setItem(key, value),
    clear: async (key) => window.localStorage.removeItem(key),
  };
};








