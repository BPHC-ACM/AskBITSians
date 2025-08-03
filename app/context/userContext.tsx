'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';

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
  refetchUser?: () => void;
}>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      setLoading(false);
      return;
    }

    const email = data.user.email ?? '';
    const developerEmail = process.env.NEXT_PUBLIC_DEVELOPER_EMAIL;

    if (developerEmail === email) {
      try {
        // Sync developer user as alumni
        const response = await fetch('/api/user-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: developerEmail,
            name: 'Developer',
            role: 'alumnus',
          }),
        });

        const alumnusData = await response.json();
        if (!response.ok) {
          throw new Error(
            alumnusData.error || 'Failed to sync developer as alumni'
          );
        }

        setUser({
          email: developerEmail,
          name: 'Developer',
          role: 'alumnus',
          id: alumnusData.id,
          identifier: alumnusData.company || alumnusData.job_title || 'DEV',
        });
        setLoading(false);
        return;
      } catch (e: any) {
        console.error('Error during developer sync:', e.message);
        // Fallback to hardcoded values if sync fails
        setUser({
          email: developerEmail,
          name: 'Developer',
          role: 'alumnus',
          id: '7a61c68e-0e82-4b57-bbc6-e28b79561d1f',
          identifier: 'DEV',
        });
        setLoading(false);
        return;
      }
    }

    // Determine role based on email domain
    let determinedRole: 'student' | 'alumnus' = 'student';

    if (email.endsWith('@alumni.bits-pilani.ac.in')) {
      determinedRole = 'alumnus';
    } else {
      // Student email formats:
      // 1. f<batch><id>@<campus>.bits-pilani.ac.in (e.g., f20230064@hyderabad.bits-pilani.ac.in)
      // 2. Any email ending with @<campus>.bits-pilani.ac.in (e.g., acm.bphc@hyderabad.bits-pilani.ac.in)
      const validCampuses = ['hyderabad', 'pilani', 'goa', 'dubai'];
      const emailParts = email.split('@');

      if (emailParts.length === 2) {
        const [localPart, domain] = emailParts;
        const campusDomain = domain.replace('.bits-pilani.ac.in', '');

        // Check if it's a valid student email domain
        if (
          validCampuses.includes(campusDomain) &&
          domain === `${campusDomain}.bits-pilani.ac.in`
        ) {
          determinedRole = 'student';
        } else {
          toast.error(`Unauthorized email domain: ${email}`, {
            description:
              'Please use a valid BITS Pilani email address:\n• Students: <username>@<campus>.bits-pilani.ac.in\n• Alumni: <username>@alumni.bits-pilani.ac.in\n\nValid campuses: hyderabad, pilani, goa, dubai',
            duration: 6000,
          });
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
      } else {
        toast.error(`Invalid email format: ${email}`, {
          description:
            'Please use a valid BITS Pilani email address:\n• Students: <username>@<campus>.bits-pilani.ac.in\n• Alumni: <username>@alumni.bits-pilani.ac.in\n\nValid campuses: hyderabad, pilani, goa, dubai',
          duration: 6000,
        });
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
    }

    const name = (data.user.user_metadata?.full_name ?? 'Unknown')
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const role = determinedRole;
    let userId: string | null = null;
    let identifier: string | null = null;

    if (role === 'student') {
      try {
        const response = await fetch('/api/user-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, role: 'student' }),
        });

        const studentData = await response.json();
        if (!response.ok) {
          throw new Error(studentData.error || 'Failed to sync student data');
        }

        userId = studentData.id;
        identifier = studentData.identifier;
      } catch (e: any) {
        console.error('Error during student sync:', e.message);
        setUser(null);
        setLoading(false);
        return;
      }
    } else if (role === 'alumnus') {
      try {
        // Check if alumnus exists, if not create them
        const response = await fetch('/api/user-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, role: 'alumnus' }),
        });

        const alumnusData = await response.json();
        if (!response.ok) {
          throw new Error(alumnusData.error || 'Failed to sync alumnus data');
        }

        userId = alumnusData.id;
        identifier = alumnusData.company || alumnusData.job_title || 'Alumni';
      } catch (e: any) {
        console.error('Error during alumni sync:', e.message);
        setUser(null);
        setLoading(false);
        return;
      }
    }

    setUser({
      email,
      name,
      role,
      id: userId ?? null,
      identifier: identifier ?? undefined,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, loading, refetchUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
