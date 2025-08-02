'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './chats_sidebar.css';
import RequestButton from '../RequestButton/RequestButton';

export default function ChatsSidebar({ userRole, userId, setSelectedRoom, selectedRoom }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

    useEffect(() => {
        if (!userId) return;

        const fetchChatRooms = async () => {
            try {
                const response = await fetch(`/api/chats/user/${userId}`);
                const data = await response.json();
                if (data.rooms) {
                    setRooms(data.rooms);
                } else {
                    console.error('No rooms data found');
                    setRooms([]);
                }
            } catch (error) {
                console.error('Error fetching chat rooms:', error);
                setRooms([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChatRooms();
    }, [userId]);

    // Handle window resize for mobile view
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const searchedRooms = rooms.filter(
        (room) =>
            room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.identifier.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function ChatSkeleton() {
        return (
            <div className='chat-skeleton skeleton-item'>
                <div className='chat-avatar-skeleton'></div>
                <div className='chat-info-skeleton'>
                    <div className='chat-name-skeleton'></div>
                    <div className='chat-id-skeleton'></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`sidebar ${selectedRoom && isMobileView ? 'hidden' : ''}`}>
            <h2 className='chats-heading'>
                Chats
                {userRole === 'student' ? <RequestButton studentId={userId} /> : null}
            </h2>

            <input
                type='text'
                placeholder='Search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='searchbox'
            />

            {loading ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className='students-container'
                >
                    {[...Array(8)].map((_, index) => (
                        <ChatSkeleton key={index} />
                    ))}
                </motion.div>
            ) : searchedRooms.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className='students-container'
                >
                    {searchedRooms.map((room) => (
                        <motion.button
                            key={room.roomid}
                            className={`chat ${selectedRoom === room.roomid ? 'selected-chat' : ''}`}
                            onClick={() => setSelectedRoom(room.roomid)}
                        >
                            <img
                                src={`/api/avatar?name=${encodeURIComponent(room.name || '')}`}
                                alt={room.name}
                                className='chat-avatar'
                            />

                            <div className='chat-info'>
                                <p className='chat-name'>{room.name}</p>
                                <p className='chat-id'>{room.identifier}</p>
                            </div>
                        </motion.button>
                    ))}
                </motion.div>
            ) : (
                <p className='no-users'>No chats found.</p>
            )}
        </div>
    );
}