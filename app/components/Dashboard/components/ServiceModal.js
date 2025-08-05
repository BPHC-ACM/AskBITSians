'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ServiceModal.module.css'; // Import CSS Module

export default function ServiceModal({ modalContent, setModalContent }) {
  // Only render on client side to avoid hydration issues
  if (typeof window === 'undefined') return null;
  // Only render on client side to avoid hydration issues
  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {modalContent && (
        <motion.div
          key='modal-backdrop'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.modalBackdrop}
          onClick={() => setModalContent(null)}
        >
          <motion.div
            key='modal-content'
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{
              scale: 0.95,
              opacity: 0,
              y: 30,
              transition: { duration: 0.2 },
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
            className={styles.modal}
          >
            <h2 className={styles.modalHeader}>
              {modalContent.heading} Details
            </h2>

            <div className={styles.modalBody}>
              {modalContent.long_description.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: 0.1 + index * 0.05,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={styles.detailPoint}
                >
                  <span className={styles.bullet}>•</span>
                  <p className={styles.pointText}>{point}</p>
                </motion.div>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={styles.modalCloseButton}
                onClick={() => setModalContent(null)}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
