'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  IconUsers,
  IconMessages,
  IconBooks,
  IconArrowRight,
  IconInfoCircle,
} from '@tabler/icons-react';
import styles from './ServiceCard.module.css';

// This is now a self-contained, performant component
const ServiceCard = React.memo(
  ({ service, index, onShowMore, setActiveSection, icons, cardColor }) => {
    const IconComponent = icons[service.icon] || IconBooks;

    const getServiceActionProps = (serviceType) => {
      // ... (This function can remain the same or be moved to the parent)
      switch (serviceType) {
        case 'forum':
          return {
            buttonText: 'Community',
            ButtonIcon: IconUsers,
            targetSection: 'community',
          };
        case 'chat':
          return {
            buttonText: 'Connect',
            ButtonIcon: IconMessages,
            targetSection: 'messages',
          };
        case 'resources':
          return {
            buttonText: 'Resources',
            ButtonIcon: IconBooks,
            targetSection: 'resources',
          };
        default:
          return {
            buttonText: 'Go to Section',
            ButtonIcon: IconArrowRight,
            targetSection: 'dashboard',
          };
      }
    };

    const { buttonText, ButtonIcon, targetSection } = getServiceActionProps(
      service.icon
    );

    // Define CSS variables based on the cardColor prop
    const cardStyle = {
      '--card-color': cardColor,
      '--card-color-transparent': `${cardColor}CC`,
      '--card-color-shadow': `${cardColor}40`,
      '--card-text-color': cardColor === '#FDC939' ? '#1a202c' : '#ffffff',
    };

    const cardVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: index * 0.1 },
      },
    };

    return (
      <motion.div
        key={service.heading}
        variants={cardVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{
          y: -8,
          boxShadow:
            '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        }}
        className={styles.serviceCard}
        style={cardStyle} // Apply the CSS variables here
      >
        <div className={styles.cardContent}>
          <div className={styles.iconContainer}>
            <IconComponent size={26} color='#ffffff' />
          </div>
          <h3 className={styles.serviceTitle}>{service.heading}</h3>
          <p className={styles.serviceDescription}>
            {service.short_description}
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <motion.button
            onClick={() => setActiveSection(targetSection)}
            whileTap={{ scale: 0.98 }}
            className={styles.actionButton}
          >
            <ButtonIcon size={16} />
            {buttonText}
          </motion.button>
          <motion.button
            onClick={() => onShowMore(service)}
            whileTap={{ scale: 0.98 }}
            className={styles.learnMoreButton}
          >
            <IconInfoCircle size={16} />
            Learn More
          </motion.button>
        </div>
      </motion.div>
    );
  }
);

ServiceCard.displayName = 'ServiceCard';
export default ServiceCard;
