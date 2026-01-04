import { CheckCircle, Circle, Loader2, XCircle } from "lucide-react";
import type { Step } from "../../types/agent.types";


interface PlanViewProps {
    steps: Step[];
}

export const PlanView = ({ steps }: PlanViewProps) => {
    return (
        <div className="flex flex-col space-y-2 w-full mt-2">
            <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                Execution Plan
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
                {steps.map((step, index) => (
                    <div
                        key={step.id || index}
                        className="flex items-center p-3 border-b last:border-0 border-gray-100 dark:border-zinc-700/50 text-sm"
                    >
                        <div className="mr-3 flex-shrink-0">
                            {step.status === "done" && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            {step.status === "running" && (
                                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                            )}
                            {step.status === "failed" && (
                                <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            {step.status === "pending" && (
                                <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <span className={`
                                ${step.status === "done" ? "text-gray-500 line-through" : "text-gray-800 dark:text-gray-200"}
                            `}>
                                {step.description}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
