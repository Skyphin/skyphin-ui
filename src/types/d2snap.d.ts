declare module '@webfuse-com/d2snap' {
    export interface D2SnapOptions {
        format?: boolean;
        indentSize?: number;
    }

    export interface D2SnapResult {
        html: string;
        meta: {
            estimatedTokens: number;
            compressionRatio: number;
        };
        parameters?: {
            k: number;
            l: number;
            m: number;
            adaptiveIterations?: number;
        };
    }


    /**
     * D2Snap DOM compression function
     * @param dom - DOM element or document to compress
     * @param k - Hierarchy parameter (0.0 to 1.0)
     * @param l - Text parameter (0.0 to 1.0)
     * @param m - Attributes parameter (0.0 to 1.0)
     * @param options - Optional formatting options
     */
    export function d2Snap(
        dom: Document | Element,
        k: number,
        l: number,
        m: number,
        options?: D2SnapOptions
    ): Promise<D2SnapResult>;

    /**
     * Adaptive D2Snap that automatically finds optimal compression parameters
     * @param dom - DOM element or document to compress
     * @param maxTokens - Maximum token count target
     * @param maxIterations - Maximum number of iterations to find optimal parameters
     * @param options - Optional formatting options
     */
    export function adaptiveD2Snap(
        dom: Document | Element,
        maxTokens: number,
        maxIterations: number,
        options?: D2SnapOptions
    ): Promise<D2SnapResult>;
}
