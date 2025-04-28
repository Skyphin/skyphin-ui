import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store";
import { memo } from "react";

const mapStateToProps = (state: RootState) => ({
  comments: state.header.title,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const Comments = memo((props: ConnectedProps<typeof connector>) => {
  return (
    <div className="px-3 py-3 flex-1 flex-grow overflow-y-auto bg-gray-50">
      {props.comments}
    </div>
  );
});

const ConnectedComments = connector(Comments);

export default ConnectedComments;
