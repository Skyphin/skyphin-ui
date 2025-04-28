import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FetchCommentsPayload {
  url: string;
}

export interface Comment {
  id: string;
  parentId: string;
  content: string;
  createdAt: string;
  author: string;
  upvotes: number;
  replies: Comment[];
}

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    fetchComments: (state, _action: PayloadAction<FetchCommentsPayload>) => {
      state.loading = true;
      state.error = null;
    },
    fetchCommentsSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.loading = false;
      state.comments = action.payload;
    },
    fetchCommentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
    removeComment: (state, action: PayloadAction<string>) => {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload
      );
    },
    upvoteComment(state, action: PayloadAction<string>) {
      const comment = state.comments.find(
        (comment) => comment.id === action.payload
      );
      if (comment) comment.upvotes += 1;
    },
    downvoteComment(state, action: PayloadAction<string>) {
      const comment = state.comments.find(
        (comment) => comment.id === action.payload
      );
      if (comment) comment.upvotes -= 1;
    },
  },
});

export const {
  fetchComments,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addComment,
  removeComment,
  upvoteComment,
  downvoteComment,
} = commentsSlice.actions;

export default commentsSlice.reducer;
