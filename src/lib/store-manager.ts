import { load, type Store } from "@tauri-apps/plugin-store";

// Define your store type here
// biome-ignore lint/suspicious/noEmptyInterface: off
export interface AppStore {}

/**
 * StoreManager is a singleton class that manages the application store.
 * Uses Tauri's plugin-store to persist data.
 */
class StoreManager {
    private store: Store | null = null;

    async initialize() {
        if (!this.store) {
            this.store = await load("store.json", {
                defaults: {},
                autoSave: true,
            });
        }
    }

    /**
     * Gets a value from the store.
     * @param key The key of the value to get.
     * @returns The value associated with the key, or undefined if the key does not exist.
     */
    async get<K extends keyof AppStore>(
        key: K,
    ): Promise<AppStore[K] | undefined> {
        await this.initialize();
        return await this.store?.get<AppStore[K]>(key as string);
    }

    /**
     * Sets a value in the store.
     * @param key The key of the value to set.
     * @param value The value to set.
     */
    async set<K extends keyof AppStore>(
        key: K,
        value: AppStore[K],
    ): Promise<void> {
        await this.initialize();
        await this.store?.set(key as string, value);
    }

    /**
     * Clears a value from the store.
     * @param key The key of the value to clear.
     * @returns A promise that resolves when the value is cleared.
     */
    async clear<K extends keyof AppStore>(key: K): Promise<void> {
        await this.store?.delete(key);
    }

    /**
     * Clears all values from the store.
     * @returns A promise that resolves when the store is cleared.
     */
    async clearAll(): Promise<void> {
        await this.initialize();
        await this.store?.clear();
    }
}

export const store = new StoreManager();
