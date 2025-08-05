'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import styles from './Header.module.css';

export default function Header({ setActiveSection }) {
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(true);
  const { scrollYProgress } = useScroll();
  const shapeY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const shapeY2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const handleScroll = () => setIsScrollButtonVisible(window.scrollY < 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollButtonClick = () => {
    document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={styles.header}>
      <motion.div
        className={styles.geometricShape}
        style={{
          width: '25vw',
          height: '25vw',
          backgroundColor: '#FDC93940',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          top: '-5vw',
          left: '-5vw',
          y: shapeY1,
        }}
      />
      <motion.div
        className={styles.geometricShape}
        style={{
          width: '30vw',
          height: '30vw',
          border: `2vw solid #85C5E830`,
          bottom: '10vh',
          right: '5vw',
          y: shapeY2,
        }}
      />
      <div className={styles.contentWrapper}>
        <div className={styles.grid}>
          <div className={styles.textContainer}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={styles.logoContainer}
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={styles.h1}
            >
              Connect with{' '}
              <span className={styles.h1Highlight}>BITS Alumni</span> for Career
              Success
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className={styles.paragraph}
            >
              Get personalized guidance from successful BITS Pilani alumni
              working at top companies worldwide. Access career insights, alumni
              resources, and networking opportunities.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <button
                onClick={() => setActiveSection('messages')}
                className={styles.actionButton}
                aria-label='Start connecting'
              >
                Start Connecting{' '}
                <ArrowRight size={20} style={{ marginLeft: '8px' }} />
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
            className={styles.visualContainer}
          />
        </div>
      </div>
      {isScrollButtonVisible && (
        <motion.button
          onClick={handleScrollButtonClick}
          aria-label='Scroll down'
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ duration: 0.3, delay: 1.2 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className={styles.scrollButton}
        >
          <ChevronDown size={28} />
        </motion.button>
      )}
    </header>
  );
}
