import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear session cookies
    cookieStore.delete('userId');
    cookieStore.delete('username');

    return Response.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Logout error:', err);
    return Response.json(
      { message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
