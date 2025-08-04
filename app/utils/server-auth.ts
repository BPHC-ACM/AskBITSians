import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

// Create a cached function to get the Supabase client
export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
});

// Server-side user session helper
export const getServerSession = cache(async () => {
  const supabase = createServerSupabaseClient();

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Session error:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
});

// Server-side user data helper with basic validation
export const getServerUser = cache(async () => {
  const session = await getServerSession();

  if (!session?.user) return null;

  const email = session.user.email;
  const name = session.user.user_metadata?.full_name || 'Unknown';

  // Quick role determination
  const role = email?.endsWith('@alumni.bits-pilani.ac.in')
    ? 'alumnus'
    : 'student';

  return {
    id: session.user.id,
    email,
    name,
    role,
    // Include basic metadata that's immediately available
    metadata: session.user.user_metadata,
  };
});
