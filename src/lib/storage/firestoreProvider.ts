import { deleteField, doc, getDoc, setDoc } from "firebase/firestore";
import type { StorageProvider } from "@/lib/storage/storage";
import { memoryStorage } from "@/lib/storage/storage";
import { firestore } from "@/lib/firebase/client";

const COLLECTION = "appFinance";
const DOC_ID = "default";

export const firestoreProvider = (): StorageProvider => {
  if (typeof window === "undefined") {
    return memoryStorage();
  }

  const ref = doc(firestore, COLLECTION, DOC_ID);

  return {
    get: async (key) => {
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) return null;
      const data = snapshot.data() as Record<string, string | undefined>;
      return data[key] ?? null;
    },
    set: async (key, value) => {
      await setDoc(ref, { [key]: value }, { merge: true });
    },
    clear: async (key) => {
      await setDoc(ref, { [key]: deleteField() }, { merge: true });
    },
  };
};
