import {
  ArrowBigDown,
  ArrowBigUp,
  Award,
  Flag,
  MessageCircle,
} from "lucide-react";
import { memo } from "react";
import { useUrl } from "../hooks/useUrl";

export const ActionPanel = memo(() => {
  const { state, upvoteUrl, downvoteUrl } = useUrl();

  return (
    <div className="px-3 py-3 flex items-center gap-2 mt-auto bg-white border-t border-gray-100">
      <div className="flex items-center gap-1 ml-2 text-gray-400">
        <button
          className="flex items-center p-1 gap-1 hover:text-indigo-600 transition-colors"
          title="Upvote"
          onClick={upvoteUrl}
        >
          <ArrowBigUp size={25} />
        </button>
        <span>{state.upvotes}</span>
        <button
          className="flex items-center p-1 hover:text-indigo-600 transition-colors"
          title="Downvote"
          onClick={downvoteUrl}
        >
          <ArrowBigDown size={25} />
        </button>
      </div>
      <button
        className="flex items-center p-1 gap-1 ml-2 text-gray-400 transition-colors"
        title="Comment"
      >
        <MessageCircle className="hover:text-indigo-600" size={20} />
        <span>{state.comments}</span>
      </button>
      <button
        className="flex items-center p-1 gap-1 ml-2 text-gray-400 hover:text-indigo-600 transition-colors"
        title="Award"
      >
        <Award size={20} />
      </button>
      <button
        className="ml-auto p-1 text-gray-400 hover:text-red-700 transition-colors"
        title="Report"
      >
        <Flag size={14} />
      </button>
    </div>
  );
});

export default ActionPanel;
