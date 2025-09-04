// lib/session.ts
import { cookies } from 'next/headers';
import { User } from '@/types/auth';
import { serverFetcher } from './fetcher';

export interface SessionData {
  user: User | null;
  csrfToken: string | null;
}

export async function getSession(): Promise<SessionData> {
  try {
    const cookieStore = cookies();
    const sessionCookie =  (await cookieStore).get('session');
    
    if (!sessionCookie) {
      return { user: null, csrfToken: null };
    }

    const cookieString = cookieStore.toString();
    const { user, csrfToken } = await serverFetcher<{
      user: User;
      csrfToken: string;
    }>('/auth/me', { requiresAuth: true }, cookieString);

    return { user, csrfToken };
  } catch (error) {
    console.error('Session validation failed:', error);
    return { user: null, csrfToken: null };
  }
}

export async function requireAuth(): Promise<{ user: User; csrfToken: string }> {
  const session = await getSession();
  
  if (!session.user || !session.csrfToken) {
    throw new Error('Authentication required');
  }
  
  return { user: session.user, csrfToken: session.csrfToken };
}