'use client';

import Link from 'next/link';
import { IconHome, IconArrowLeft, IconSearch } from '@tabler/icons-react';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 404 Number with BITS colors */}
        <div className={styles.errorCode}>
          <span className={styles.digit}>4</span>
          <span className={styles.digit}>0</span>
          <span className={styles.digit}>4</span>
        </div>

        {/* Main heading */}
        <h1 className={styles.title}>Page Not Found</h1>

        {/* Description */}
        <p className={styles.description}>
          Oops! The page you're looking for seems to have wandered off. Don't
          worry, even the best explorers sometimes take a wrong turn.
        </p>

        {/* BITS-themed message */}
        <div className={styles.bitsMessage}>
          <p>
            Let's get you back to connecting with our amazing BITS Alumni
            community!
          </p>
        </div>

        {/* Action buttons */}
        <div className={styles.actions}>
          <Link href='/' className={styles.primaryButton}>
            <IconHome size={20} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className={styles.secondaryButton}
          >
            <IconArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Popular links */}
        <div className={styles.popularLinks}>
          <h3 className={styles.popularTitle}>Popular Pages</h3>
          <div className={styles.linkGrid}>
            <Link href='/dashboard' className={styles.link}>
              <IconSearch size={16} />
              Dashboard
            </Link>
            <Link href='/forums' className={styles.link}>
              <IconSearch size={16} />
              Forums
            </Link>
            <Link href='/alumni' className={styles.link}>
              <IconSearch size={16} />
              Alumni Showcase
            </Link>
            <Link href='/privacy-policy' className={styles.link}>
              <IconSearch size={16} />
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* BITS branding footer */}
        <div className={styles.branding}>
          <div className={styles.brandStripe}></div>
          <p className={styles.brandText}>
            A platform by BITSians, for BITSians
          </p>
        </div>
      </div>
    </div>
  );
}
