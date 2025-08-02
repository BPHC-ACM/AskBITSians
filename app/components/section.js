'use client';

import { motion } from 'framer-motion';
import styles from './section.module.css';

const variants = {
	hidden: { opacity: 0, y: 50 },
	visible: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -50 },
};

export default function Section({ title, content }) {
	return (
		<motion.div
			className={styles.section}
			initial='hidden'
			animate='visible'
			exit='exit'
			variants={variants}
			transition={{ duration: 0.25 }}
		>
			<h2 className={styles.title}>{title}</h2>
			<div className={styles.content}>{content}</div>
		</motion.div>
	);
}
