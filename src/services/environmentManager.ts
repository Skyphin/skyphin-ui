// Type declarations for Compute Pressure API
declare global {
    interface PressureRecord {
        source: string;
        state: string;
        time: number;
    }

    interface PressureObserverCallback {
        (records: PressureRecord[]): void;
    }

    class PressureObserver {
        constructor(callback: PressureObserverCallback);
        observe(source: string, options?: { sampleInterval?: number }): void;
        unobserve(source: string): void;
        disconnect(): void;
    }

    interface Window {
        PressureObserver?: typeof PressureObserver;
    }
}

const EnvironmentManager = (() => {
    const specs = {
        cores: navigator.hardwareConcurrency || 4,
        memoryGB: (navigator as any).deviceMemory || 4,
        gpu: !!(navigator as any).gpu,
    };

    const getAdaptiveSpecs = () => {
        // High-end: 8k tokens, 5 iterations
        if (specs.gpu && specs.memoryGB >= 8) return { maxTokens: 8192, maxIter: 5 };
        // Mid-range: 4k tokens, 3 iterations
        if (specs.memoryGB >= 4) return { maxTokens: 4096, maxIter: 3 };
        // Low-end: 2k tokens, 2 iterations
        return { maxTokens: 2048, maxIter: 2 };
    };

    let currentPressure = "nominal";
    if (typeof window !== "undefined" && "PressureObserver" in window && window.PressureObserver) {
        try {
            const observer = new window.PressureObserver((r) => currentPressure = r[r.length - 1].state);
            observer.observe("cpu", { sampleInterval: 1000 });
        } catch (error) {
            console.warn("PressureObserver not supported:", error);
        }
    }

    return {
        get: async () => ({
            ...specs,
            pressure: currentPressure,
            adaptive: getAdaptiveSpecs(),
        })
    };
})();

export default EnvironmentManager;