/**
 * LLM and Chat API type definitions
 * These types are reusable across different services
 */

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatCompletionRequest {
    messages: ChatMessage[];
    response_format?: { type: string };
}

export interface ChatCompletionResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

export interface Engine {
    chat: {
        completions: {
            create(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
        };
    };
}
