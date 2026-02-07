export interface StorageProvider {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  clear: (key: string) => Promise<void>;
}

export const memoryStorage = (): StorageProvider => {
  const store = new Map<string, string>();
  return {
    get: async (key) => store.get(key) ?? null,
    set: async (key, value) => {
      store.set(key, value);
    },
    clear: async (key) => {
      store.delete(key);
    },
  };
};
