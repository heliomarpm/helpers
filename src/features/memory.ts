let store: Record<string, unknown> = {};

/**
 * A class that provides a memory store to save key-value pairs.
 */
const memory = {
    /**
     * Set a key-value pair in the memory store.
     * 
     * @param key The key to set.
     * @param value The value to set.
     * 
     */
    set<T>(key: string, value: T): void {
        store[key] = value;
    },

    /**
     * Get the value for a given key from the memory store.
     * 
     * @param key The key to get.
     * @returns The value for the given key, or undefined if the key is not found.
     */
    get<T>(key: string): T {
        return store[key] as T;
    },

    /**
     * Remove a key-value pair from the memory store.
     * 
     * @param key The key to remove.
     */
    remove(key: string): void {
        delete store[key];
    },

    /**
     * Clear all key-value pairs from the memory store.
     */
    clear(): void {
        store = {};
    },

    /**
     * Get all key-value pairs from the memory store as a Record<string, unknown>.
     * @returns All key-value pairs from the memory store as a Record<string, unknown>.
     */
    getAll(): Record<string, unknown> {
        return store;
    },

    /**
    * Returns the number of key-value pairs currently stored in the MemoryStore.
    *
    * @returns The number of key-value pairs in the MemoryStore.
    */
    size(): number {
        return Object.keys(store).length;
    }
}

export default memory;