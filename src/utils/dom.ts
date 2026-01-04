import { d2Snap, adaptiveD2Snap, type D2SnapResult } from "@webfuse-com/d2snap";
import type { CompressionStrategy } from "../types/orchestrator.types";

/**
 * Compress DOM with default parameters
 */
export const compressDOM = async (doc: Document): Promise<string> => {
    const clone = doc.cloneNode(true) as Document;

    // Use d2Snap with default compression parameters
    const result = await d2Snap(clone, 0.5, 0.5, 0.5);
    return result.html;
};

/**
 * Compress DOM with custom compression strategy
 */
export const compressDOMWithStrategy = async (
    doc: Document,
    strategy: CompressionStrategy
): Promise<D2SnapResult> => {
    const clone = doc.cloneNode(true) as Document;
    return await d2Snap(clone, strategy.k, strategy.l, strategy.m);
};

/**
 * Compress DOM adaptively based on token limits
 */
export const compressDOMAdaptive = async (
    doc: Document,
    maxTokens: number,
    maxIterations: number = 5
): Promise<D2SnapResult> => {
    const clone = doc.cloneNode(true) as Document;
    return await adaptiveD2Snap(clone, maxTokens, maxIterations);
};

/**
 * Get a preview of compressed DOM (first N characters)
 */
export const getDOMPreview = (domSnapshot: D2SnapResult, length: number = 4000): string => {
    return domSnapshot.html.slice(0, length);
};

/**
 * Clone the current document for safe manipulation
 */
export const cloneDocument = (doc: Document = document): Document => {
    return doc.cloneNode(true) as Document;
};

/**
 * Predefined compression strategies for different task types
 */
export const COMPRESSION_STRATEGIES: Record<string, CompressionStrategy> = {
    FORM_ENTRY: { k: 0.1, l: 0.8, m: 0.1 },
    RESEARCH: { k: 0.6, l: 0.1, m: 0.9 },
    NAVIGATION: { k: 0.9, l: 0.9, m: 0.2 },
    ANALYSIS: { k: 0.3, l: 0.4, m: 0.5 },
    DEFAULT: { k: 0.5, l: 0.5, m: 0.5 }
};

/**
 * Get compression strategy by name
 */
export const getCompressionStrategy = (strategyName: string): CompressionStrategy => {
    return COMPRESSION_STRATEGIES[strategyName] || COMPRESSION_STRATEGIES.DEFAULT;
};
