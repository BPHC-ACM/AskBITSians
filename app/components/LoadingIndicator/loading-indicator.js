'use client';
import React from 'react';
import styles from './loading-indicator.module.css';

export default function LoadingIndicator({
  text = 'Loading...',
  size = 'medium',
}) {
  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <div className={styles.spinner}></div>
      <span className={styles.text}>{text}</span>
    </div>
  );
}
