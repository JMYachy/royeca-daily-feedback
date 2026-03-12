import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface SessionData {
  userId: string;
  username: string;
}

/**
 * Get the current user session from cookies
 * Returns null if no session exists
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    const username = cookieStore.get('username')?.value;

    if (!userId || !username) {
      return null;
    }

    return { userId, username };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Require a user to be authenticated
 * Redirects to login if not authenticated
 */
export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  
  if (!session) {
    redirect('/login/login.html');
  }

  return session;
}

/**
 * Check if user is authenticated (returns boolean instead of redirecting)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
