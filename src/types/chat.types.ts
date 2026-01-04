/**
 * Chat UI component type definitions
 */

export type MessageType = "text" | "thinking" | "action" | "plan";

export interface Citation {
    title: string;
    url: string;
    snippet?: string;
}

export interface AgentStep {
    id: string;
    type: "thinking" | "action";
    content: string;
    status: "pending" | "running" | "completed" | "failed";
    metadata?: any;
}

export interface Message {
    id: string;
    role: "user" | "agent";
    content: string; // The main text (final answer)
    type?: MessageType;
    metadata?: {
        steps?: AgentStep[]; // Usage: specific reasoning/action steps
        citations?: Citation[]; // Usage: reference links
        processingTime?: number;
    } & any;
}
