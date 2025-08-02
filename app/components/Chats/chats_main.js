'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSend } from '@tabler/icons-react';
import styles from './chats_main.css';
import { useState, useEffect, useRef } from 'react';

export default function ChatsMain({ selectedRoom, userId, setSelectedRoom }) {
	const [newMessage, setNewMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [userName, setUserName] = useState('');
	const messagesContainerRef = useRef(null);
	const socketRef = useRef(null);
	const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

	useEffect(() => {
		if (messagesContainerRef.current) {
			requestAnimationFrame(() => {
				messagesContainerRef.current.scrollTop =
					messagesContainerRef.current.scrollHeight;
			});
		}
	}, [messages, selectedRoom]);

	useEffect(() => {
		setUserName('');
		setMessages([]);

		if (selectedRoom) {
			fetch(`/api/chats/${selectedRoom}/${userId}`)
				.then((response) => {
					if (!response.ok) {
						throw new Error(
							`HTTP error! status: ${response.status}`
						);
					}
					return response.json();
				})
				.then((data) => {
					console.log('Fetched user data:', data);
					setUserName(data.userName || 'Unknown User');
				})
				.catch((error) => {
					console.error('Error fetching user data:', error);
					setUserName('Unknown User');
				});

			fetch(`/api/chats/${selectedRoom}/messages`)
				.then((response) => {
					if (!response.ok) {
						throw new Error(
							`HTTP error fetching messages! status: ${response.status}`
						);
					}
					return response.json();
				})
				.then((data) => {
					if (data && data.messages && Array.isArray(data.messages)) {
						const sortedMessages = sortMessagesByTimestamp(
							data.messages
						);
						setMessages(sortedMessages);
					} else {
						console.warn(
							'Received unexpected message format:',
							data
						);
						setMessages([]);
					}
				})
				.catch((error) => {
					console.error('Error fetching messages:', error);
					setMessages([]);
				});
		}
	}, [selectedRoom, userId]);

	const sortMessagesByTimestamp = (messagesArray) => {
		return [...messagesArray].sort((a, b) => {
			const timeA = new Date(a.timestamp || 0).getTime();
			const timeB = new Date(b.timestamp || 0).getTime();
			return timeA - timeB;
		});
	};

	useEffect(() => {
		if (!selectedRoom) {
			if (socketRef.current) {
				console.log('Closing WebSocket as room is deselected.');
				socketRef.current.close();
				socketRef.current = null;
			}
			return;
		}

		if (socketRef.current) {
			socketRef.current.close();
		}

		const socket = new WebSocket('wss://acc-website.onrender.com');
		socketRef.current = socket;

		socket.onopen = () => {
			socket.send(
				JSON.stringify({
					type: 'join',
					room: selectedRoom,
				})
			);
		};

		socket.onmessage = (event) => {
			try {
				const receivedMessage = JSON.parse(event.data);
				if (receivedMessage.room === selectedRoom) {
					setMessages((prevMessages) => {
						const messageExists = prevMessages.some(
							(msg) =>
								msg.id === receivedMessage.id &&
								msg.timestamp === receivedMessage.timestamp
						);

						if (messageExists) {
							return prevMessages;
						}
						const newMessages = [...prevMessages, receivedMessage];
						return sortMessagesByTimestamp(newMessages);
					});
				}
			} catch (error) {
				console.error('Error parsing WebSocket message:', error);
			}
		};

		socket.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		socket.onclose = (event) => {
			console.log('WebSocket closed:', event.code, event.reason);
		};

		return () => {
			if (socketRef.current) {
				socketRef.current.close();
				socketRef.current = null;
			}
		};
	}, [selectedRoom]);

	useEffect(() => {
		const handleResize = () => {
			const newIsMobile = window.innerWidth <= 768;
			setIsMobileView(newIsMobile);
		};

		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const sendMessage = () => {
		if (newMessage.trim() === '' || !selectedRoom || !userId) return;
		const timestamp = new Date().toISOString();

		const messageData = {
			room: selectedRoom,
			id: userId,
			content: newMessage,
			timestamp: timestamp,
		};

		setMessages((prevMessages) => {
			const newMessages = [...prevMessages, messageData];
			return sortMessagesByTimestamp(newMessages);
		});
		setNewMessage('');
		if (socketRef.current?.readyState === WebSocket.OPEN) {
			socketRef.current.send(JSON.stringify(messageData));
		} else {
			console.warn('WebSocket not open when sending message.');
		}
		fetch(`/api/chats/${selectedRoom}/messages`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(messageData),
		})
			.then((response) => {
				if (!response.ok) {
					return response
						.json()
						.catch(() => ({}))
						.then((errData) => {
							throw new Error(
								`HTTP error sending message! status: ${
									response.status
								}, details: ${JSON.stringify(errData)}`
							);
						});
				}
			})
			.catch((error) => {
				console.error('Error sending message via API:', error);
				setMessages((prevMessages) =>
					sortMessagesByTimestamp(
						prevMessages.filter(
							(msg) =>
								msg.timestamp !== messageData.timestamp ||
								msg.id !== messageData.id
						)
					)
				);
				alert('Failed to send message. Please try again.');
			});
	};

	return (
		<div
			className={`chat-display ${
				selectedRoom && isMobileView ? 'active' : ''
			}`}
		>
			<AnimatePresence mode='wait'>
				{selectedRoom ? (
					<motion.div
						key={selectedRoom}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.25 }}
						style={{
							display: 'flex',
							flexDirection: 'column',
							height: '100%',
						}}
					>
						<div
							className={`header ${selectedRoom ? 'active' : ''}`}
						>
							<img
								src={`/api/avatar?name=${encodeURIComponent(
									userName || ''
								)}`}
								alt='User Avatar'
								className='avatar'
							/>
							<div className='user-info'>
								<p className='user-name'>{userName}</p>
							</div>
						</div>
						<div
							className='messages-container'
							ref={messagesContainerRef}
							style={{
								flex: 1,
								overflowX: 'hidden',
								overflowY: 'auto',
								padding: '0.75rem',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							{messages.map((msg, index) => {
								const isUser = msg.id === userId;
								return (
									<div
										key={`${msg.id}-${msg.timestamp}-${index}`}
										className={`message ${
											isUser
												? 'user-message'
												: 'other-message'
										}`}
									>
										{msg.content}
										<span
											className='timestamp'
											style={{
												left: isUser
													? '0.5rem'
													: 'auto',
												right: isUser
													? 'auto'
													: '0.5rem',
											}}
										>
											{new Date(
												msg.timestamp
											).toLocaleString('en-GB', {
												day: '2-digit',
												month: '2-digit',
												hour: '2-digit',
												minute: '2-digit',
												hour12: false,
											})}
										</span>
										<style jsx>{`
											.message:hover .timestamp {
												opacity: 1;
											}
										`}</style>
									</div>
								);
							})}
						</div>
						<div className='message-input-container'>
							<input
								type='text'
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								placeholder='Type a message...'
								className='message-input'
								onKeyDown={(e) =>
									e.key === 'Enter' && sendMessage()
								}
							/>
							<IconSend
								size={25}
								className='send-icon'
								onClick={sendMessage}
							/>
						</div>
					</motion.div>
				) : (
					<motion.div
						key='default'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.25 }}
						className='defaultmsg'
					>
						<img src='/acc-logo.png' alt='Logo' />
						<p>Your Academic Network, Simplified.</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
