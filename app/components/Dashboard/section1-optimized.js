'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import React from 'react';
import { ChevronDown, Target, ArrowRight, Info } from 'lucide-react';
import { IconUsers, IconMessages, IconBooks } from '@tabler/icons-react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';

// Import optimized components and utilities
import { useViewport, colors, fontStyles } from './hooks/useViewport';
import { servicesData } from './data/servicesData';
import ServiceCard from './components/ServiceCard';

// Memoized components for better performance
const HeroSection = memo(
  ({ viewport, shapeY1, shapeY2, scrollButtonVisible, onScrollClick }) => {
    const styles = {
      heroContainer: {
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${colors.white} 0%, #f8fafc 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      heroContent: {
        maxWidth: '72rem',
        margin: '0 auto',
        padding: viewport.isMobile ? '2rem' : '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
      },
      heroTitle: {
        fontSize: viewport.isMobile
          ? '2.5rem'
          : viewport.isDesktop
          ? '4.5rem'
          : '3.5rem',
        fontWeight: '800',
        color: colors.dark,
        marginBottom: '1.5rem',
        lineHeight: '1.1',
        fontFamily: fontStyles.primary,
      },
      heroSubtitle: {
        fontSize: viewport.isMobile ? '1.1rem' : '1.3rem',
        color: colors.gray,
        marginBottom: '2.5rem',
        maxWidth: '42rem',
        margin: '0 auto 2.5rem',
        lineHeight: '1.6',
        fontFamily: fontStyles.secondary,
      },
      ctaContainer: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexDirection: viewport.isMobile ? 'column' : 'row',
        alignItems: 'center',
      },
      primaryCta: {
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        color: colors.white,
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '50px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.3s ease',
        boxShadow: `0 4px 15px ${colors.primary}40`,
      },
      scrollButton: {
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: `2px solid ${colors.gray}`,
        borderRadius: '50px',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 50,
        transition: 'all 0.3s ease',
        opacity: scrollButtonVisible ? 1 : 0,
      },
    };

    return (
      <section style={styles.heroContainer}>
        {/* Animated Background Shapes */}
        <motion.div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: '25vw',
            height: '25vw',
            background: `linear-gradient(135deg, ${colors.secondary}40, ${colors.primary}40)`,
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            zIndex: 1,
          }}
          animate={{ y: shapeY1 }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '30vw',
            height: '30vw',
            border: `2vw solid ${colors.primary}30`,
            borderRadius: '50%',
            zIndex: 1,
          }}
          animate={{ y: shapeY2 }}
        />

        <div style={styles.heroContent}>
          <motion.h1
            style={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Connect with{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              BITS Alumni
            </span>
          </motion.h1>

          <motion.p
            style={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Your gateway to personalized career guidance, industry insights, and
            professional networking with successful BITS Pilani alumni.
          </motion.p>

          <motion.div
            style={styles.ctaContainer}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Link href='#services'>
              <button
                style={styles.primaryCta}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 6px 25px ${colors.primary}60`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 4px 15px ${colors.primary}40`;
                }}
              >
                Get Started
                <ArrowRight size={20} />
              </button>
            </Link>
          </motion.div>
        </div>

        {scrollButtonVisible && (
          <button
            style={styles.scrollButton}
            onClick={onScrollClick}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 1)';
              e.target.style.borderColor = colors.primary;
              e.target.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              e.target.style.borderColor = colors.gray;
              e.target.style.color = colors.gray;
            }}
          >
            <ChevronDown size={24} />
          </button>
        )}
      </section>
    );
  }
);

const ServicesSection = memo(({ services, viewport, onShowMore, icons }) => {
  const styles = {
    servicesContainer: {
      maxWidth: '72rem',
      margin: '0 auto',
      padding: viewport.isMobile ? '4rem 2rem' : '6rem 2rem',
    },
    sectionTitle: {
      fontSize: viewport.isMobile ? '2rem' : '2.5rem',
      fontWeight: '700',
      color: colors.dark,
      textAlign: 'center',
      marginBottom: '1rem',
      fontFamily: fontStyles.primary,
    },
    sectionSubtitle: {
      fontSize: '1.1rem',
      color: colors.gray,
      textAlign: 'center',
      marginBottom: '4rem',
      maxWidth: '36rem',
      margin: '0 auto 4rem',
      lineHeight: '1.6',
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: viewport.isMobile
        ? '1fr'
        : viewport.isTablet
        ? 'repeat(2, 1fr)'
        : 'repeat(3, 1fr)',
      gap: '2rem',
    },
  };

  return (
    <section id='services' style={styles.servicesContainer}>
      <motion.h2
        style={styles.sectionTitle}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        How We Help You Succeed
      </motion.h2>

      <motion.p
        style={styles.sectionSubtitle}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Discover the comprehensive support system designed to accelerate your
        career growth through meaningful connections.
      </motion.p>

      <div style={styles.servicesGrid}>
        {services.map((service, index) => (
          <ServiceCard
            key={service.heading}
            service={service}
            index={index}
            onShowMore={onShowMore}
            viewport={viewport}
            icons={icons}
          />
        ))}
      </div>
    </section>
  );
});

// Main component
export default function Section1({ setActiveSection }) {
  const viewport = useViewport();
  const icons = {
    forum: IconUsers,
    chat: IconMessages,
    resources: IconBooks,
  };

  const [services] = useState(servicesData);
  const [modalContent, setModalContent] = useState(null);
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(true);

  const { scrollYProgress } = useScroll();
  const shapeY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const shapeY2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const scrollButtonTargetId = 'services';

  // Optimized scroll handler with debouncing
  useEffect(() => {
    let timeoutId;
    const handleScrollForButton = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollY = window.scrollY;
        setIsScrollButtonVisible(scrollY < 100);
      }, 10);
    };

    window.addEventListener('scroll', handleScrollForButton);
    return () => {
      window.removeEventListener('scroll', handleScrollForButton);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleScrollButtonClick = () => {
    document.getElementById(scrollButtonTargetId)?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const handleShowMore = (service) => {
    setModalContent(service);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div style={{ fontFamily: fontStyles.primary }}>
      <HeroSection
        viewport={viewport}
        shapeY1={shapeY1}
        shapeY2={shapeY2}
        scrollButtonVisible={isScrollButtonVisible}
        onScrollClick={handleScrollButtonClick}
      />

      <ServicesSection
        services={services}
        viewport={viewport}
        onShowMore={handleShowMore}
        icons={icons}
      />

      {/* Modal component */}
      <AnimatePresence>
        {modalContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '2rem',
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                background: colors.white,
                borderRadius: '20px',
                padding: '2rem',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: colors.dark,
                }}
              >
                {modalContent.heading}
              </h3>
              <ul style={{ lineHeight: '1.8', color: colors.gray }}>
                {modalContent.long_description.map((item, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={closeModal}
                style={{
                  marginTop: '2rem',
                  background: colors.primary,
                  color: colors.white,
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add display names for debugging
HeroSection.displayName = 'HeroSection';
ServicesSection.displayName = 'ServicesSection';
