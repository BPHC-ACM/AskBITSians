'use client';

import React, { useState, useEffect } from 'react'; // Import React
import { ArrowUp } from 'lucide-react';
import styles from './ScrollToTop.module.css';

export default function ScrollToTop({ selector = 'main', dependency }) {
	const [isVisible, setIsVisible] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isMobile, setIsMobile] = useState(false); // State for mobile check

	useEffect(() => {
		if (!dependency) return;

		const element = document.querySelector(selector);
		if (!element) return;

		if (typeof element.scrollTo === 'function') {
			element.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}, [dependency, selector]);

	// Check mobile state on mount and resize
	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth <= 768);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Effect to handle scroll visibility
	useEffect(() => {
		const element = document.querySelector(selector);
		if (!element) {
			console.warn(
				`ScrollToTop: Element with selector "${selector}" not found.`
			);
			return; // Exit if element not found
		}

		const toggleVisibility = () => {
			// Ensure element has scrollTop property (like HTMLElement)
			if (typeof element.scrollTop === 'number') {
				setIsVisible(element.scrollTop > 300);
			}
		};

		element.addEventListener('scroll', toggleVisibility, { passive: true }); // Use passive listener
		// Initial check in case element is already scrolled
		toggleVisibility();

		return () => element.removeEventListener('scroll', toggleVisibility);
	}, [selector]); // Dependency: only re-run if selector changes

	const scrollToTop = () => {
		const element = document.querySelector(selector);
		if (!element) return;

		// Check if element has the scrollTo method
		if (typeof element.scrollTo === 'function') {
			element.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		}
	};

	return (
		<button
			onClick={scrollToTop}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={`${styles.scrollToTop} ${
				isVisible ? styles.visible : ''
			} ${isHovered ? styles.hovered : ''}`} // Keep hovered class if needed by CSS
			aria-label='Scroll to top'
			title='Scroll to top'
		>
			<ArrowUp size={isMobile ? 20 : 18} className={styles.icon} />
			{!isMobile && <span>Scroll to Top</span>}
		</button>
	);
}
