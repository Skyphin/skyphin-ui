import { ChevronDown } from "lucide-react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store";
import { memo } from "react";

const mapStateToProps = (state: RootState) => ({
  commentsFilter: state.header.title.slice(0, 5),
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const CommentsFilter = memo(
  (props: ConnectedProps<typeof connector>) => {
    return (
      <div className="px-3 py-1 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center mt-1 text-gray-500">
          Sort by:
          <button className="flex items-center border-0 rounded-2xl p-1 px-2 gap-1 ml-2 text-gray-400 hover:text-zinc-100 hover:bg-gray-500 transition-colors">
            {props.commentsFilter}
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    );
  }
);

const ConnectedCommentsFilter = connector(CommentsFilter);

export default ConnectedCommentsFilter;
