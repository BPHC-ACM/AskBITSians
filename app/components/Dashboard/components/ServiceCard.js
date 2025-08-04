import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { colors, getIconBgColor } from '../hooks/useViewport';

const ServiceCard = memo(({ service, index, onShowMore, viewport, icons }) => {
  const IconComponent = icons[service.icon];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const styles = {
    serviceCard: {
      background: `linear-gradient(135deg, ${colors.white} 0%, #fafafa 100%)`,
      border: `2px solid ${colors.lightGray}`,
      borderRadius: '24px',
      padding: viewport.isMobile ? '2rem' : '2.5rem',
      height: '100%',
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
    },
    iconContainer: {
      width: '80px',
      height: '80px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem',
      background: `linear-gradient(135deg, ${getIconBgColor(
        index
      )}, ${getIconBgColor(index)}CC)`,
      boxShadow: `0 8px 24px ${getIconBgColor(index)}40`,
    },
    serviceTitle: {
      fontSize: viewport.isMobile ? '1.3rem' : '1.5rem',
      fontWeight: '700',
      color: colors.dark,
      marginBottom: '0.75rem',
      lineHeight: '1.3',
    },
    serviceDescription: {
      fontSize: '1rem',
      color: colors.gray,
      lineHeight: '1.6',
      marginBottom: '1.5rem',
    },
    learnMoreButton: {
      background: 'transparent',
      border: `2px solid ${getIconBgColor(index)}`,
      color: getIconBgColor(index),
      padding: '0.75rem 1.5rem',
      borderRadius: '12px',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
  };

  const handleCardHover = (isHovered) => {
    if (isHovered) {
      return {
        ...styles.serviceCard,
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
        borderColor: getIconBgColor(index),
      };
    }
    return styles.serviceCard;
  };

  return (
    <motion.div
      variants={cardVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
      style={styles.serviceCard}
      whileHover={{
        y: -8,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
        borderColor: getIconBgColor(index),
      }}
      onClick={() => onShowMore(service)}
    >
      <div style={styles.iconContainer}>
        <IconComponent size={36} color={colors.white} stroke={2.5} />
      </div>

      <h3 style={styles.serviceTitle}>{service.heading}</h3>
      <p style={styles.serviceDescription}>{service.short_description}</p>

      <button
        style={styles.learnMoreButton}
        onMouseEnter={(e) => {
          e.target.style.background = getIconBgColor(index);
          e.target.style.color = colors.white;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = getIconBgColor(index);
        }}
      >
        Learn More
      </button>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
