'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Overview.module.css'; // Import the new CSS Module

export default function Overview() {
  return (
    <section id='overview' className={styles.section}>
      <div className={styles.container}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className={styles.sectionHeading}
        >
          Why AskBITSians?
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className={styles.divider}
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles.paragraph}
        >
          Access a powerful network of BITS Pilani alumni who have achieved
          success across diverse industries. Our platform connects you directly
          with professionals who understand your journey and can provide
          valuable insights for your career growth.
        </motion.p>
      </div>
    </section>
  );
}
