import { createSlice } from "@reduxjs/toolkit";

interface UrlState {
  title: string;
  url: string;
  upvotes: number;
  comments: number;
  loading: boolean;
  error: string | null;
}

const initialState: UrlState = {
  title: "",
  url: "",
  upvotes: 0,
  comments: 0,
  loading: false,
  error: null,
};

const urlSlice = createSlice({
  name: "url",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    setTitleAndUrl: (state, action) => {
      state.title = action.payload.title;
      state.url = action.payload.url;
    },
    setUpvotes: (state, action) => {
      state.upvotes = action.payload;
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },
  },
});

export const { setTitle, setUrl, setTitleAndUrl, setUpvotes, setComments } =
  urlSlice.actions;

export default urlSlice.reducer;
