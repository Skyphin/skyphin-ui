import { BrowserService } from "./browser";
import { compressDOM } from "../utils/dom";
import type { Step, AgentState, UpdateCallback } from "../types/agent.types";

// Re-export types for external use
export type { Step, AgentState };



export class AgentService {
    private static backendUrl = "http://localhost:8080/api/agent/chat";

    static async processQuery(query: string, updateCallback: UpdateCallback, idToken?: string) {
        // 1. Get Context
        updateCallback("Gathering context...", "thinking");
        const tab = await BrowserService.getCurrentTab();

        if (!tab.id) {
            updateCallback("Error: No active tab found", "text");
            return;
        }

        let html = "";
        try {
            html = await BrowserService.getPageContent(tab.id);
        } catch (e) {
            console.warn("Failed to get page content, using minimal context", e);
        }

        // Parse HTML to Document for compression
        // Note: d2Snap running in SidePanel context won't have access to page layout (visuals),
        // so compression will be structural only.
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const context = {
            url: tab.url,
            title: tab.title,
            html: await compressDOM(doc)
        };

        updateCallback("Connecting to backend...", "thinking");

        try {
            const headers: any = { "Content-Type": "application/json" };
            if (idToken) {
                headers["Authorization"] = `Bearer ${idToken} `;
            }

            const response = await fetch(this.backendUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    query,
                    context
                })
            });

            if (!response.ok) throw new Error("Backend connection failed");

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No response body");

            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n\n");

                for (const line of lines) {
                    if (line.startsWith("data:")) {
                        try {
                            const data = JSON.parse(line.substring(5));

                            // Handle Events
                            if (data.type === "action") {
                                // Execute Action on Client Side!
                                updateCallback(data.content, "action", data.metadata);

                                // Perform the actual action
                                if (data.metadata?.actionName?.includes("createTab")) {
                                    // simplistic match
                                    await BrowserService.createTab("https://google.com");
                                }

                            } else {
                                updateCallback(data.content, data.type as any, data.metadata);
                            }
                        } catch (e) {
                            console.error("Parse error", e);
                        }
                    }
                }
            }
        }
        catch (e) {
            console.error("Error processing query", e);
            updateCallback("Error processing query", "text");
        }
    }
}
