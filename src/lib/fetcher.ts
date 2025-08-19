// lib/fetcher.ts
import { ApiError } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://monkey-1-jhiq.onrender.com/api';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
  csrfToken?: string;
}

class FetchError extends Error {
  status: number;
  data: ApiError;

  constructor(status: number, data: ApiError) {
    super(data.message);
    this.status = status;
    this.data = data;
    this.name = 'FetchError';
  }
}

export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requiresAuth = true, csrfToken, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  } as Record<string, string>;

  // Add CSRF token for state-changing operations
  if (csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(fetchOptions.method || 'GET')) {
    (headers as Record<string, string>)['X-CSRF-Token'] = csrfToken;
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
    credentials: 'include', // Include HttpOnly cookies
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      }));
      
      throw new FetchError(response.status, errorData);
    }

    // Handle empty responses (e.g., logout)
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof FetchError) {
      throw error;
    }
    
    // Network or parsing errors
    throw new FetchError(500, {
      message: 'Network error occurred',
      code: 'NETWORK_ERROR',
    });
  }
}

// Server-side fetcher for Server Actions and Route Handlers
export async function serverFetcher<T>(
  endpoint: string,
  options: FetchOptions = {},
  cookies?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(cookies && { Cookie: cookies }),
    ...options.headers,
  };

  return fetcher<T>(endpoint, {
    ...options,
    headers,
  });
}

export { FetchError };