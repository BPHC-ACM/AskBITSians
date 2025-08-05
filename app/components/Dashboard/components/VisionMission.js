'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { IconBooks } from '@tabler/icons-react';
import styles from './VisionMission.module.css';

export default function VisionMission() {
  return (
    <section id='vision-mission' className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className={styles.sectionHeading}
          >
            Our Core Principles
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className={styles.divider}
          />
        </div>
        <div className={styles.grid}>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <div className={`${styles.cardIcon} ${styles.cardIconVision}`}>
                <Target size={24} className={styles.iconVision} />
              </div>
              <h3 className={styles.cardTitle}>Vision</h3>
            </div>
            <p className={styles.cardDescription}>
              To create the most powerful and accessible alumni guidance network
              where every BITS student can connect with successful professionals
              and achieve their career aspirations.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <div className={`${styles.cardIcon} ${styles.cardIconMission}`}>
                <IconBooks size={24} className={styles.iconMission} />
              </div>
              <h3 className={styles.cardTitle}>Mission</h3>
            </div>
            <p className={styles.cardDescription}>
              To empower BITS students by providing direct access to our global
              alumni network, enabling meaningful guidance relationships that
              accelerate career growth and professional success.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
