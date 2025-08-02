'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from 'react';
import { supabase } from '@/utils/supabaseClient';

interface User {
	email: string;
	name: string;
	role: 'student' | 'consultant' | 'unknown';
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
			setUser({
				email: developerEmail,
				name: 'Developer',
				role: 'consultant',
				id: '7a61c68e-0e82-4b57-bbc6-e28b79561d1f',
				identifier: 'DEV',
			});
			setLoading(false);
			return;
		}

		if (!email.endsWith('bits-pilani.ac.in')) {
			alert(`Unauthorized email: \n${email}`);
			await supabase.auth.signOut();
			setLoading(false);
			return;
		}

		const name = (data.user.user_metadata?.full_name ?? 'Unknown')
			.toLowerCase()
			.split(' ')
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

		let determinedRole: 'student' | 'consultant' = 'student';
		let consultantInfo: { id: string; department: string | null } | null =
			null;

		try {
			const { data: consultantData, error: consultantCheckError } =
				await supabase
					.from('consultants')
					.select('id, department')
					.eq('email', email)
					.maybeSingle();

			if (consultantCheckError) throw consultantCheckError;

			if (consultantData) {
				determinedRole = 'consultant';
				consultantInfo = {
					id: consultantData.id,
					department: consultantData.department,
				};
			}
		} catch (error) {
			console.error(
				'Unexpected error checking consultant status:',
				error
			);
		}

		const role = determinedRole;
		let userId: string | null = null;
		let identifier: string | null = null;

		if (role === 'student') {
			try {
				const response = await fetch('/api/user-sync', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, name }),
				});

				const studentData = await response.json();
				if (!response.ok) {
					throw new Error(
						studentData.error || 'Failed to sync student data'
					);
				}

				userId = studentData.id;
				identifier = studentData.identifier;
			} catch (e: any) {
				console.error('Error during user sync:', e.message);
				setUser(null);
				setLoading(false);
				return;
			}
		} else if (role === 'consultant' && consultantInfo) {
			userId = consultantInfo.id;
			identifier = consultantInfo.department;
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
