'use client';

import { useState, useEffect } from 'react';
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

const servicesData = [
  {
    heading: '1:1 Alumni Mentorship',
    short_description:
      'Connect directly with successful BITS alumni for personalized career guidance.',
    long_description: [
      'Private Conversations: Engage in one-on-one chats with alumni working at top companies and organizations worldwide.',
      'Career Guidance: Get tailored advice on career transitions, job search strategies, interview preparation, and industry insights.',
      'Professional Networking: Build meaningful relationships with mentors who can guide your professional journey.',
      'Industry Expertise: Access insights from alumni across diverse fields including tech, finance, consulting, research, and entrepreneurship.',
    ],
    icon: 'chat',
  },
  {
    heading: 'Community Forum',
    short_description: 'Tap into the collective wisdom of the BITSian network.',
    long_description: [
      'Open Discussions: Post your questions about career choices, industry trends, or professional challenges and get answers from experienced alumni.',
      'Success Stories: Learn from the journeys of alumni who have achieved success in various fields.',
      'Knowledge Sharing: A collaborative platform where BITSians share insights, opportunities, and advice.',
      'Peer Network: Connect with fellow BITSians at different career stages for mutual support and guidance.',
    ],
    icon: 'forum',
  },
  {
    heading: 'Resource Hub',
    short_description:
      'Access curated resources and insights from the BITS alumni network.',
    long_description: [
      'Career Playbooks: Comprehensive guides on different career paths, prepared by successful alumni.',
      'Interview Experiences: Real interview experiences and preparation tips from alumni at top companies.',
      'Industry Reports: Insights and trends shared by alumni working in various industries.',
      'Mentorship Resources: Tools and frameworks to make the most of your mentorship journey.',
    ],
    icon: 'resources',
  },
];

const useViewport = () => {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWindowResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return {
    width,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1099,
    isLaptop: width >= 1099 && width < 1300,
    isDesktop: width >= 1300,
  };
};

export default function Section1({ setActiveSection }) {
  const viewport = useViewport();
  const icons = {
    forum: IconUsers,
    chat: IconMessages,
    resources: IconBooks,
  };
  const [services] = useState(servicesData);

  const [modalContent, setModalContent] = useState(null);

  // BITS Pilani Official Color Scheme
  const colors = {
    bitsBlue: '#85C5E8',
    bitsGold: '#FDC939',
    bitsRed: '#EA1425',

    primary: '#85C5E8', // BITS Blue as primary
    secondary: '#FDC939', // BITS Gold as secondary/accent
    tertiary: '#EA1425', // BITS Red for specific highlights

    lightBg: '#f7f9fa',
    darkBg: '#1a202c', // A darker, more modern charcoal
    textDark: '#2d3748',
    textLight: '#f7fafc',
    textMuted: '#718096',
    textMutedLight: '#a0aec0',

    glassBg: 'rgba(26, 32, 44, 0.7)',
  };

  const fontStyles = {
    heading: {
      fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    body: {
      fontFamily: `'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`,
      lineHeight: 1.7,
    },
  };

  const { scrollYProgress } = useScroll();
  const shapeY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const shapeY2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const styles = {
    header: {
      logoContainer: {
        width: viewport.isMobile ? '70px' : '90px',
        height: viewport.isMobile ? '70px' : '90px',
        marginBottom: '1rem',
        backgroundColor: colors.textDark,
        // IMPORTANT: Replace with your new 'AskBITSians' logo
        maskImage: 'url(/askbitsians-logo.png)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/askbitsians-logo.png)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      },
      h1: {
        ...fontStyles.heading,
        fontSize: viewport.isMobile ? '2.8rem' : '4.2rem',
        marginBottom: '1.5rem',
        color: colors.textDark,
        lineHeight: 1.1,
      },
      h1Highlight: {
        background: `linear-gradient(90deg, ${colors.secondary}, ${colors.tertiary})`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      },
      paragraph: {
        ...fontStyles.body,
        fontSize: '1.1rem',
        maxWidth: '36rem',
        marginBottom: '2.5rem',
        color: colors.textMuted,
      },
      geometricShape: {
        position: 'absolute',
        opacity: 0.8,
        zIndex: 1,
      },
    },
    section: {
      padding: viewport.isMobile ? '4rem 1.5rem' : '6rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    },
    sectionHeading: {
      ...fontStyles.heading,
      fontSize: viewport.isMobile ? '2rem' : '2.8rem',
      marginBottom: '1rem',
      color: colors.textDark,
    },
    divider: {
      width: '5rem',
      height: '5px',
      borderRadius: '4px',
      marginBottom: '2rem',
      background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
    },
    grid: {
      visionMission: {
        display: 'grid',
        gridTemplateColumns: viewport.isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '2rem',
      },
      services: {
        display: 'grid',
        gridTemplateColumns: viewport.isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '2rem',
        marginTop: '3rem',
      },
      footer: {
        display: 'grid',
        gridTemplateColumns: viewport.isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '2.5rem',
      },
    },

    cardButtonContainer: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1.5rem',
      width: '100%',
    },

    cardActionButton: {
      flexGrow: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      color: colors.darkBg,
      fontSize: '0.9rem',
      fontWeight: 600,
      padding: '0.8rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      border: 'none',
      textAlign: 'center',
      transition: 'transform 0.2s ease, filter 0.2s ease',
    },

    cardLearnMoreButton: {
      flexGrow: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      backgroundColor: 'transparent',
      fontSize: '0.9rem',
      fontWeight: 600,
      padding: '0.8rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      borderWidth: '2px',
      borderStyle: 'solid',
      textAlign: 'center',
      transition: 'background-color 0.2s ease, color 0.2s ease',
    },

    modal: {
      width: viewport.isMobile ? '95%' : '90%',
      maxWidth: '42rem',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      maxHeight: '85vh',
      overflowY: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      textAlign: 'left',
      position: 'relative',
      zIndex: 2150,
      display: 'flex',
      flexDirection: 'column',
    },
    modalBackdrop: {
      position: 'fixed',
      inset: 0,
      backgroundColor: colors.glassBg,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2100,
      padding: '1rem',
    },
    modalCloseButton: {
      backgroundColor: colors.textMutedLight,
      color: colors.darkBg,
      padding: '0.7rem 1.8rem',
      borderRadius: '8px',
      cursor: 'pointer',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: 600,
      width: 'fit-content',
      margin: '1rem auto 0 auto',
      transition: 'background-color 0.2s ease',
    },
  };

  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(true);
  const scrollButtonTargetId = 'overview';

  useEffect(() => {
    const handleScrollForButton = () => {
      setIsScrollButtonVisible(window.scrollY < 50);
    };
    handleScrollForButton();
    window.addEventListener('scroll', handleScrollForButton, {
      passive: true,
    });
    return () => window.removeEventListener('scroll', handleScrollForButton);
  }, []);

  const handleScrollButtonClick = () => {
    document
      .getElementById(scrollButtonTargetId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getIconBgColor = (index) => {
    const bgColors = [
      `${colors.bitsBlue}20`,
      `${colors.bitsGold}20`,
      `${colors.bitsRed}20`,
    ];
    return bgColors[index % bgColors.length];
  };

  const getIconColor = (index) => {
    const iconColors = [colors.bitsBlue, colors.bitsGold, colors.bitsRed];
    return iconColors[index % iconColors.length];
  };

  const getServiceActionProps = (serviceType) => {
    let buttonText = 'Go to Section';
    let ButtonIcon = ArrowRight;
    let targetSection = 'dashboard';
    switch (serviceType) {
      case 'forum':
        buttonText = 'Community';
        ButtonIcon = IconUsers;
        targetSection = 'community';
        break;
      case 'chat':
        buttonText = 'Connect';
        ButtonIcon = IconMessages;
        targetSection = 'messages';
        break;
      case 'resources':
        buttonText = 'Resources';
        ButtonIcon = IconBooks;
        targetSection = 'resources';
        break;
    }
    return { buttonText, ButtonIcon, targetSection };
  };

  return (
    <div
      style={{
        backgroundColor: colors.lightBg,
        position: 'relative',
        ...fontStyles.body,
      }}
    >
      {/* Header */}
      <header
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          background: '#ffffff',
          overflow: 'hidden',
        }}
      >
        {/* Background Geometric Shapes */}
        <motion.div
          style={{
            ...styles.header.geometricShape,
            width: '25vw',
            height: '25vw',
            backgroundColor: `${colors.bitsGold}40`,
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            top: '-5vw',
            left: '-5vw',
            y: shapeY1,
          }}
        />
        <motion.div
          style={{
            ...styles.header.geometricShape,
            width: '30vw',
            height: '30vw',
            border: `2vw solid ${colors.bitsBlue}30`,
            bottom: '10vh',
            right: '5vw',
            y: shapeY2,
          }}
        />

        {/* Header Content */}
        <div
          style={{
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '2rem',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: viewport.isMobile ? '1fr' : '1.2fr 1fr',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            {/* Left Column: Text */}
            <div style={{ textAlign: viewport.isMobile ? 'center' : 'left' }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  ...styles.header.logoContainer,
                  margin: viewport.isMobile ? '0 auto 1rem' : '0 0 1rem',
                }}
                aria-label='AskBITSians Logo'
              />
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={styles.header.h1}
              >
                Connect with{' '}
                <span style={styles.header.h1Highlight}>BITS Alumni</span> for
                Career Success
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={styles.header.paragraph}
              >
                Get personalized guidance from successful BITS Pilani alumni
                working at top companies worldwide. Access career insights,
                mentorship, and networking opportunities through our exclusive
                platform.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <button
                  onClick={() => setActiveSection('messages')}
                  style={{
                    ...styles.cardActionButton,
                    backgroundColor: colors.secondary,
                    color: colors.darkBg,
                    padding: '1rem 2.5rem',
                    fontSize: '1rem',
                    width: viewport.isMobile ? '100%' : 'auto',
                  }}
                >
                  Start Connecting{' '}
                  <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                </button>
              </motion.div>
            </div>

            {/* Right Column: Visual (Optional, shown on larger screens) */}
            {!viewport.isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
                style={{
                  position: 'relative',
                  height: '500px',
                  background: `url('https://images.unsplash.com/photo-1556761175-b413da4b248q?q=80&w=1974&auto=format&fit=crop')`, // Placeholder - replace with relevant image
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '16px',
                  boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`,
                }}
              />
            )}
          </div>
        </div>

        {/* Scroll Down Button */}
        {isScrollButtonVisible && (
          <motion.button
            onClick={handleScrollButtonClick}
            aria-label='Scroll down'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'absolute',
              bottom: '5vh',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'transparent',
              color: colors.textMuted,
              border: `2px solid ${colors.textMuted}`,
              borderRadius: '50px',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 50,
            }}
          >
            <ChevronDown size={28} />
          </motion.button>
        )}
      </header>

      {/* Overview Section */}
      <section
        id='overview'
        style={{ ...styles.section, backgroundColor: colors.lightBg }}
      >
        <div
          style={{ maxWidth: '72rem', margin: '0 auto', textAlign: 'center' }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            style={styles.sectionHeading}
          >
            Why AskBITSians?
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            style={{ ...styles.divider, margin: '0 auto 2rem' }}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '1.2rem',
              color: colors.textMuted,
              maxWidth: '48rem',
              margin: '0 auto',
            }}
          >
            Access a powerful network of BITS Pilani alumni who have achieved
            success across diverse industries. Our platform connects you
            directly with professionals who understand your journey and can
            provide valuable insights for your career growth.
          </motion.p>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section
        id='vision-mission'
        style={{ ...styles.section, backgroundColor: '#ffffff' }}
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              style={styles.sectionHeading}
            >
              Our Core Principles
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              style={{ ...styles.divider, margin: '0 auto 2rem' }}
            />
          </div>
          <div style={styles.grid.visionMission}>
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                border: `1px solid #e2e8f0`,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: `${colors.bitsBlue}20`,
                    borderRadius: '8px',
                    padding: '10px',
                    marginRight: '1rem',
                  }}
                >
                  <Target size={24} style={{ color: colors.bitsBlue }} />
                </div>
                <h3
                  style={{
                    ...fontStyles.heading,
                    fontSize: '1.5rem',
                    color: colors.textDark,
                  }}
                >
                  Vision
                </h3>
              </div>
              <p style={{ color: colors.textMuted, fontSize: '1rem' }}>
                To create the most powerful and accessible alumni mentorship
                network where every BITS student can connect with successful
                professionals and achieve their career aspirations.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                border: `1px solid #e2e8f0`,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: `${colors.bitsGold}20`,
                    borderRadius: '8px',
                    padding: '10px',
                    marginRight: '1rem',
                  }}
                >
                  <IconBooks size={24} style={{ color: colors.bitsGold }} />
                </div>
                <h3
                  style={{
                    ...fontStyles.heading,
                    fontSize: '1.5rem',
                    color: colors.textDark,
                  }}
                >
                  Mission
                </h3>
              </div>
              <p style={{ color: colors.textMuted, fontSize: '1rem' }}>
                To empower BITS students by providing direct access to our
                global alumni network, enabling meaningful mentorship
                relationships that accelerate career growth and professional
                success.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id='services'
        style={{ ...styles.section, backgroundColor: colors.lightBg }}
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              style={styles.sectionHeading}
            >
              Our Core Features
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              style={{ ...styles.divider, margin: '0 auto 2rem' }}
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontSize: '1.2rem',
                color: colors.textMuted,
                maxWidth: '48rem',
                margin: '0 auto',
              }}
            >
              Leverage our platform to connect with alumni and access valuable
              resources.
            </motion.p>
          </div>

          <div style={styles.grid.services}>
            {services.map((service, index) => {
              const IconComponent = icons[service.icon] || IconBooks;
              const cardColor = getIconColor(index);
              const { buttonText, ButtonIcon, targetSection } =
                getServiceActionProps(service.icon);
              const gradientEndColor =
                cardColor === colors.bitsGold ? '#FFB700' : cardColor;

              return (
                <motion.div
                  key={service.heading}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -8,
                    boxShadow: `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)`,
                  }}
                  style={{
                    padding: '2rem',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    boxShadow:
                      '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid #e2e8f0',
                    transition:
                      'transform 0.25s ease-out, box-shadow 0.25s ease-out',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: getIconBgColor(index),
                        borderRadius: '10px',
                        width: '52px',
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                      }}
                    >
                      <IconComponent size={26} style={{ color: cardColor }} />
                    </div>
                    <h3
                      style={{
                        ...fontStyles.heading,
                        fontSize: '1.4rem',
                        color: colors.textDark,
                        marginBottom: '0.5rem',
                      }}
                    >
                      {service.heading}
                    </h3>
                    <p
                      style={{
                        color: colors.textMuted,
                        fontSize: '1rem',
                        flexGrow: 1,
                      }}
                    >
                      {service.short_description}
                    </p>
                  </div>

                  <div style={styles.cardButtonContainer}>
                    <motion.button
                      onClick={() => setActiveSection(targetSection)}
                      whileHover={{ filter: 'brightness(1.1)' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        ...styles.cardActionButton,
                        background: cardColor,
                        color:
                          cardColor === colors.bitsGold
                            ? colors.darkBg
                            : 'white',
                      }}
                    >
                      <ButtonIcon size={16} />
                      {buttonText}
                    </motion.button>
                    <motion.button
                      onClick={() => setModalContent(service)}
                      whileHover={{ backgroundColor: `${cardColor}20` }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        ...styles.cardLearnMoreButton,
                        borderColor: cardColor,
                        color: cardColor,
                      }}
                    >
                      <Info size={16} />
                      Learn More
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {modalContent && (
            <motion.div
              key='modal-backdrop'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={styles.modalBackdrop}
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
                style={styles.modal}
              >
                <div style={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                  <h2
                    style={{
                      ...fontStyles.heading,
                      fontSize: '1.8rem',
                      color: colors.textDark,
                      textAlign: 'center',
                      paddingBottom: '1rem',
                      borderBottom: `2px solid ${colors.lightBg}`,
                    }}
                  >
                    {modalContent.heading} Details
                  </h2>
                  <div
                    style={{
                      color: colors.textMuted,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      maxHeight: '55vh',
                      overflowY: 'auto',
                      padding: '1.5rem 0.5rem 0 0',
                    }}
                  >
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
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75em',
                        }}
                      >
                        <span
                          style={{ color: colors.primary, fontWeight: 600 }}
                        >
                          •
                        </span>
                        <p style={{ margin: 0, fontSize: '1rem' }}>{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '1.5rem',
                    width: '100%',
                    borderTop: `2px solid ${colors.lightBg}`,
                  }}
                >
                  <motion.button
                    onClick={() => setModalContent(null)}
                    whileHover={{ backgroundColor: '#CBD5E0' }}
                    whileTap={{ scale: 0.95 }}
                    style={styles.modalCloseButton}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: colors.darkBg,
          color: colors.textMutedLight,
          padding: '5rem 1.5rem 2rem',
          borderTop: `6px solid ${colors.primary}`,
        }}
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={styles.grid.footer}>
            <div>
              <h3
                style={{
                  ...fontStyles.heading,
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: 'white',
                }}
              >
                AskBITSians
              </h3>
              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  maxWidth: '24rem',
                }}
              >
                Your gateway to the BITSian network. Connect, learn, and grow
                with the support of experienced alumni.
              </p>
            </div>
            <div>
              <h4
                style={{
                  ...fontStyles.heading,
                  fontSize: '1.1rem',
                  marginBottom: '1.2rem',
                  color: 'white',
                  borderLeft: `4px solid ${colors.secondary}`,
                  paddingLeft: '1rem',
                }}
              >
                Quick Links
              </h4>
              <ul
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  padding: 0,
                  listStyle: 'none',
                  margin: 0,
                }}
              >
                {[
                  { name: 'Terms of Service', path: '/terms-of-service' },
                  { name: 'Privacy Policy', path: '/privacy-policy' },
                ].map((link) => (
                  <motion.li
                    key={link.path}
                    whileHover={{ x: 6, color: colors.secondary }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <Link
                      href={link.path}
                      style={{
                        color: 'inherit',
                        textDecoration: 'none',
                        fontSize: '1rem',
                      }}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                style={{
                  ...fontStyles.heading,
                  fontSize: '1.1rem',
                  marginBottom: '1.2rem',
                  color: 'white',
                  borderLeft: `4px solid ${colors.tertiary}`,
                  paddingLeft: '1rem',
                }}
              >
                Explore
              </h4>
              <ul
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  padding: 0,
                  listStyle: 'none',
                  margin: 0,
                }}
              >
                {['community', 'messages', 'resources'].map((link) => (
                  <motion.li
                    key={link}
                    whileHover={{
                      x: 6,
                      color: colors.tertiary,
                      cursor: 'pointer',
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <a
                      onClick={() => setActiveSection(link)}
                      style={{
                        color: 'inherit',
                        textDecoration: 'none',
                        fontSize: '1rem',
                      }}
                    >
                      {link.charAt(0).toUpperCase() + link.slice(1)}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
          <div
            style={{
              textAlign: 'center',
              marginTop: '5rem',
              paddingTop: '2rem',
              borderTop: `1px solid #4A5568`,
              fontSize: '0.9rem',
              color: colors.textMutedLight,
            }}
          >
            © {new Date().getFullYear()} AskBITSians. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
