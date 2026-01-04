import { memo, useRef, useState } from "react";
import { useUrl } from "../hooks/useUrl";

interface ActionPanelProps {
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export const ActionPanel = memo(({ onSendMessage, isLoading }: ActionPanelProps) => {
  const { state } = useUrl();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && onSendMessage) {
        onSendMessage(input.trim());
        setInput("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    }
  };

  return (
    <div className="sticky bottom-0 w-full z-20 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 p-4">
      <div className="w-full h-full flex flex-col rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        {/* Tab Context Header */}
        <div className="flex items-center gap-2 p-3 border-b border-gray-100 dark:border-zinc-700/50">
          <div className="w-5 h-5 rounded-full bg-white dark:bg-zinc-700 flex items-center justify-center overflow-hidden shrink-0 p-0.5 border border-gray-100 dark:border-zinc-600">
            <img
              src={state.favIconUrl || "/Globe_icon.svg"}
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = "/Globe_icon.svg" }}
            />
          </div>
          <span className="truncate text-xs font-medium text-gray-600 dark:text-gray-300">
            {state.title || "New Tab"}
          </span>
        </div>

        {/* Input Area */}
        <div className="flex items-end gap-2 p-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? "Agent is thinking..." : "Ask me anything..."}
            className="w-full max-h-60 px-2 py-2 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none resize-none overflow-y-auto font-medium"
            rows={1}
            onInput={adjustTextareaHeight}
          />
          <div className="pb-1 pr-1">
            <button
              onClick={() => handleKeyDown({ key: 'Enter', preventDefault: () => { } } as any)}
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-zinc-700 transition-colors shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ActionPanel;
