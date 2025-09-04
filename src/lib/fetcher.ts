// lib/fetcher.ts
import { ApiError } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://monkey-1-jhiq.onrender.com/api';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
  csrfToken?: string;
  token?: string; // Allow explicit token passing
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

// Helper function to get token from localStorage (client-side only)
function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requiresAuth = true, csrfToken, token, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  } as Record<string, string>;

  // Add Authorization header for authenticated requests
  if (requiresAuth) {
    const authToken = token || getStoredToken();
    
    if (!authToken) {
      throw new FetchError(401, {
        message: 'No authentication token available',
        code: 'NO_TOKEN',
      });
    }
    
    (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }

  // Add CSRF token for state-changing operations (if using CSRF)
  if (csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(fetchOptions.method || 'GET')) {
    (headers as Record<string, string>)['X-CSRF-Token'] = csrfToken;
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
    // Still include credentials for any cookies the backend might use
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      }));
      
      // If we get a 401, the token might be invalid
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      
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
  cookiesOrToken?: string // Can be cookies string or token
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // If cookiesOrToken looks like a JWT token, use as Authorization header
  if (cookiesOrToken && cookiesOrToken.includes('.') && !cookiesOrToken.includes('=')) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${cookiesOrToken}`;
  } else if (cookiesOrToken) {
    // Otherwise, treat as cookies
    (headers as Record<string, string>)['Cookie'] = cookiesOrToken;
  }

  return fetcher<T>(endpoint, {
    ...options,
    headers,
    requiresAuth: options.requiresAuth ?? true,
  });
}

export { FetchError };