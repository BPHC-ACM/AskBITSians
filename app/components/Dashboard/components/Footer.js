'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Footer.module.css'; // Import the CSS Module

// Define colors here or import from a shared constants file if needed by JS (like for framer-motion)
const colors = {
  secondary: '#FDC939',
  tertiary: '#EA1425',
};

export default function Footer({ setActiveSection }) {
  const exploreLinks = ['community', 'messages', 'resources'];
  const quickLinks = [
    { name: 'Terms of Service', path: '/terms-of-service' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Brand */}
          <div>
            <h3 className={styles.brandHeading}>AskBITSians</h3>
            <p className={styles.brandDescription}>
              Your gateway to the BITSian network. Connect, learn, and grow with
              the support of experienced alumni.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className={`${styles.linksHeading} ${styles.quickLinks}`}>
              Quick Links
            </h4>
            <ul className={styles.linksList}>
              {quickLinks.map((link) => (
                <motion.li
                  key={link.path}
                  whileHover={{ x: 6, color: colors.secondary }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <Link href={link.path} className={styles.link}>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div>
            <h4 className={`${styles.linksHeading} ${styles.exploreLinks}`}>
              Explore
            </h4>
            <ul className={styles.linksList}>
              {exploreLinks.map((link) => (
                <motion.li
                  key={link}
                  whileHover={{
                    x: 6,
                    color: colors.tertiary,
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <a
                    onClick={() => setActiveSection(link)}
                    className={`${styles.link} ${styles.exploreLink}`}
                  >
                    {link.charAt(0).toUpperCase() + link.slice(1)}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          © {new Date().getFullYear()} ACM BPHC. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
