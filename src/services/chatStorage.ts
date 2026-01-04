import type { Message } from "../types/chat.types";

export class ChatStorageService {
    private static STORAGE_PREFIX = "chat_";

    /**
     * Save messages for a specific tab
     */
    static async saveMessages(tabId: number, messages: Message[]): Promise<void> {
        if (!tabId || tabId === chrome.tabs.TAB_ID_NONE) return;

        const key = `${this.STORAGE_PREFIX}${tabId}`;
        await chrome.storage.local.set({ [key]: messages });
    }

    /**
     * Load messages for a specific tab
     */
    static async loadMessages(tabId: number): Promise<Message[]> {
        if (!tabId || tabId === chrome.tabs.TAB_ID_NONE) return [];

        const key = `${this.STORAGE_PREFIX}${tabId}`;
        const result = await chrome.storage.local.get(key);
        return result[key] || [];
    }

    /**
     * Clear messages for a specific tab
     */
    static async clearMessages(tabId: number): Promise<void> {
        if (!tabId) return;

        const key = `${this.STORAGE_PREFIX}${tabId}`;
        await chrome.storage.local.remove(key);
    }
}
