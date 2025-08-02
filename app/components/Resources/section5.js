import React, { useState, useEffect } from 'react';
import Section from '../section';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './section5.module.css';

export default function Section5() {
  const [searchTerm, setSearchTerm] = useState('');
  const [profsData, setProfsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/alumni?type=all');

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        setProfsData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching alumni:', err);
        setError('Failed to load alumni information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const sortedProfs = React.useMemo(
    () => [...profsData].sort((a, b) => a.name.localeCompare(b.name)),
    [profsData]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProfs = React.useMemo(
    () =>
      sortedProfs.filter((alumni) => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return (
          alumni.name.toLowerCase().includes(lowerCaseSearch) ||
          (alumni.company &&
            alumni.company.toLowerCase().includes(lowerCaseSearch)) ||
          (alumni.job_title &&
            alumni.job_title.toLowerCase().includes(lowerCaseSearch))
        );
      }),
    [sortedProfs, searchTerm]
  );

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  const noResultsVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <Section
        title={`Alumni Companies`}
        content={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center' }}
            exit={{ opacity: 0 }}
            className={styles.loadingMessage}
          >
            Loading alumni information...
          </motion.div>
        }
      />
    );
  }

  if (error || !profsData || profsData.length === 0) {
    return (
      <Section
        title={`Alumni Companies`}
        content={
          <motion.div
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.errorMessage}
          >
            {error || 'No alumni information available at the moment.'}
          </motion.div>
        }
      />
    );
  }

  return (
    <Section
      title={`Alumni Companies`}
      content={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className={styles.introText}>
            Connect with our distinguished BITS alumni working at top companies
            worldwide.
          </p>

          <div className={styles.searchContainer}>
            <input
              type='search'
              placeholder='Search'
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
              aria-label='Search alumni by name, company, or job title'
            />
          </div>

          <AnimatePresence mode='popLayout'>
            {filteredProfs.length > 0 ? (
              <motion.div
                key='prof-grid'
                className={styles.profGrid}
                variants={gridContainerVariants}
                initial='hidden'
                animate='visible'
                exit={{ opacity: 0 }}
              >
                {filteredProfs.map((alumni) => {
                  const userName = alumni.name;
                  return (
                    <motion.div
                      key={userName}
                      className={styles.profCard}
                      variants={cardVariants}
                      layout
                    >
                      <img
                        src={`/api/avatar?name=${encodeURIComponent(
                          userName || ''
                        )}`}
                        alt={`${userName} Avatar`}
                        className={styles.avatar}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className={styles.profInfo}>
                        <h3 className={styles.profName} title={userName}>
                          {userName}
                        </h3>
                        <p className={styles.profChamber}>
                          <span className={styles.chamberLabel}>Company:</span>
                          <span className={styles.chamberValue}>
                            {' ' + (alumni.company || 'Not specified')}
                          </span>
                        </p>
                        {alumni.job_title && (
                          <p className={styles.profChamber}>
                            <span className={styles.chamberLabel}>Role:</span>
                            <span className={styles.chamberValue}>
                              {' ' + alumni.job_title}
                            </span>
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.p
                key='no-results'
                className={styles.noResultsText}
                variants={noResultsVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
              >
                No alumni match your search.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      }
    />
  );
}
