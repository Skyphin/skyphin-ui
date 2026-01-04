/**
 * Orchestrator service type definitions
 */

export type TaskCategory = 'FORM_ENTRY' | 'RESEARCH' | 'NAVIGATION' | 'ANALYSIS';

export interface IntentResponse {
    category: TaskCategory;
}

export interface OptimizationDecision {
    confidence: number;
    k: number;
    l: number;
    m: number;
    action: 'LOCAL' | 'BACKEND';
}

export interface CompressionStrategy {
    k: number;
    l: number;
    m: number;
}
