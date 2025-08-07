import React, { createContext, useState, ReactNode, useEffect } from "react";
import {
  useGetCommentsCountQuery,
  useGetVotesQuery,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpvoteUrlMutation,
  useDownvoteUrlMutation,
} from "../types/graphql";

interface UrlState {
  title: string;
  url: string;
  upvotes: number;
  comments: number;
  commentsList: Array<{
    id: string;
    content: string;
    author: { id: string; username: string };
    createdAt: string;
    upvoteCount: number;
    downvoteCount: number;
    replyCount: number;
  }>;
  loading: boolean;
  error: string | null;
}

interface UrlContextType {
  state: UrlState;
  setTitle: (title: string) => void;
  setUrl: (url: string) => void;
  setTitleAndUrl: (data: { title: string; url: string }) => void;
  setUpvotes: (upvotes: number) => void;
  setComments: (comments: number) => void;
  addComment: (content: string) => Promise<void>;
  upvoteUrl: () => Promise<void>;
  downvoteUrl: () => Promise<void>;
}

const initialState: UrlState = {
  title: "",
  url: "",
  upvotes: 0,
  comments: 0,
  commentsList: [],
  loading: false,
  error: null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<UrlState>(initialState);

  // GraphQL queries that automatically update when URL changes
  const { data: votesData, isLoading: votesLoading } = useGetVotesQuery(
    { url: state.url },
    { enabled: !!state.url } // Only run when URL is set
  );

  const { data: commentsData, isLoading: commentsLoading } =
    useGetCommentsCountQuery(
      { url: state.url },
      { enabled: !!state.url } // Only run when URL is set
    );

  const { data: commentsListData, isLoading: commentsListLoading } =
    useGetCommentsQuery(
      { url: state.url, first: 10 },
      { enabled: !!state.url } // Only run when URL is set
    );

  // Update state when GraphQL data changes
  useEffect(() => {
    if (votesData) {
      setState((prev) => ({
        ...prev,
        upvotes: votesData.votes.upvoteCount,
      }));
    }
  }, [votesData]);

  useEffect(() => {
    if (commentsData) {
      setState((prev) => ({
        ...prev,
        comments: commentsData.commentsCount,
      }));
    }
  }, [commentsData]);

  // Update state when comments list data changes
  useEffect(() => {
    if (commentsListData) {
      setState((prev) => ({
        ...prev,
        commentsList: commentsListData.comments.edges.map((edge) => edge.node),
      }));
    }
  }, [commentsListData]);

  // Update loading state
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      loading: votesLoading || commentsLoading || commentsListLoading,
    }));
  }, [votesLoading, commentsLoading, commentsListLoading]);

  // GraphQL mutations
  const addCommentMutation = useAddCommentMutation({
    onSuccess: () => {
      // Refetch comments count after adding comment
      // React Query will automatically refetch related queries
    },
  });

  const upvoteUrlMutation = useUpvoteUrlMutation({
    onSuccess: (data) => {
      // Update local state with new vote counts
      setState((prev) => ({
        ...prev,
        upvotes: data.upvoteUrl.upvoteCount,
      }));
    },
  });

  const downvoteUrlMutation = useDownvoteUrlMutation({
    onSuccess: (data) => {
      // Update local state with new vote counts
      setState((prev) => ({
        ...prev,
        upvotes: data.downvoteUrl.upvoteCount,
      }));
    },
  });

  const setTitle = (title: string) => {
    setState((prev) => ({ ...prev, title }));
  };

  const setUrl = (url: string) => {
    setState((prev) => ({ ...prev, url }));
  };

  const setTitleAndUrl = (data: { title: string; url: string }) => {
    setState((prev) => ({ ...prev, title: data.title, url: data.url }));
  };

  const setUpvotes = (upvotes: number) => {
    setState((prev) => ({ ...prev, upvotes }));
  };

  const setComments = (comments: number) => {
    setState((prev) => ({ ...prev, comments }));
  };

  const addComment = async (content: string) => {
    if (!state.url) return;
    await addCommentMutation.mutateAsync({
      input: { url: state.url, content },
    });
  };

  const upvoteUrl = async () => {
    if (!state.url) return;
    await upvoteUrlMutation.mutateAsync({ url: state.url });
  };

  const downvoteUrl = async () => {
    if (!state.url) return;
    await downvoteUrlMutation.mutateAsync({ url: state.url });
  };

  return (
    <UrlContext.Provider
      value={{
        state,
        setTitle,
        setUrl,
        setTitleAndUrl,
        setUpvotes,
        setComments,
        addComment,
        upvoteUrl,
        downvoteUrl,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};
