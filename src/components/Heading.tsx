import { Copy } from "lucide-react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../store";
import { memo } from "react";

const mapStateToProps = (state: RootState) => ({
  title: state.header.title,
  url: state.header.url,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const Heading = memo((props: ConnectedProps<typeof connector>) => {
  return (
    <div className="px-3 py-3 bg-gray-50 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-small text-gray-800 line-clamp-1">
          {props.title}
        </h4>
      </div>
      <div className="flex items-center mt-1">
        <div className="text-xs text-gray-500 flex-1 truncate">{props.url}</div>
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

const ConnectedHeading = connector(Heading);

export default ConnectedHeading;
