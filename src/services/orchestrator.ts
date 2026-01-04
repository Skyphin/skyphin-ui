
import EnvironmentManager from './environmentManager';
import {
    compressDOMWithStrategy,
    compressDOMAdaptive,
    getDOMPreview,
    COMPRESSION_STRATEGIES
} from '../utils/dom';
import type {
    TaskCategory,
    IntentResponse,
    OptimizationDecision
} from '../types/orchestrator.types';
import type {
    ChatCompletionResponse,
    Engine
} from '../types/llm.types';
import { BrowserService } from './browser';

const intentSystemPrompt = `You are a high-speed routing agent. Categorize the user task into exactly one of these categories:
- FORM_ENTRY: Filling fields, logging in, or data input.
- RESEARCH: Fact-finding, reading content, or summarization.
- NAVIGATION: Finding a specific button/link or moving through a menu.
- ANALYSIS: Comparing data, evaluating lists, or scanning tables.
Output ONLY JSON: {"category": "TYPE"}`;

const generateOptimizationPrompt = (category: TaskCategory): string => `You are a DOM compression expert specializing in the D2Snap algorithm. 
Goal: Set (k, l, m) parameters for a ${category} task.

COMPRESSION CHEAT SHEET:
- k (Hierarchy): 0.0 (Keep nested) to 1.0 (Flat). Use LOW for FORM_ENTRY.
- l (Text): 0.0 (Keep all) to 1.0 (Delete all). Use LOW for RESEARCH.
- m (Attributes): 0.0 (Keep all) to 1.0 (Strict). Use LOW for NAVIGATION (needs IDs/Classes).

DECISION RULE:
Set action to "LOCAL" only if the task is simple and confidence > 0.8. Otherwise, use "BACKEND".
Output ONLY JSON: {"confidence": float, "k": float, "l": float, "m": float, "action": "LOCAL"|"BACKEND"}`;

export async function orchestrator(
    userTask: string,
    dom: Document,
    engine: Engine
): Promise<ChatCompletionResponse> {
    const env = await EnvironmentManager.get();

    // --- STAGE 1: INTENT DISCOVERY ---
    const intentResponse = await engine.chat.completions.create({
        messages: [
            { role: 'system', content: intentSystemPrompt },
            { role: 'user', content: userTask }
        ],
        response_format: { type: 'json_object' }
    });

    const { category } = JSON.parse(intentResponse.choices[0].message.content) as IntentResponse;

    // Use compression strategies from dom utilities
    const strategy = COMPRESSION_STRATEGIES[category] || COMPRESSION_STRATEGIES.DEFAULT;

    // --- STAGE 2: BRANCHING BASED ON PRESSURE ---
    if (env.pressure === 'critical' || env.pressure === 'serious') {
        // Use safe fallback compression under system pressure
        const finalDOM = await compressDOMWithStrategy(dom, strategy);
        return await BrowserService.apiRequest('/agent/chat', {
            method: 'POST',
            body: {
                query: userTask,
                context: {
                    html: finalDOM.html,
                    mode: 'safe_mode_fallback',
                    tokens: finalDOM.meta.estimatedTokens,
                }
            }
        });
    }

    // HEALTHY MODE: Dynamic Parameter Optimization
    // Use hardware-calculated tokens for the adaptive pass
    const lightDOM = await compressDOMAdaptive(dom, env.adaptive.maxTokens, env.adaptive.maxIter);

    const optimizationResponse = await engine.chat.completions.create({
        messages: [
            { role: 'system', content: generateOptimizationPrompt(category) },
            { role: 'user', content: `Task: ${userTask}\nPreview: ${getDOMPreview(lightDOM)}` }
        ],
        response_format: { type: 'json_object' }
    });

    // Safe parsing to handle potential local model hiccups
    let decision: OptimizationDecision;
    try {
        decision = JSON.parse(optimizationResponse.choices[0].message.content) as OptimizationDecision;
    } catch (e) {
        // Fallback to strategy-based decision on parse error
        decision = { ...strategy, action: 'BACKEND', confidence: 0 };
    }

    // --- STAGE 3: EXECUTION ---
    if (decision.action === 'LOCAL' && decision.confidence > 0.8) {
        return await engine.chat.completions.create({
            messages: [{ role: 'user', content: `Task: ${userTask}\nContext: ${lightDOM.html}` }]
        });
    } else {
        // Perform the "Deep" downsample using the model's custom parameters
        const deepDOM = await compressDOMWithStrategy(dom, {
            k: decision.k,
            l: decision.l,
            m: decision.m
        });
        return await BrowserService.apiRequest('/agent/chat', {
            method: 'POST',
            body: {
                query: userTask,
                context: {
                    html: deepDOM.html,
                    mode: 'llm_optimized_backend',
                    tokens: deepDOM.meta.estimatedTokens,
                }
            }
        });
    }
}

export default orchestrator;