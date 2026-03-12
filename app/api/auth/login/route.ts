import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return Response.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Query database for user
    const { data: user, error } = await supabase
      .from('user_table')
      .select('User_ID, Username, password')
      .eq('Username', username)
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return Response.json(
        { message: 'Database error. Please try again.' },
        { status: 500 }
      );
    }

    // Check if user exists
    if (!user) {
      return Response.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password (compare with bcrypt-hashed password)
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return Response.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Set secure HTTP-only cookie with session info
    const cookieStore = await cookies();
    cookieStore.set('userId', String(user.User_ID), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    cookieStore.set('username', user.Username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json(
      { message: 'Login successful', userId: user.User_ID },
      { status: 200 }
    );

  } catch (err) {
    console.error('Unexpected error during login:', err);
    return Response.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
