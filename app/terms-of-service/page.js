import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const colors = {
	primaryLight: '#dbeafe',
	primary: '#3b82f6',
	primaryDark: '#2563eb',
	secondary: '#ffa500',
	darkBg: '#1f2937',
	textDark: '#111827',
	textLight: '#f9fafb',
	textMuted: '#6b7280',
	textMutedLight: '#d1d5db',
};

export default function TermsOfService() {
	const styles = {
		pageWrapper: {
			backgroundColor: colors.lightBg,
			color: colors.textDark,
		},
		header: {
			backgroundColor: colors.darkBg,
			color: colors.textLight,
			padding: '3rem 1rem',
			textAlign: 'center',
			borderBottom: `4px solid ${colors.primary}`,
		},
		contentWrapper: {
			maxWidth: '48rem',
			margin: '0 auto',
			padding: '3rem 1rem',
			backgroundColor: 'white',
			boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
		},
		h1: {
			fontSize: '2.5rem',
			fontWeight: 700,
			marginBottom: '1rem',
			color: 'white',
		},
		h2: {
			fontSize: '1.75rem',
			fontWeight: 600,
			marginBottom: '1.5rem',
			paddingBottom: '0.5rem',
			borderBottom: `2px solid ${colors.primaryLight}`,
		},
		p: {
			marginBottom: '1rem',
			lineHeight: 1.7,
			color: colors.textMuted,
		},
		ul: {
			listStyle: 'disc',
			marginLeft: '1.5rem',
			marginBottom: '1rem',
		},
		li: {
			marginBottom: '0.5rem',
			color: colors.textMuted,
			lineHeight: 1.7,
		},
		footer: {
			backgroundColor: colors.darkBg,
			color: colors.textMutedLight,
			padding: '4rem 1rem 2rem',
			borderTop: `5px solid ${colors.primary}`,
		},
	};

	return (
		<div style={styles.pageWrapper}>
			<header style={styles.header}>
				<div style={{ maxWidth: '72rem', margin: '0 auto' }}>
					<p
						style={{
							color: colors.primary,
							marginBottom: '0.5rem',
						}}
					>
						Legal
					</p>
					<h1 style={styles.h1}>Terms of Service</h1>
				</div>
			</header>

			<main style={styles.contentWrapper}>
				<p style={{ ...styles.p, fontStyle: 'italic' }}>
					Last Updated: April 21, 2025
				</p>

				<section style={{ marginBottom: '2.5rem' }}>
					<h2 style={styles.h2}>1. Introduction</h2>
					<p style={styles.p}>
						Welcome to the Academic Counselling Cell website. These
						Terms of Service ("Terms") govern your access to and use
						of our website, applications, and services
						(collectively, the "Service"). By accessing or using the
						Service, you agree to be bound by these Terms.
					</p>
					<p style={styles.p}>
						Our Service provides information and resources related
						to academic counselling at Birla Institute of Technology
						and science, Pilani, Hyderabad Campus. These Terms apply
						to all visitors, users, and others who access or use the
						Service.
					</p>
				</section>

				<section style={{ marginBottom: '2.5rem' }}>
					<h2 style={styles.h2}>
						2. Access and Account Registration
					</h2>
					<p style={styles.p}>
						Our Service allows you to sign in using Google
						authentication. By registering for an account, you agree
						to:
					</p>
					<ul style={styles.ul}>
						<li style={styles.li}>
							Provide accurate, current, and complete information
						</li>
						<li style={styles.li}>
							Maintain and promptly update your account
							information
						</li>
						<li style={styles.li}>
							Maintain the security of your account credentials
						</li>
						<li style={styles.li}>
							Accept responsibility for all activities that occur
							under your account
						</li>
					</ul>
				</section>

				<section style={{ marginBottom: '2.5rem' }}>
					<h2 style={styles.h2}>3. Privacy Policy</h2>
					<p style={styles.p}>
						Our Privacy Policy describes how we handle the
						information you provide to us when you use our Service.
						You understand that through your use of the Service, you
						consent to the collection and use of this information as
						set forth in our Privacy Policy.
					</p>
				</section>

				{/* Other sections would follow the same pattern... */}

				<section>
					<h2 style={styles.h2}>10. Contact Us</h2>
					<p style={styles.p}>
						If you have any questions about these Terms, please
						contact us:
					</p>
					<p style={{ ...styles.p, fontStyle: 'italic' }}>
						Academic Counselling Cell
						<br />
						Birla Institute of Technology and science, Pilani,
						Hyderabad Campus
						<br />
						Email: academiccounsellingcell@gmail.com
					</p>
				</section>
			</main>

			<footer style={styles.footer}>
				<div
					style={{
						maxWidth: '72rem',
						margin: '0 auto',
						textAlign: 'center',
					}}
				>
					<h3
						style={{
							fontSize: '1.3rem',
							fontWeight: 600,
							marginBottom: '0.85rem',
							color: 'white',
						}}
					>
						Academic Counselling Cell
					</h3>
					<div
						style={{
							marginTop: '2rem',
							paddingTop: '1.5rem',
							borderTop: `1px solid ${colors.textMutedLight}33`,
							fontSize: '0.8rem',
						}}
					>
						© {new Date().getFullYear()} Academic Counselling Cell
						(ACC), BITS Pilani Hyderabad Campus. All Rights
						Reserved.
						<div style={{ marginTop: '1rem' }}>
							<Link
								href='/'
								style={{
									color: colors.textMutedLight,
									textDecoration: 'none',
									margin: '0 0.5rem',
								}}
							>
								Home
							</Link>
							<Link
								href='/privacy-policy'
								style={{
									color: colors.textMutedLight,
									textDecoration: 'none',
									margin: '0 0.5rem',
								}}
							>
								Privacy
							</Link>
							<Link
								href='/terms-of-service'
								style={{
									color: colors.textMutedLight,
									textDecoration: 'none',
									margin: '0 0.5rem',
								}}
							>
								Terms
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
