import { Plus } from "lucide-react";
import { memo } from "react";

interface HeadingProps {
  onClear?: () => void;
}

export const Heading = memo(({ onClear }: HeadingProps) => {
  return (
    <div className="relative w-full px-4 h-14 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-20">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">A9</div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Assistant
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onClear}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-indigo-500 transition-all"
            title="New Chat"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default Heading;
