import { useEffect, useRef } from "react";

export interface Message {
    id: string;
    role: "user" | "agent";
    content: string;
    type?: "text" | "thinking" | "action";
    metadata?: any;
}

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
                        className={`max-w-[80%] rounded-xl p-3 text-sm ${msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-gray-200"
                            }`}
                    >
                        {msg.type === "thinking" && (
                            <div className="flex items-center space-x-2 text-xs italic opacity-70 mb-1">
                                <span>Thinking...</span>
                            </div>
                        )}
                        {msg.type === "action" && (
                            <div className="flex items-center space-x-2 text-xs font-mono bg-black/10 dark:bg-black/30 p-1 rounded mb-1">
                                <span>ACTION: {msg.metadata?.actionName}</span>
                            </div>
                        )}
                        <div className="whitespace-pre-wrap break-words hyphens-auto">{msg.content}</div>
                    </div>
                </div>
            ))}
            <div ref={scrollRef} />
        </div>
    );
};
