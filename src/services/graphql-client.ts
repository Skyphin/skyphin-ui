export const graphqlClient = {
  endpoint: process.env.API_URL,
  fetchParams: {
    headers: {
      "Content-Type": "application/json",
    },
  },
};

export async function graphqlRequest<TData = unknown, TVariables = unknown>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  return new Promise((resolve, reject) => {
    const requestId = Math.random().toString(36).substring(7);

    const handleResponse = (message: {
      type: string;
      requestId: string;
      error?: string;
      data?: TData;
    }) => {
      if (
        message.type === "GRAPHQL_RESPONSE" &&
        message.requestId === requestId
      ) {
        chrome.runtime.onMessage.removeListener(handleResponse);

        if (message.error) {
          reject(new Error(message.error));
        } else {
          resolve(message.data as TData);
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleResponse);

    chrome.runtime.sendMessage({
      event: "GRAPHQL_REQUEST",
      requestId,
      options: {
        method: "POST",
        body: JSON.stringify({
          query,
          variables,
        }),
      },
    });

    // Timeout after 10 seconds
    const timeoutId = setTimeout(() => {
      chrome.runtime.onMessage.removeListener(handleResponse);
      reject(new Error("GraphQL request timed out"));
    }, 10000);

    // Clean timeout on response
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.requestId === requestId) {
        clearTimeout(timeoutId);
      }
    });
  });
}

// Fetcher compatible with GraphQL Codegen (isAsync: true)
export const graphqlFetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables
): (() => Promise<TData>) => {
  return () => graphqlRequest<TData, TVariables>(query, variables);
};
