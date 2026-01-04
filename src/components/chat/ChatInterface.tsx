import { useEffect, useRef } from "react";
import { PlanView } from "./PlanView";
import type { Message } from "../../types/chat.types";

// Re-export for convenience
export type { Message };

interface ChatInterfaceProps {
    messages: Message[];
}



export const ChatInterface = ({ messages }: ChatInterfaceProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex flex-col w-full h-full p-4 space-y-4 overflow-y-auto pb-20">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                >
                    <div
                        className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700"
                            }`}
                    >
                        {/* 1. Reasoning/Action Steps Section */}
                        {msg.role === "agent" && msg.metadata?.steps && msg.metadata.steps.length > 0 && (
                            <div className="mb-3 flex flex-col gap-2">
                                {msg.metadata.steps.map((step: any) => (
                                    <div key={step.id} className="flex items-start gap-2 text-xs opacity-80 bg-gray-50 dark:bg-zinc-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                                        <div className={`mt-0.5 w-2 h-2 rounded-full ${step.type === 'action' ? 'bg-amber-400' : 'bg-blue-400 animate-pulse'}`} />
                                        <div className="flex-1">
                                            <div className="font-semibold uppercase tracking-wider text-[10px] text-gray-400 mb-0.5">
                                                {step.type}
                                            </div>
                                            <div className="font-mono">{step.content}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 2. Main Content */}
                        {msg.content && (
                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                                {msg.content}
                            </div>
                        )}

                        {/* 3. Empty State/Spinner if nothing yet */}
                        {!msg.content && (!msg.metadata?.steps || msg.metadata.steps.length === 0) && (
                            <div className="flex items-center gap-2 text-gray-400 animate-pulse">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                            </div>
                        )}

                        {/* 4. Legacy/Fallback support */}
                        {msg.type === "plan" && msg.metadata?.steps && (
                            <PlanView steps={msg.metadata.steps} />
                        )}
                    </div>
                </div>
            ))}
            <div ref={scrollRef} />
        </div>
    );
};
