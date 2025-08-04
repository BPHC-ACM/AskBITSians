'use client';

import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Dynamic import with loading fallback
const HomeContent = dynamic(() => import('./components/home-content'), {
  loading: () => (
    <div className={styles.pageLoading}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading AskBITSians...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <div className={styles.container}>
      <HomeContent />
    </div>
  );
}
