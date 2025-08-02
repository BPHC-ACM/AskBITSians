'use client';
import styles from './forum.module.css';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { PlusIcon, MessageSquareIcon, SendIcon, Search } from 'lucide-react';
import LoginButton from '../loginbutton';
import { TextField, Button, Chip, Box, Pagination } from '@mui/material';

export function SkeletonThread() {
	return (
		<div className={styles.skeletonThread}>
			<div className={styles.skeletonHeader}>
				<div className={styles.skeletonAvatar}></div>
				<div
					className={styles.skeletonText}
					style={{ width: '50%' }}
				></div>
			</div>
			<div className={styles.skeletonText} style={{ width: '80%' }}></div>
			<div className={styles.skeletonText} style={{ width: '60%' }}></div>
		</div>
	);
}

export default function Forum({ user }) {
	const [query, setQuery] = useState({
		title: '',
		text: '',
		tags: [],
	});
	const [queries, setQueries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [answerInputs, setAnswerInputs] = useState({});
	const [tagInput, setTagInput] = useState('');

	const [page, setPage] = useState(1);
	const ITEMS_PER_PAGE = 5;

	const fetchQueries = useCallback(async () => {
		try {
			const response = await fetch('/api/forums');
			if (!response.ok) throw new Error('Failed to fetch queries');

			const data = await response.json();
			if (!data.success) throw new Error(data.error);

			setQueries(data.data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchQueries();
	}, [fetchQueries]);

	const postQuery = async () => {
		if (!query.text.trim() || !query.title.trim()) return;

		const newQuery = {
			title: query.title,
			query: query.text,
			tags: query.tags,
			identifier: user.identifier,
			id: user.id,
			name: user.name,
		};

		try {
			const response = await fetch('/api/forums', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newQuery),
			});
			const data = await response.json();
			if (!data.success) throw new Error(data.error);

			setQuery({ title: '', text: '', tags: [] });
			fetchQueries();

			setPage(1);
		} catch (error) {
			console.error(error);
		}
	};

	const postAnswer = async (queryId, answerText) => {
		if (!answerText.trim()) return;

		try {
			const response = await fetch('/api/forums', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					query_id: queryId,
					answer: answerText,
					name: user.name,
					identifier: user.identifier,
				}),
			});
			const data = await response.json();
			if (!data.success) throw new Error(data.error);

			setAnswerInputs((prev) => ({ ...prev, [queryId]: '' }));
			fetchQueries();
		} catch (error) {
			console.error(error);
		}
	};

	const filteredQueries = useMemo(() => {
		if (!searchQuery.trim()) return queries;

		const lowerSearch = searchQuery.toLowerCase();
		return queries.filter(
			(q) =>
				q.title.toLowerCase().includes(lowerSearch) ||
				q.query.toLowerCase().includes(lowerSearch) ||
				q.tags.some((tag) => tag.toLowerCase().includes(lowerSearch))
		);
	}, [queries, searchQuery]);

	const pageCount = Math.ceil(filteredQueries.length / ITEMS_PER_PAGE);
	const paginatedQueries = useMemo(() => {
		const startIndex = (page - 1) * ITEMS_PER_PAGE;
		return filteredQueries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	}, [filteredQueries, page]);

	useEffect(() => {
		setPage(1);
	}, [searchQuery]);

	const handlePageChange = (event, value) => {
		setPage(value);

		document
			.querySelector(`.${styles.threadSection}`)
			?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<div className={styles.forumLayout}>
			<Box className={styles.threadSection}>
				<h1 className={styles.pageTitle}>Recent Questions</h1>

				<div className={styles.searchContainer}>
					<div className={styles.searchWrapper}>
						<Search className={styles.searchIcon} size={16} />
						<input
							className={styles.searchInput}
							type='text'
							placeholder='Search'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				<div className={styles.queryList}>
					{loading ? (
						<div className={styles.skeletonThreadWrapper}>
							{[...Array(ITEMS_PER_PAGE)].map((_, index) => (
								<SkeletonThread key={index} />
							))}
						</div>
					) : paginatedQueries.length > 0 ? (
						paginatedQueries.map((query) => (
							<div key={query.id} className={styles.thread}>
								<div className={styles.threadHeader}>
									<img
										src={`/api/avatar?name=${encodeURIComponent(
											query.name || ''
										)}`}
										alt='User Avatar'
										className={styles.avatar}
									/>
									<div className={styles.threadInfo}>
										<h3>{query.title}</h3>
										<p className={styles.meta}>
											{query.name}
											<span className={styles.identifier}>
												{query.identifier}
											</span>
										</p>
									</div>
								</div>

								<p className={styles.threadText}>
									{query.query}
								</p>

								<div className={styles.threadReplies}>
									{query.answers.map((answer) => (
										<div
											key={answer.id}
											className={styles.answer}
										>
											<div
												className={styles.answerHeader}
											>
												<h5 className={styles.meta}>
													{answer.name}
													<span
														className={
															styles.identifier
														}
													>
														{answer.identifier}
													</span>
												</h5>
											</div>
											<div
												className={styles.answerContent}
											>
												<p>{answer.answer}</p>
											</div>
										</div>
									))}
								</div>

								<div className={styles.threadActions}>
									<button
										className={styles.commentButton}
										onClick={() =>
											setAnswerInputs((prev) => {
												const isOpen = query.id in prev;
												if (isOpen) {
													const newState = {
														...prev,
													};
													delete newState[query.id];
													return newState;
												}
												return {
													...prev,
													[query.id]: '',
												};
											})
										}
									>
										<MessageSquareIcon fontSize='small' />
									</button>

									<div className={styles.tagList}>
										{query.tags.map((tag, index) => (
											<Chip
												key={index}
												label={`#${tag}`}
												className={styles.tagChip}
											/>
										))}
									</div>
								</div>

								{answerInputs.hasOwnProperty(query.id) && (
									<div
										className={styles.answerInputContainer}
									>
										{user ? (
											<>
												<input
													type='text'
													placeholder='Add an answer'
													value={
														answerInputs[query.id]
													}
													onChange={(e) =>
														setAnswerInputs(
															(prev) => ({
																...prev,
																[query.id]:
																	e.target
																		.value,
															})
														)
													}
												/>
												<button
													className={
														styles.sendButton
													}
													onClick={() =>
														postAnswer(
															query.id,
															answerInputs[
																query.id
															]?.trim()
														)
													}
												>
													<SendIcon size={20} />
												</button>
											</>
										) : (
											<div className={styles.loginbutton}>
												<div
													className={
														styles.pillbutton
													}
												>
													<LoginButton variant='light' />
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						))
					) : (
						<div className={styles.noResults}>
							<p>
								No questions found. Try a different search term.
							</p>
						</div>
					)}
				</div>

				{!loading && filteredQueries.length > 0 && (
					<div className={styles.paginationContainer}>
						<Pagination
							count={pageCount}
							page={page}
							onChange={handlePageChange}
							variant='outlined'
							shape='rounded'
							size='medium'
						/>
					</div>
				)}
			</Box>

			<Box className={styles.postSection}>
				<h2>Ask a Question</h2>

				{user ? (
					<>
						<input
							type='text'
							placeholder='Title*'
							required
							value={query.title}
							onChange={(e) =>
								setQuery((prev) => ({
									...prev,
									title: e.target.value,
								}))
							}
							maxLength={100}
							className={styles.inputField}
						/>

						<textarea
							placeholder='Description*'
							required
							rows={4}
							value={query.text}
							onChange={(e) =>
								setQuery((prev) => ({
									...prev,
									text: e.target.value,
								}))
							}
							maxLength={500}
							className={styles.inputField}
						/>

						<input
							type='text'
							placeholder='Add Tags (Press Enter)'
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && tagInput.trim()) {
									const newTag = tagInput
										.trim()
										.replace(/\s+/g, '-')
										.toLowerCase();

									if (!query.tags.includes(newTag)) {
										setQuery((prev) => ({
											...prev,
											tags: [...prev.tags, newTag],
										}));
									}
									setTagInput('');
								}
							}}
							className={styles.inputField}
						/>

						<Box className={styles.tagContainer}>
							{query.tags.map((tag, index) => (
								<Chip
									key={index}
									className={styles.tagChip}
									label={`#${tag}`}
									onDelete={() =>
										setQuery((prev) => ({
											...prev,
											tags: prev.tags.filter(
												(t) => t !== tag
											),
										}))
									}
								/>
							))}
						</Box>

						<button
							className={styles.postButton}
							onClick={() => postQuery()}
						>
							<PlusIcon />
							Post Question
						</button>
					</>
				) : (
					<div className={styles.loginbutton}>
						<div className={styles.pillbutton}>
							<LoginButton variant='light' />
						</div>
					</div>
				)}
			</Box>
		</div>
	);
}
