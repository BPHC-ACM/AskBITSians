'use client';
import { useState, useEffect } from 'react';
import ChatsSidebar from './chats_sidebar';
import ChatsMain from './chats_main.js';
import { connectWebSocket } from '../../utils/chat_socket';
import { useUser } from '@/context/userContext';
import LoginButton from '../loginbutton';
import styles from './section3.css';

export default function Section3() {
	const [selectedRoom, setSelectedRoom] = useState(null);
	const { user } = useUser();

	useEffect(() => {
		const socket = connectWebSocket();

		return () => {
			if (socket) {
				socket.close();
			}
		};
	}, []);

	if (!user?.id)
		return (
			<div className='loginbutton'>
				<div className='pill'>
					<LoginButton />
				</div>
			</div>
		);

	return (
		<div className='chatsystem'>
			<ChatsSidebar
				userId={user.id}
				setSelectedRoom={setSelectedRoom}
				selectedRoom={selectedRoom}
				userRole={user.role}
			/>
			<ChatsMain selectedRoom={selectedRoom} userId={user.id} />
		</div>
	);
}
