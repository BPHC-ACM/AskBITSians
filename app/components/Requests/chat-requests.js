'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './chat-requests.module.css';
import ScrollToTop from '../ScrollToTop/scroll-to-top';
import { Pagination } from '@mui/material';

const ChatRequestSkeleton = () => (
	<motion.div
		className={`${styles.chatRequest} ${styles.skeleton}`}
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		transition={{ duration: 0.25 }}
	>
		<div className={styles.avatar}>
			<div className={styles.skeletonAvatar} />
		</div>
		<div className={styles.content}>
			<div className={styles.skeletonText} />
			<div className={styles.skeletonSubText} />
		</div>
	</motion.div>
);

const ChatRequest = ({
	id,
	name,
	subject,
	identifier,
	cgpa,
	details,
	relativeTime,
	student_id,
	consultant_id,
	onClick,
}) => {
	const iconurl = `/api/avatar?name=${encodeURIComponent(name || '')}`;

	return (
		<motion.div
			className={styles.chatRequest}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.25 }}
			onClick={() =>
				onClick({
					id,
					name,
					iconurl,
					subject,
					identifier,
					cgpa,
					details,
					student_id,
					consultant_id,
					students: {
						name,
						identifier,
						cgpa
					}
				})
			}
		>
			<div className={styles.avatar}>
				<Image
					src={iconurl}
					alt={name}
					width={40}
					height={40}
					unoptimized
				/>
			</div>
			<div className={styles.content}>
				<h3 className={styles.name}>{name}</h3>
				<p className={styles.subject}>{subject}</p>
			</div>
			<p className={styles.time}>{relativeTime}</p>
		</motion.div>
	);
};

const ChatRequestModal = ({ request, onClose, onStatusChange }) => {
	if (!request) return null;
	const [loadingStatus, setLoadingStatus] = useState(null);

	const handleStatusUpdate = async (newStatus) => {
		if (!request.id) {
			console.error('Request ID is missing!');
			return;
		}

		setLoadingStatus(newStatus);
		try {
			const response = await fetch('/api/chat-requests', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: request.id,
					status: newStatus,
					consultant_id: request.consultant_id,
					student_id: request.student_id,
				}),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || 'Failed to update request');
			}

			onStatusChange(request.id, newStatus);
			onClose();
		} catch (error) {
			console.error('Error updating status:', error);
		} finally {
			setLoadingStatus(null);
		}
	};

	return (
		<div
			className={styles.modalBackground}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				className={styles.modalContainer}
				onClick={(e) => e.stopPropagation()}
			>
				<button className={styles.closeButton} onClick={onClose}>
					&times;
				</button>

				<div className={styles.modalRow}>
					<Image
						src={`/api/avatar?name=${encodeURIComponent(
							request.students.name || ''
						)}`}
						alt={request.students.name}
						width={60}
						unoptimized
						height={60}
						className={styles.modalAvatar}
					/>
					<div>
						<h3 className={styles.modalHeader}>{request.students.name}</h3>
						{(request.students.identifier || request.students.cgpa) && (
							<p className={styles.modalSubHeader}>
								{request.students.identifier
									? `${request.students.identifier}`
									: ''}
								{request.students.identifier && request.students.cgpa
									? ' | '
									: ''}
								{typeof request.students.cgpa === 'number'
									? `CGPA: ${request.students.cgpa.toFixed(1)}`
									: ''}
							</p>
						)}
					</div>
				</div>

				<div className={styles.modalContent}>
					<h3 className={styles.subject}>{request.subject}</h3>
					{request.details ? (
						<p className={styles.details}>{request.details}</p>
					) : (
						<p className={styles.detailsPlaceholder}>
							No additional details provided.
						</p>
					)}
				</div>

				<div className={styles.modalActions}>
					<motion.button
						className={styles.rejectButton}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => handleStatusUpdate('declined')}
						disabled={loadingStatus !== null}
					>
						{loadingStatus === 'declined' ? (
							<>
								<span className={styles.loader}></span>
								Declining...
							</>
						) : (
							'Decline'
						)}
					</motion.button>

					<motion.button
						className={styles.acceptButton}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => handleStatusUpdate('accepted')}
						disabled={loadingStatus !== null}
					>
						{loadingStatus === 'accepted' ? (
							<>
								<span className={styles.loader}></span>
								Accepting...
							</>
						) : (
							'Accept'
						)}
					</motion.button>
				</div>
			</div>
		</div>
	);
};

const NotificationPopup = ({ message, type, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(onClose, 3000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<motion.div
			className={`${styles.notificationPopup} ${
				type === 'success'
					? styles.notificationSuccess
					: styles.notificationError
			}`}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
		>
			{message}
		</motion.div>
	);
};
export default function ChatRequests({ userId }) {
	const [notification, setNotification] = useState(null);
	const itemsPerPage = 3;
	const [page, setPage] = useState(1);
	const [requests, setRequests] = useState([]);
	const [totalRequests, setTotalRequests] = useState(0);
	const [loading, setLoading] = useState(true);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [showPastRequests, setShowPastRequests] = useState(false);
	const [pastRequests, setPastRequests] = useState([]);

	const fetchPastRequests = async () => {
		if (pastRequests.length > 0) {
			setShowPastRequests(true);
			return;
		}
		try {
			const response = await fetch(
				`/api/chat-requests/past?consultant_id=${userId}`
			);
			if (!response.ok) throw new Error('Failed to fetch past requests');
			const data = await response.json();
			setPastRequests(data.requests);
			setShowPastRequests(true);
		} catch (error) {
			console.error('Error fetching past requests:', error);
		}
	};

	useEffect(() => {
		const fetchChatRequests = async () => {
			try {
				const response = await fetch(
					`/api/chat-requests?consultant_id=${userId}`
				);
				const data = await response.json();
				setRequests(data.requests);
				setTotalRequests(data.totalRequests);
			} catch (error) {
				console.error('Error fetching chat requests:', error);
			} finally {
				setLoading(false);
			}
		};

		if (userId) fetchChatRequests();
	}, [userId]);

	const handleStatusChange = async (id, newStatus) => {
		setRequests((prevRequests) =>
        	prevRequests.filter((request) => request.id !== id)
    	);

		setNotification({
			message:
				newStatus === 'accepted'
					? 'Chat request accepted!'
					: 'Chat request declined.',
			type: newStatus === 'accepted' ? 'success' : 'error',
		});

		const timer = setTimeout(() => setNotification(null), 3000);
		return () => clearTimeout(timer);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2 className={styles.title}>Incoming Requests</h2>
				<button
					className={styles.pastRequestsButton}
					onClick={fetchPastRequests}
				>
					Past Requests
				</button>
			</div>

			{notification && (
				<NotificationPopup
					message={notification.message}
					type={notification.type}
					onClose={() => setNotification(null)}
				/>
			)}

			<div className={styles.requestsContainer}>
				{loading ? (
					Array.from({ length: 3 }).map((_, index) => (
						<ChatRequestSkeleton key={index} />
					))
				) : requests.length > 0 ? (
					requests.map((request) => (
						<ChatRequest
							key={request.id}
							id={request.id}
							name={request.students.name}
							student_id={request.student_id}
							consultant_id={request.consultant_id}
							subject={request.subject}
							identifier={request.students.identifier}
							cgpa={request.students.cgpa}
							details={request.details}
							relativeTime={request.relativeTime}
							onClick={(requestData) => setSelectedRequest({ ...request, ...requestData })}
						/>
					))
				) : (
					<div className={styles.noRequests}>
						<p>No pending requests at the moment.</p>
					</div>
				)}
			</div>

			{selectedRequest && (
				<ChatRequestModal
					request={selectedRequest}
					onClose={() => setSelectedRequest(null)}
					onStatusChange={handleStatusChange}
				/>
			)}

			{showPastRequests && (
				<div
					className={styles.modalBackground}
					onClick={() => setShowPastRequests(false)}
				>
					<div
						className={styles.modalContainer}
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className={styles.modalHeader}>Past Requests</h3>
						<button
							className={styles.closeButton}
							onClick={() => setShowPastRequests(false)}
						>
							&times;
						</button>

						{pastRequests.length > 0 ? (
							<>
								<div className={styles.pastRequestsList}>
									{/* Show only current page items */}
									{pastRequests
										.slice(
											(page - 1) * itemsPerPage,
											page * itemsPerPage
										)
										.map((request) => (
											<div
												key={request.id}
												className={styles.requestCard}
											>
												<div
													className={
														styles.requestHeader
													}
												>
													<Image
														src={`/api/avatar?name=${encodeURIComponent(
															request.students.name || ''
														)}`}
														alt={request.students.name || ''}
														unoptimized
														className={
															styles.avatar
														}
														width={40}
														height={40}
													/>
													<div
														className={
															styles.requestInfo
														}
													>
														<h4
															className={
																styles.name
															}
														>
															{request.students.name}
														</h4>
													</div>
													<span
														className={`${
															styles.statusTag
														} ${
															styles[
																request.status
															]
														}`}
													>
														{request.status}
													</span>
												</div>
												<div
													className={
														styles.requestDetails
													}
												>
													<p
														className={
															styles.subject
														}
													>
														{request.subject}
													</p>
													<span
														className={styles.time}
													>
														{request.relativeTime}
													</span>
												</div>
											</div>
										))}
								</div>
								{/* Pagination */}
								<div className={styles.paginationContainer}>
									<Pagination
										count={Math.ceil(
											pastRequests.length / itemsPerPage
										)}
										page={page}
										onChange={(e, newPage) =>
											setPage(newPage)
										}
										color='primary'
										size='medium'
									/>
								</div>
							</>
						) : (
							<p className={styles.noRequests}>
								No past requests found.
							</p>
						)}
					</div>
				</div>
			)}
			<ScrollToTop selector={'[class*="requestsContainer"]'} />
		</div>
	);
}
