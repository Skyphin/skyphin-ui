import { ChatInterface, Message } from "./chat/ChatInterface";

export const ContentBody = ({ messages }: { messages: Message[] }) => {
  return (
    <div className="flex-1 overflow-hidden relative w-full h-full dark:bg-zinc-800 dark:text-zinc-200">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-5">
          {/* Logo Container */}
          <div className="relative group cursor-default">

            {/* Icon */}
            <div className="relative">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-300 dark:text-zinc-600">
                <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 3V21" />
                  <path d="M3 12H21" />
                  <path d="M5.636 5.636L18.364 18.364" />
                  <path d="M18.364 5.636L5.636 18.364" />
                </g>
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
          </div>

          <h1 className="text-lg font-medium text-gray-400 dark:text-zinc-500 tracking-wide bg-gradient-to-br from-gray-400 to-gray-600 dark:from-zinc-500 dark:to-zinc-700 bg-clip-text text-transparent">
            A9flow
          </h1>
        </div>
      ) : (
        <ChatInterface messages={messages} />
      )}
    </div>
  );
};
