import { ChevronDown } from "lucide-react";
import { memo } from "react";

export const CommentsFilter = memo(() => {
  return (
    <div className="px-3 py-1 bg-gray-50 border-b border-gray-100">
      <div className="flex items-center mt-1 text-gray-500">
        Sort by:
        <button className="flex items-center border-0 rounded-2xl p-1 px-2 gap-1 ml-2 text-gray-400 hover:text-zinc-100 hover:bg-gray-500 transition-colors">
          Newest
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
});

export default CommentsFilter;
