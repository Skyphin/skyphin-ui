import {
  ArrowBigDown,
  ArrowBigUp,
  Award,
  Flag,
  MessageCircle,
} from "lucide-react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../store";
import { memo } from "react";

const mapStateToProps = (state: RootState) => ({
  upvoteCount: +!state.header.title,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const ActionPanel = memo((props: ConnectedProps<typeof connector>) => {
  return (
    <div className="px-3 py-3 flex items-center gap-2 mt-auto bg-white border-t border-gray-100">
      <div className="flex items-center gap-1 ml-2 text-gray-400">
        <button
          className="flex items-center p-1 gap-1 hover:text-indigo-600 transition-colors"
          title="Upvote"
        >
          <ArrowBigUp size={25} />
        </button>
        <span>{props.upvoteCount}</span>
        <button
          className="flex items-center p-1 hover:text-indigo-600 transition-colors"
          title="Downvote"
        >
          <ArrowBigDown size={25} />
        </button>
      </div>
      <button
        className="flex items-center p-1 gap-1 ml-2 text-gray-400 transition-colors"
        title="Comment"
      >
        <MessageCircle className="hover:text-indigo-600" size={20} />
        <span>0</span>
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

const ConnectedActionPanel = connector(ActionPanel);

export default ConnectedActionPanel;
