'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { supabase } from '@/utils/supabaseClient';
import { authError } from '../components/common/notification-service';

interface User {
  email: string;
  name: string;
  role: 'student' | 'alumnus' | 'unknown';
  id: string | null;
  identifier?: string;
}

const UserContext = createContext<{
  user: User | null;
  loading: boolean;
  isNewAlumni: boolean;
  refetchUser?: () => void;
}>({
  user: null,
  loading: true,
  isNewAlumni: false,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewAlumni, setIsNewAlumni] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      // Use getSession instead of getUser for better performance
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session?.user) {
        setLoading(false);
        return;
      }

      const email = session.user.email ?? '';
      const developerEmail = process.env.NEXT_PUBLIC_DEVELOPER_EMAIL;

      // Fast path for developer - set immediately and return
      if (developerEmail === email) {
        setUser({
          email: developerEmail,
          name: 'Developer',
          role: 'alumnus',
          id: '7a61c68e-0e82-4b57-bbc6-e28b79561d1f',
          identifier: 'DEV',
        });
        setLoading(false);
        // No background sync needed for developer
        return;
      }

      // Quick role determination without complex validation
      const determinedRole: 'student' | 'alumnus' = email.endsWith(
        '@alumni.bits-pilani.ac.in'
      )
        ? 'alumnus'
        : 'student';

      // Basic email validation - defer complex validation to background
      if (!email.includes('@') || !email.includes('.bits-pilani.ac.in')) {
        authError(
          `Invalid email: ${email}`,
          'Please use a valid BITS Pilani email address.'
        );
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      const name = (session.user.user_metadata?.full_name ?? 'Unknown')
        .toLowerCase()
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Set user immediately with basic info - this unblocks the UI
      setUser({
        email,
        name,
        role: determinedRole,
        id: session.user.id, // Use session ID immediately
        identifier: determinedRole === 'student' ? '20XXXXH' : 'Alumni',
      });
      setLoading(false);

      // Defer detailed validation and sync to background
      validateAndSyncUser(email, name, determinedRole);
    } catch (error) {
      console.error('Error in fetchUser:', error);
      setLoading(false);
    }
  }, []);

  // Background validation and sync function that doesn't block the UI
  const validateAndSyncUser = async (
    email: string,
    name: string,
    role: 'student' | 'alumnus'
  ) => {
    try {
      // Perform detailed email validation in background
      if (role === 'student') {
        const validCampuses = ['hyderabad', 'pilani', 'goa', 'dubai'];
        const emailParts = email.split('@');

        if (emailParts.length === 2) {
          const [localPart, domain] = emailParts;
          const campusDomain = domain.replace('.bits-pilani.ac.in', '');

          // Check if it's a valid student email domain
          if (
            !validCampuses.includes(campusDomain) ||
            domain !== `${campusDomain}.bits-pilani.ac.in`
          ) {
            authError(
              `Unauthorized email domain: ${email}`,
              'Please use a valid BITS Pilani email address:\n• Students: <username>@<campus>.bits-pilani.ac.in\n• Alumni: <username>@alumni.bits-pilani.ac.in\n\nValid campuses: hyderabad, pilani, goa, dubai'
            );
            await supabase.auth.signOut();
            return;
          }
        }
      }

      // Sync user data with API
      const response = await fetch('/api/user-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role }),
      });

      const userData = await response.json();
      if (response.ok) {
        // Update user with complete data from API
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                id: userData.id,
                identifier:
                  role === 'student'
                    ? userData.identifier
                    : userData.company || userData.job_title || 'Alumni',
              }
            : null
        );

        // Set isNewAlumni flag if this is a newly created alumni profile
        if (role === 'alumnus' && userData.isNewUser) {
          setIsNewAlumni(true);
        }
      } else {
        console.error('Background sync failed:', userData.error);
        // Keep the user logged in with basic info even if sync fails
      }
    } catch (error) {
      console.error('Background validation/sync error:', error);
      // Keep the user logged in with basic info even if sync fails
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{ user, loading, isNewAlumni, refetchUser: fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
