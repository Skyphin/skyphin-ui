import { Copy } from "lucide-react";
import { memo } from "react";
import { useUrl } from "../hooks/useUrl";

export const Heading = memo(() => {
  const { state } = useUrl();

  return (
    <div className="px-3 py-3 bg-gray-50 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-small text-gray-800 line-clamp-1">
          {state.title}
        </h4>
      </div>
      <div className="flex items-center mt-1">
        <div className="text-xs text-gray-500 flex-1 truncate">{state.url}</div>
        <button
          className="ml-2 text-gray-400 hover:text-indigo-600 p-1 transition-colors"
          title="Copy URL"
        >
          <Copy size={14} />
        </button>
      </div>
    </div>
  );
});

export default Heading;
