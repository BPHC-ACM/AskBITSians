'use client';

import { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './request-button.module.css';

export default function RequestButton({ studentId }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [departments, setDepartments] = useState({
		professor: [],
		student: [],
	});
	const [requestType, setRequestType] = useState('professor');
	const [formData, setFormData] = useState({
		subject: '',
		details: '',
		department: '',
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (isOpen) {
			fetchDepartments();
		}
	}, [isOpen]);

	async function fetchDepartments() {
		try {
			const response = await fetch('/api/departments');
			if (!response.ok) throw new Error('Failed to fetch departments');
			const data = await response.json();
			setDepartments(data);
		} catch (error) {
			console.error('Error fetching departments:', error);
		}
	}

	function handleChange(e) {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
			}));
		}
	}

	function handleRequestTypeChange(newType) {
		setRequestType(newType);
		setFormData((prev) => ({ ...prev, department: '' }));
		setErrors((prev) => ({ ...prev, department: undefined }));
	}

	function validateForm() {
		const newErrors = {};

		if (!formData.department) {
			newErrors.department = 'Please select a department';
		}

		if (!formData.subject) {
			newErrors.subject = 'Subject is required';
		}

		if (formData.details.length < 10) {
			newErrors.details =
				'Please provide more details (minimum 10 characters)';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const queryParams = new URLSearchParams({
				type: requestType,
				department: formData.department,
			});

			const consultantsResponse = await fetch(
				`/api/consultants?${queryParams}`
			);
			if (!consultantsResponse.ok)
				throw new Error('Failed to fetch consultants');
			const consultants = await consultantsResponse.json();

			const requests = await Promise.all(
				consultants.map(async (consultant) => {
					try {
						const response = await fetch('/api/chat-requests', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								student_id: studentId,
								consultant_id: consultant.id,
								request_type: requestType,
								subject: formData.subject,
								details: formData.details,
							}),
						});

						const responseData = await response
							.json()
							.catch((e) => ({
								error: 'Failed to parse response',
							}));

						if (!response.ok) {
							console.error(
								'Request creation failed for consultant',
								consultant.id,
								responseData
							);
						}

						return {
							response,
							responseData,
							consultant_id: consultant.id,
						};
					} catch (e) {
						console.error(
							'Fetch error for consultant',
							consultant.id,
							e
						);
						return { error: e, consultant_id: consultant.id };
					}
				})
			);

			const errors = requests.filter((r) => !r.response?.ok);
			if (errors.length > 0) {
				console.error('Failed requests details:', errors);
				throw new Error(`Failed to create ${errors.length} requests`);
			}

			setFormData({
				subject: '',
				details: '',
				department: '',
			});
			setIsOpen(false);
		} catch (error) {
			console.error('Error creating requests:', error);
		} finally {
			setIsLoading(false);
		}
	}

	const availableDepartments = departments[requestType] || [];

	return (
		<>
			<button onClick={() => setIsOpen(true)} className={styles.button}>
				NEW
			</button>

			{isOpen && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<h2 className={styles.title}>
							Create New Chat Request
						</h2>
						<p className={styles.subtitle}>
							Select the mentor type and fill in the details below
						</p>

						<Tabs.Root
							value={requestType}
							onValueChange={handleRequestTypeChange}
						>
							<Tabs.List className={styles.tabs}>
								<Tabs.Trigger
									value='professor'
									className={`${styles.tab} ${
										requestType === 'professor'
											? styles.tabActive
											: ''
									}`}
								>
									Professor Mentor
								</Tabs.Trigger>
								<Tabs.Trigger
									value='student'
									className={`${styles.tab} ${
										requestType === 'student'
											? styles.tabActive
											: ''
									}`}
								>
									Student Mentor
								</Tabs.Trigger>
							</Tabs.List>

							<form
								onSubmit={handleSubmit}
								className={styles.form}
							>
								<div className={styles.formGroup}>
									<label
										htmlFor='department'
										className={styles.label}
									>
										Department
									</label>
									<Select.Root
										value={formData.department}
										onValueChange={(value) =>
											handleChange({
												target: {
													name: 'department',
													value,
												},
											})
										}
									>
										<Select.Trigger
											className={styles.selectTrigger}
											aria-label='Department'
										>
											<Select.Value placeholder='Select a department' />
											<Select.Icon>
												<ChevronDown size={16} />
											</Select.Icon>
										</Select.Trigger>

										<Select.Portal>
											<Select.Content
												className={styles.selectContent}
												position='popper'
												sideOffset={5}
											>
												<Select.ScrollUpButton
													className={
														styles.scrollButton
													}
												>
													<ChevronUp size={16} />
												</Select.ScrollUpButton>
												<Select.Viewport
													className={
														styles.selectViewport
													}
												>
													<Select.Group>
														{availableDepartments.map(
															(dept) => (
																<Select.Item
																	key={dept}
																	value={dept}
																	className={
																		styles.selectItem
																	}
																>
																	<Select.ItemText>
																		{dept}
																	</Select.ItemText>
																	<Select.ItemIndicator
																		className={
																			styles.selectIndicator
																		}
																	>
																		<Check
																			size={
																				16
																			}
																		/>
																	</Select.ItemIndicator>
																</Select.Item>
															)
														)}
													</Select.Group>
												</Select.Viewport>
												<Select.ScrollDownButton
													className={
														styles.scrollButton
													}
												>
													<ChevronDown size={16} />
												</Select.ScrollDownButton>
											</Select.Content>
										</Select.Portal>
									</Select.Root>
									{errors.department && (
										<span className={styles.error}>
											{errors.department}
										</span>
									)}
								</div>

								<div className={styles.formGroup}>
									<label
										htmlFor='subject'
										className={styles.label}
									>
										Subject
									</label>
									<input
										type='text'
										id='subject'
										name='subject'
										value={formData.subject}
										onChange={handleChange}
										placeholder='Enter the subject'
										className={`${styles.input} ${
											errors.subject
												? styles.inputError
												: ''
										}`}
									/>
									{errors.subject && (
										<span className={styles.error}>
											{errors.subject}
										</span>
									)}
								</div>

								<div className={styles.formGroup}>
									<label
										htmlFor='details'
										className={styles.label}
									>
										Details
									</label>
									<textarea
										id='details'
										name='details'
										value={formData.details}
										onChange={handleChange}
										placeholder='Provide details about your request'
										className={`${styles.textarea} ${
											errors.details
												? styles.inputError
												: ''
										}`}
									/>
									{errors.details && (
										<span className={styles.error}>
											{errors.details}
										</span>
									)}
								</div>

								<div className={styles.buttonGroup}>
									<button
										type='button'
										onClick={() => setIsOpen(false)}
										className={styles.buttonSecondary}
									>
										Cancel
									</button>
									<button
										type='submit'
										disabled={isLoading}
										className={styles.button}
									>
										{isLoading
											? 'Creating...'
											: 'Create Request'}
									</button>
								</div>
							</form>
						</Tabs.Root>
					</div>
					<div
						className={styles.modalOverlay}
						onClick={() => setIsOpen(false)}
					/>
				</div>
			)}
		</>
	);
}
