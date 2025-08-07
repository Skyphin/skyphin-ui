import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { graphqlFetcher } from '../services/graphql-client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type AddCommentInput = {
  content: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type AddReplyInput = {
  content: Scalars['String']['input'];
  parentCommentId: Scalars['ID']['input'];
  url: Scalars['String']['input'];
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  downvoteCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  parentCommentId?: Maybe<Scalars['ID']['output']>;
  replies: CommentConnection;
  replyCount: Scalars['Int']['output'];
  upvoteCount: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};


export type CommentRepliesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type CommentConnection = {
  __typename?: 'CommentConnection';
  edges: Array<CommentEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CommentEdge = {
  __typename?: 'CommentEdge';
  cursor: Scalars['String']['output'];
  node: Comment;
};

export type Mutation = {
  __typename?: 'Mutation';
  addComment: Comment;
  addReply: Comment;
  downvoteComment: Comment;
  downvoteUrl: UrlVoteResult;
  upvoteComment: Comment;
  upvoteUrl: UrlVoteResult;
};


export type MutationAddCommentArgs = {
  input: AddCommentInput;
};


export type MutationAddReplyArgs = {
  input: AddReplyInput;
};


export type MutationDownvoteCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationDownvoteUrlArgs = {
  url: Scalars['String']['input'];
};


export type MutationUpvoteCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationUpvoteUrlArgs = {
  url: Scalars['String']['input'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  comment: Comment;
  comments: CommentConnection;
  commentsCount: Scalars['Int']['output'];
  votes: UrlVoteResult;
};


export type QueryCommentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  url: Scalars['String']['input'];
};


export type QueryCommentsCountArgs = {
  url: Scalars['String']['input'];
};


export type QueryVotesArgs = {
  url: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  commentAdded: Comment;
  commentVoted: Comment;
  replyAdded: Comment;
  typingComment: Comment;
  typingReply: Comment;
  urlVoted: UrlVoteResult;
};


export type SubscriptionCommentAddedArgs = {
  url: Scalars['String']['input'];
};


export type SubscriptionCommentVotedArgs = {
  commentId: Scalars['ID']['input'];
};


export type SubscriptionReplyAddedArgs = {
  commentId: Scalars['ID']['input'];
  url: Scalars['String']['input'];
};


export type SubscriptionTypingCommentArgs = {
  url: Scalars['String']['input'];
};


export type SubscriptionTypingReplyArgs = {
  commentId: Scalars['ID']['input'];
  url: Scalars['String']['input'];
};


export type SubscriptionUrlVotedArgs = {
  url: Scalars['String']['input'];
};

export type UrlVoteResult = {
  __typename?: 'UrlVoteResult';
  downvoteCount: Scalars['Int']['output'];
  upvoteCount: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type AddCommentMutationVariables = Exact<{
  input: AddCommentInput;
}>;


export type AddCommentMutation = { __typename?: 'Mutation', addComment: { __typename?: 'Comment', id: string, content: string, createdAt: string, upvoteCount: number, downvoteCount: number, author: { __typename?: 'User', id: string, username: string } } };

export type AddReplyMutationVariables = Exact<{
  input: AddReplyInput;
}>;


export type AddReplyMutation = { __typename?: 'Mutation', addReply: { __typename?: 'Comment', id: string, content: string, createdAt: string, upvoteCount: number, downvoteCount: number, author: { __typename?: 'User', id: string, username: string } } };

export type DownvoteCommentMutationVariables = Exact<{
  commentId: Scalars['ID']['input'];
}>;


export type DownvoteCommentMutation = { __typename?: 'Mutation', downvoteComment: { __typename?: 'Comment', id: string, upvoteCount: number, downvoteCount: number } };

export type DownvoteUrlMutationVariables = Exact<{
  url: Scalars['String']['input'];
}>;


export type DownvoteUrlMutation = { __typename?: 'Mutation', downvoteUrl: { __typename?: 'UrlVoteResult', url: string, upvoteCount: number, downvoteCount: number } };

export type UpvoteCommentMutationVariables = Exact<{
  commentId: Scalars['ID']['input'];
}>;


export type UpvoteCommentMutation = { __typename?: 'Mutation', upvoteComment: { __typename?: 'Comment', id: string, upvoteCount: number, downvoteCount: number } };

export type UpvoteUrlMutationVariables = Exact<{
  url: Scalars['String']['input'];
}>;


export type UpvoteUrlMutation = { __typename?: 'Mutation', upvoteUrl: { __typename?: 'UrlVoteResult', url: string, upvoteCount: number, downvoteCount: number } };

export type GetCommentThreadQueryVariables = Exact<{
  commentId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCommentThreadQuery = { __typename?: 'Query', comment: { __typename?: 'Comment', id: string, content: string, author: { __typename?: 'User', id: string, username: string }, replies: { __typename?: 'CommentConnection', edges: Array<{ __typename?: 'CommentEdge', cursor: string, node: { __typename?: 'Comment', id: string, content: string, createdAt: string, upvoteCount: number, downvoteCount: number, author: { __typename?: 'User', id: string, username: string } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } } };

export type GetCommentsQueryVariables = Exact<{
  url: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCommentsQuery = { __typename?: 'Query', comments: { __typename?: 'CommentConnection', edges: Array<{ __typename?: 'CommentEdge', cursor: string, node: { __typename?: 'Comment', id: string, content: string, createdAt: string, upvoteCount: number, downvoteCount: number, replyCount: number, author: { __typename?: 'User', id: string, username: string } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type GetCommentsCountQueryVariables = Exact<{
  url: Scalars['String']['input'];
}>;


export type GetCommentsCountQuery = { __typename?: 'Query', commentsCount: number };

export type GetVotesQueryVariables = Exact<{
  url: Scalars['String']['input'];
}>;


export type GetVotesQuery = { __typename?: 'Query', votes: { __typename?: 'UrlVoteResult', url: string, upvoteCount: number, downvoteCount: number } };



export const AddCommentDocument = `
    mutation AddComment($input: AddCommentInput!) {
  addComment(input: $input) {
    id
    content
    author {
      id
      username
    }
    createdAt
    upvoteCount
    downvoteCount
  }
}
    `;

export const useAddCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AddCommentMutation, TError, AddCommentMutationVariables, TContext>) => {
    
    return useMutation<AddCommentMutation, TError, AddCommentMutationVariables, TContext>(
      {
    mutationKey: ['AddComment'],
    mutationFn: (variables?: AddCommentMutationVariables) => graphqlFetcher<AddCommentMutation, AddCommentMutationVariables>(AddCommentDocument, variables)(),
    ...options
  }
    )};

export const AddReplyDocument = `
    mutation AddReply($input: AddReplyInput!) {
  addReply(input: $input) {
    id
    content
    author {
      id
      username
    }
    createdAt
    upvoteCount
    downvoteCount
  }
}
    `;

export const useAddReplyMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AddReplyMutation, TError, AddReplyMutationVariables, TContext>) => {
    
    return useMutation<AddReplyMutation, TError, AddReplyMutationVariables, TContext>(
      {
    mutationKey: ['AddReply'],
    mutationFn: (variables?: AddReplyMutationVariables) => graphqlFetcher<AddReplyMutation, AddReplyMutationVariables>(AddReplyDocument, variables)(),
    ...options
  }
    )};

export const DownvoteCommentDocument = `
    mutation DownvoteComment($commentId: ID!) {
  downvoteComment(commentId: $commentId) {
    id
    upvoteCount
    downvoteCount
  }
}
    `;

export const useDownvoteCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DownvoteCommentMutation, TError, DownvoteCommentMutationVariables, TContext>) => {
    
    return useMutation<DownvoteCommentMutation, TError, DownvoteCommentMutationVariables, TContext>(
      {
    mutationKey: ['DownvoteComment'],
    mutationFn: (variables?: DownvoteCommentMutationVariables) => graphqlFetcher<DownvoteCommentMutation, DownvoteCommentMutationVariables>(DownvoteCommentDocument, variables)(),
    ...options
  }
    )};

export const DownvoteUrlDocument = `
    mutation DownvoteUrl($url: String!) {
  downvoteUrl(url: $url) {
    url
    upvoteCount
    downvoteCount
  }
}
    `;

export const useDownvoteUrlMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DownvoteUrlMutation, TError, DownvoteUrlMutationVariables, TContext>) => {
    
    return useMutation<DownvoteUrlMutation, TError, DownvoteUrlMutationVariables, TContext>(
      {
    mutationKey: ['DownvoteUrl'],
    mutationFn: (variables?: DownvoteUrlMutationVariables) => graphqlFetcher<DownvoteUrlMutation, DownvoteUrlMutationVariables>(DownvoteUrlDocument, variables)(),
    ...options
  }
    )};

export const UpvoteCommentDocument = `
    mutation UpvoteComment($commentId: ID!) {
  upvoteComment(commentId: $commentId) {
    id
    upvoteCount
    downvoteCount
  }
}
    `;

export const useUpvoteCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpvoteCommentMutation, TError, UpvoteCommentMutationVariables, TContext>) => {
    
    return useMutation<UpvoteCommentMutation, TError, UpvoteCommentMutationVariables, TContext>(
      {
    mutationKey: ['UpvoteComment'],
    mutationFn: (variables?: UpvoteCommentMutationVariables) => graphqlFetcher<UpvoteCommentMutation, UpvoteCommentMutationVariables>(UpvoteCommentDocument, variables)(),
    ...options
  }
    )};

export const UpvoteUrlDocument = `
    mutation UpvoteUrl($url: String!) {
  upvoteUrl(url: $url) {
    url
    upvoteCount
    downvoteCount
  }
}
    `;

export const useUpvoteUrlMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpvoteUrlMutation, TError, UpvoteUrlMutationVariables, TContext>) => {
    
    return useMutation<UpvoteUrlMutation, TError, UpvoteUrlMutationVariables, TContext>(
      {
    mutationKey: ['UpvoteUrl'],
    mutationFn: (variables?: UpvoteUrlMutationVariables) => graphqlFetcher<UpvoteUrlMutation, UpvoteUrlMutationVariables>(UpvoteUrlDocument, variables)(),
    ...options
  }
    )};

export const GetCommentThreadDocument = `
    query GetCommentThread($commentId: ID!, $first: Int, $after: String) {
  comment(id: $commentId) {
    id
    content
    author {
      id
      username
    }
    replies(first: $first, after: $after) {
      edges {
        node {
          id
          content
          author {
            id
            username
          }
          createdAt
          upvoteCount
          downvoteCount
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
    `;

export const useGetCommentThreadQuery = <
      TData = GetCommentThreadQuery,
      TError = unknown
    >(
      variables: GetCommentThreadQueryVariables,
      options?: Omit<UseQueryOptions<GetCommentThreadQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetCommentThreadQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetCommentThreadQuery, TError, TData>(
      {
    queryKey: ['GetCommentThread', variables],
    queryFn: graphqlFetcher<GetCommentThreadQuery, GetCommentThreadQueryVariables>(GetCommentThreadDocument, variables),
    ...options
  }
    )};

export const GetCommentsDocument = `
    query GetComments($url: String!, $first: Int, $after: String) {
  comments(url: $url, first: $first, after: $after) {
    edges {
      node {
        id
        content
        author {
          id
          username
        }
        createdAt
        upvoteCount
        downvoteCount
        replyCount
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
    `;

export const useGetCommentsQuery = <
      TData = GetCommentsQuery,
      TError = unknown
    >(
      variables: GetCommentsQueryVariables,
      options?: Omit<UseQueryOptions<GetCommentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetCommentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetCommentsQuery, TError, TData>(
      {
    queryKey: ['GetComments', variables],
    queryFn: graphqlFetcher<GetCommentsQuery, GetCommentsQueryVariables>(GetCommentsDocument, variables),
    ...options
  }
    )};

export const GetCommentsCountDocument = `
    query GetCommentsCount($url: String!) {
  commentsCount(url: $url)
}
    `;

export const useGetCommentsCountQuery = <
      TData = GetCommentsCountQuery,
      TError = unknown
    >(
      variables: GetCommentsCountQueryVariables,
      options?: Omit<UseQueryOptions<GetCommentsCountQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetCommentsCountQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetCommentsCountQuery, TError, TData>(
      {
    queryKey: ['GetCommentsCount', variables],
    queryFn: graphqlFetcher<GetCommentsCountQuery, GetCommentsCountQueryVariables>(GetCommentsCountDocument, variables),
    ...options
  }
    )};

export const GetVotesDocument = `
    query GetVotes($url: String!) {
  votes(url: $url) {
    url
    upvoteCount
    downvoteCount
  }
}
    `;

export const useGetVotesQuery = <
      TData = GetVotesQuery,
      TError = unknown
    >(
      variables: GetVotesQueryVariables,
      options?: Omit<UseQueryOptions<GetVotesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetVotesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetVotesQuery, TError, TData>(
      {
    queryKey: ['GetVotes', variables],
    queryFn: graphqlFetcher<GetVotesQuery, GetVotesQueryVariables>(GetVotesDocument, variables),
    ...options
  }
    )};
