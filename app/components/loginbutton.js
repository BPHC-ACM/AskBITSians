import React from 'react';
import { supabase } from '@/utils/supabaseClient';
import { motion } from 'framer-motion';
import styles from './loginbutton.module.css';

const LoginButton = ({ isCollapsed, variant = 'dark' }) => {
	const handleLogin = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo:
						typeof window !== 'undefined'
							? window.location.origin
							: '',
				},
			});

			if (error) {
				console.error('Google login failed:', error.message);
			}
		} catch (error) {
			console.error('Unexpected error during login:', error);
		}
	};

	const textVariants = {
		expanded: {
			opacity: 1,
			display: 'flex',
			transition: { delay: 0.1, duration: 0.2 },
		},
		collapsed: {
			opacity: 0,
			transition: { duration: 0.1 },
			transitionEnd: { display: 'none' },
		},
	};

	const buttonClasses = [
		styles.pillButton,
		variant === 'light' ? styles.lightVariant : styles.darkVariant,
		isCollapsed ? styles.collapsed : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<motion.button
			className={buttonClasses}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			style={{ transformOrigin: 'center' }}
			transition={{ duration: 0.3 }}
			whileTap={{ scale: 0.95 }}
			onClick={handleLogin}
			title={isCollapsed ? 'Login with Google' : ''}
		>
			<motion.img
				layout
				src={'https://img.icons8.com/?size=512&id=17949&format=png'}
				alt={'Google Icon'}
				width={isCollapsed ? 28 : 40}
				height={isCollapsed ? 28 : 40}
				className={styles.avatar}
				transition={{ duration: 0.3 }}
			/>
			{/* Animate the text presence */}
			<motion.div
				className={styles.userInfo}
				variants={textVariants}
				animate={isCollapsed ? 'collapsed' : 'expanded'}
				initial={false}
			>
				{/* Use span for cleaner structure */}
				<span className={styles.name}>Login with Google</span>
			</motion.div>
		</motion.button>
	);
};

export default LoginButton;
