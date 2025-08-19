// lib/queryClient.ts
import { QueryClient, MutationCache, QueryCache } from '@tanstack/react-query';
import { FetchError } from './fetcher';

let clientQueryClient: QueryClient | undefined = undefined;

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors except 401
          if (error instanceof FetchError && error.status >= 400 && error.status < 500 && error.status !== 401) {
            return false;
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        console.error('Query error:', error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    }),
  });
}

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!clientQueryClient) clientQueryClient = makeQueryClient();
    return clientQueryClient;
  }
}