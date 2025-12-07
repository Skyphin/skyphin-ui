export interface TabInfo {
    id?: number;
    url?: string;
    title?: string;
    favIconUrl?: string;
}

export class BrowserService {
    static async getCurrentTab(): Promise<TabInfo> {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        return tabs[0] || {};
    }

    static async captureVisibleTab(): Promise<string> {
        return chrome.tabs.captureVisibleTab();
    }

    static async executeScript(tabId: number, func: () => void): Promise<void> {
        await chrome.scripting.executeScript({
            target: { tabId },
            func: func,
        });
    }

    static async sendMessage(tabId: number, message: any): Promise<any> {
        return chrome.tabs.sendMessage(tabId, message);
    }

    static async createTab(url: string): Promise<TabInfo> {
        return chrome.tabs.create({ url });
    }
}
