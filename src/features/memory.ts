/**
 * A class that provides a memory store to save key-value pairs.
 */
export class MemoryStore {
    private static store: Record<string, unknown> = {};

    /**
     * Set a key-value pair in the memory store.
     * 
     * @param key The key to set.
     * @param value The value to set.
     * 
     */
    public static set<T>(key: string, value: T): void {
        MemoryStore.store[key] = value;
    }

    /**
     * Get the value for a given key from the memory store.
     * 
     * @param key The key to get.
     * @returns The value for the given key, or undefined if the key is not found.
     */
    public static get<T>(key: string): T {
        return MemoryStore.store[key] as T;
    }

    /**
     * Remove a key-value pair from the memory store.
     * 
     * @param key The key to remove.
     */
    public static remove(key: string): void {
        delete MemoryStore.store[key];
    }

    /**
     * Clear all key-value pairs from the memory store.
     */
    public static clear(): void {
        MemoryStore.store = {};
    }

    /**
     * Get all key-value pairs from the memory store as a Record<string, unknown>.
     * @returns All key-value pairs from the memory store as a Record<string, unknown>.
     */
    public static getAll(): Record<string, unknown> {
        return MemoryStore.store;
    }

    /**
    * Returns the number of key-value pairs currently stored in the MemoryStore.
    *
    * @returns The number of key-value pairs in the MemoryStore.
    */
    public static size(): number {
        return Object.keys(MemoryStore.store).length;
    }
}