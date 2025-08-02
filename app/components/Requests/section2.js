'use client';
import ChatRequests from './chat-requests';
import styles from './section2.module.css';
import { useUser } from '@/context/userContext';
import LoginButton from '../loginbutton';

export default function Section2() {
	const { user, loading } = useUser();

	if (!user?.id)
		return (
			<div className={styles.loginbutton}>
				<div className={styles.pill}>
					<LoginButton />
				</div>
			</div>
		);

	return (
		<div className={styles.section}>
			<ChatRequests userId={user.id} />
		</div>
	);
}
