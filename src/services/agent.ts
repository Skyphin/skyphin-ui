import { BrowserService } from "./browser";

export interface Step {
    id: string;
    description: string;
    status: "pending" | "running" | "done" | "failed";
}

export class AgentService {
    static async processQuery(query: string, updateCallback: (text: string, type: "thinking" | "action" | "text", metadata?: any) => void) {
        // 1. Thinking
        updateCallback(`Analyzing request: "${query}"...`, "thinking");
        await new Promise(r => setTimeout(r, 1000));

        // 2. Planning (Mock)
        updateCallback("Planning actions...", "thinking");
        await new Promise(r => setTimeout(r, 800));

        // 3. Action: Get current tab info
        updateCallback("Getting current tab info...", "action", { actionName: "getCurrentTab" });
        const tab = await BrowserService.getCurrentTab();

        // 4. Response
        const response = `I checked the current tab. \nTitle: ${tab.title}\nURL: ${tab.url}`;
        updateCallback(response, "text");
    }
}
