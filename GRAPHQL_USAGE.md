# GraphQL Setup with Background Script Routing

This project uses GraphQL with a custom routing system that sends all GraphQL requests through the Chrome extension's background script for authentication and centralized request handling.

## How It Works

1. **GraphQL Client Service** (`src/services/graphql-client.ts`)

   - Provides a custom fetcher function that routes requests through the background script
   - Handles request/response coordination with unique request IDs
   - Manages timeouts and error handling

2. **Background Script** (`extension/service-workers/background.js`)

   - Receives GraphQL requests from the frontend
   - Adds authentication headers (Bearer token)
   - Handles token refresh on 401 errors
   - Sends responses back to the frontend

3. **Generated Hooks** (`src/types/graphql.ts`)
   - Auto-generated React Query hooks for all GraphQL operations
   - Uses the custom fetcher to route through background script
   - Provides TypeScript types for all operations

## Usage Examples

### Basic Query Usage

```tsx
import { useGetCommentsQuery } from "../types/graphql";
import { graphqlClient } from "../services/graphql-client";

function CommentsList() {
  const { data, isLoading, error } = useGetCommentsQuery(graphqlClient, {
    url: "https://example.com",
    first: 10,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.comments.edges.map((edge) => (
        <div key={edge.node.id}>{edge.node.content}</div>
      ))}
    </div>
  );
}
```

### Mutation Usage

```tsx
import { useAddCommentMutation } from "../types/graphql";
import { graphqlClient } from "../services/graphql-client";

function AddComment() {
  const addComment = useAddCommentMutation(graphqlClient, {
    onSuccess: () => {
      console.log("Comment added successfully!");
    },
  });

  const handleSubmit = (content: string) => {
    addComment.mutate({
      input: {
        url: "https://example.com",
        content,
      },
    });
  };

  return (
    <button
      onClick={() => handleSubmit("Hello world!")}
      disabled={addComment.isPending}
    >
      {addComment.isPending ? "Adding..." : "Add Comment"}
    </button>
  );
}
```

### Available Hooks

**Queries:**

- `useGetCommentsQuery` - Get paginated comments for a URL
- `useGetCommentThreadQuery` - Get a specific comment with replies
- `useGetCommentsCountQuery` - Get comment count for a URL
- `useGetVotesQuery` - Get vote counts for a URL

**Mutations:**

- `useAddCommentMutation` - Add a new comment
- `useAddReplyMutation` - Add a reply to a comment
- `useUpvoteCommentMutation` - Upvote a comment
- `useDownvoteCommentMutation` - Downvote a comment

## Configuration

### Environment Variables

Set your GraphQL endpoint in the environment:

```bash
API_URL=https://your-graphql-server.com/graphql
```

### Authentication

The background script automatically handles authentication by:

1. Adding Bearer token to all requests
2. Refreshing tokens on 401 responses
3. Retrying failed requests after token refresh

### Error Handling

The system handles:

- Network errors
- Authentication errors (automatic retry)
- Request timeouts (10 seconds)
- GraphQL errors

## Development

### Regenerating Types

When you modify your GraphQL schema or operations:

```bash
npm run codegen
```

### Watching for Changes

For development with auto-regeneration:

```bash
npm run codegen:watch
```

## Architecture Benefits

1. **Centralized Authentication**: All requests go through the background script with consistent auth handling
2. **Token Management**: Automatic token refresh without frontend complexity
3. **Type Safety**: Full TypeScript support with generated types
4. **React Query Integration**: Built-in caching, loading states, and error handling
5. **Extension Compatibility**: Works seamlessly with Chrome extension architecture
