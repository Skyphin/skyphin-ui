import type { TabInfo } from "../types/browser.types";

// Re-export for external use
export type { TabInfo };

export class BrowserService {
    static async getCurrentTab(): Promise<TabInfo> {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        return tabs[0] || {};
    }

    static async captureVisibleTab(): Promise<string> {
        return chrome.tabs.captureVisibleTab();
    }

    static async executeScript<T>(tabId: number, func: () => T): Promise<T> {
        const results = await chrome.scripting.executeScript({
            target: { tabId },
            func: func,
        });
        return results[0]?.result as T;
    }

    static async sendMessage(tabId: number, message: any): Promise<any> {
        return chrome.tabs.sendMessage(tabId, message);
    }

    static async createTab(url: string): Promise<TabInfo> {
        return chrome.tabs.create({ url });
    }

    /**
     * Get the HTML content of the specified tab
     */
    static async getPageContent(tabId: number): Promise<string> {
        return this.executeScript(tabId, () => document.documentElement.outerHTML);
    }

    /**
     * Send API request directly with Firebase auth
     */
    static async apiRequest(
        path: string,
        options: {
            method?: string;
            body?: any;
            headers?: Record<string, string>;
        },
        idToken?: string
    ): Promise<any> {
        const API_URL = 'http://localhost:8080/api';

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        if (idToken) {
            headers['Authorization'] = `Bearer ${idToken}`;
        }

        try {
            const response = await fetch(`${API_URL}${path}`, {
                method: options.method || 'GET',
                headers,
                body: options.body ? JSON.stringify(options.body) : undefined
            });

            if (!response.ok) {
                // Try to parse error message from body
                let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData.error) errorMessage = errorData.error;
                } catch { /* ignore parsing error */ }

                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    /**
     * Open side panel
     */
    static async openSidePanel(): Promise<void> {
        const tab = await this.getCurrentTab();
        if (tab.windowId) {
            await chrome.sidePanel.open({ windowId: tab.windowId });
        }
    }
}

