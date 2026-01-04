/**
 * Agent service type definitions
 */

export interface Step {
    id: string;
    description: string;
    status: "pending" | "running" | "done" | "failed";
}

export type AgentState = "IDLE" | "ANALYZING" | "PLANNING" | "EXECUTING";

export type MessageType = "thinking" | "action" | "text" | "plan";

export type UpdateCallback = (
    text: string,
    type: MessageType,
    metadata?: any
) => void;
