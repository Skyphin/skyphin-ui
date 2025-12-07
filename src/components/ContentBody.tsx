import { ChatInterface, Message } from "./chat/ChatInterface";

export const ContentBody = ({ messages }: { messages: Message[] }) => {
  return (
    <div className="flex-1 overflow-hidden relative w-full h-full dark:bg-zinc-800 dark:text-zinc-200">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p>Ready to help!</p>
        </div>
      ) : (
        <ChatInterface messages={messages} />
      )}
    </div>
  );
};
