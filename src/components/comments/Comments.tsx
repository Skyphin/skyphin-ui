import React, { useState } from "react";
import { useUrl } from "../../hooks/useUrl";

const Comments: React.FC = () => {
  const [newComment, setNewComment] = useState("");
  const { state, addComment } = useUrl();

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addComment(newComment.trim());
      setNewComment("");
    }
  };

  if (state.loading) {
    return <div>Loading comments...</div>;
  }

  if (state.error) {
    return <div>Error loading comments: {state.error}</div>;
  }

  return (
    <div className="comments-container">
      <h3>Comments ({state.comments || 0})</h3>

      {/* Add new comment form */}
      <div className="add-comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <button onClick={handleAddComment} disabled={!newComment.trim()}>
          Add Comment
        </button>
      </div>

      {/* Comments list */}
      <div className="comments-list">
        {state.commentsList.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <strong>{comment.author.username}</strong>
              <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="comment-content">{comment.content}</div>
            <div className="comment-actions">
              <span>👍 {comment.upvoteCount}</span>
              <span>👎 {comment.downvoteCount}</span>
              <span>💬 {comment.replyCount}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination info */}
      {state.commentsList.length > 0 && (
        <div className="pagination">
          <button>Load More Comments</button>
        </div>
      )}
    </div>
  );
};

export default Comments;
