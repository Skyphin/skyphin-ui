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
    <div className="sticky dark:bg-zinc-800 z-10 bottom-0 w-full">
      <div className="px-2 pb-2 w-full">
        <div className="w-full h-full flex flex-col rounded-xl dark:bg-zinc-700 border-gray-200 dark:border-gray-800 border-1">
          <div className="flex basis-1 items-start gap-2 p-2">
            <div className="rounded-full flex items-center justify-center">
              <img
                rel="icon"
                width={25}
                height={25}
                src={`${state.favIconUrl || "/Globe_icon.svg"}`}
                onError={(event) => {
                  const target = event.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/Globe_icon.svg";
                }}
              />
            </div>
            <span className="truncate text-sm mt-0.5 text-gray-700 dark:text-gray-400">
              {state.title}
            </span>
          </div>
          <div className="flex basis-3 flex-1 w-full">
            <div className="flex flex-1 w-full items-center overflow-hidden dark:bg-[#2c2c2c] rounded-xl border border-gray-200 dark:border-gray-700 dark:focus-within:border-gray-600 transition-shadow">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={isLoading ? "Agent is thinking..." : "Ask anything"}
                className="bg-transparent w-full max-h-80 px-4 py-3 flex-1 outline-none text-gray-900 dark:text-gray-200 placeholder-gray-500 overflow-scroll text-sm resize-none disabled:opacity-50"
                rows={1}
                onInput={adjustTextareaHeight}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ActionPanel;
