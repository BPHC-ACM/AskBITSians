'use client';
import React, { useState, useEffect } from 'react';
import styles from './update-profile-modal.module.css';
import { IconX } from '@tabler/icons-react';
import { useUser } from '@/context/userContext';

export default function UpdateProfileModal({
	isOpen,
	onClose,
	studentId: propStudentId,
	onUpdateSuccess,
}) {
	const { user, loading: userLoading } = useUser();
	let idFromContext = null;
	if (user && user.role === 'student' && user.id && user.id !== 'unknown') {
		idFromContext = user.id;
	}
	const studentId = idFromContext || propStudentId;

	const [branch, setBranch] = useState('');
	const [cgpa, setCgpa] = useState('');
	const [batch, setBatch] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	useEffect(() => {
		if (isOpen) {
			setBranch('');
			setCgpa('');
			setBatch('');
			setError(null);
			setSuccess(null);
			setIsLoading(false);

			if (!userLoading && user) {
				setBranch(user.branch ?? '');

				setCgpa(user.cgpa?.toString() ?? '');
				setBatch(user.batch?.toString() ?? '');
			}
		}
	}, [isOpen, user, userLoading]);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);

		if (!branch || !cgpa || !batch) {
			setError('All fields are required.');
			return;
		}

		if (!studentId) {
			setError('Student ID not found. Cannot update profile.');
			console.error('Update Error: studentId is missing.');
			return;
		}

		const parsedCgpa = parseFloat(cgpa);
		if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
			setError('Please enter a valid CGPA between 0 and 10.');
			return;
		}

		if (!/^\d{4}$/.test(batch)) {
			setError('Please enter a valid 4-digit batch year.');
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch('/api/students', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					studentid: studentId,
					branch: branch.toUpperCase(),
					cgpa: parsedCgpa,
					batch: parseInt(batch, 10),
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to update profile.');
			}

			setSuccess('Profile updated successfully!');
			if (onUpdateSuccess) {
				onUpdateSuccess({
					branch: branch.toUpperCase(),
					cgpa: parsedCgpa,
					batch: parseInt(batch, 10),
				});
			}

			setTimeout(() => {
				onClose();
			}, 1500);
		} catch (err) {
			setError(err.message || 'An unexpected error occurred.');
			console.error('Update error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<button className={styles.closeButton} onClick={onClose}>
					<IconX size={24} />
				</button>
				<h2>Update Your Profile</h2>
				<p className={styles.instructions}>
					Enter your current academic details. This helps connect you
					with the right resources.
				</p>
				{/* Show loading indicator inside form if user data is still loading */}
				{userLoading && <p>Loading current data...</p>}

				{/* Disable form while user data is loading initially */}
				<form onSubmit={handleSubmit}>
					<fieldset style={{ border: 'none' }} disabled={userLoading}>
						<div className={styles.formGroup}>
							<label htmlFor='batch'>
								Batch (Year, e.g., 2023)
							</label>
							<input
								type='text'
								id='batch'
								value={batch}
								onChange={(e) => setBatch(e.target.value)}
								placeholder='YYYY'
								required
								maxLength={4}
								pattern='\d{4}'
								inputMode='numeric'
							/>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor='branch'>
								Branch Code (e.g., A7, B4A7)
							</label>
							<input
								type='text'
								id='branch'
								value={branch}
								onChange={(e) =>
									setBranch(e.target.value.toUpperCase())
								}
								placeholder='e.g., A7 or B4A7'
								required
							/>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor='cgpa'>Current CGPA</label>
							<input
								type='number'
								id='cgpa'
								value={cgpa}
								onChange={(e) => setCgpa(e.target.value)}
								placeholder='e.g., 8.75'
								required
								step='0.01'
								min='0'
								max='10'
							/>
						</div>
					</fieldset>

					{error && <p className={styles.errorMessage}>{error}</p>}
					{success && (
						<p className={styles.successMessage}>{success}</p>
					)}

					<button
						type='submit'
						disabled={isLoading || userLoading}
						className={styles.submitButton}
					>
						{isLoading
							? 'Updating...'
							: userLoading
							? 'Loading Data...'
							: 'Update Profile'}
					</button>
				</form>
			</div>
		</div>
	);
}
