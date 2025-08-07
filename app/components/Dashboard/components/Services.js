'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IconUsers, IconMessages, IconSchool } from '@tabler/icons-react';
import styles from './Services.module.css';
import { servicesData } from './servicesData';
import ServiceCard from './ServiceCard';

export default function Services({ setActiveSection, setModalContent }) {
  const icons = { forum: IconUsers, chat: IconMessages, alumni: IconSchool };
  const colors = {
    bitsBlue: '#85C5E8',
    bitsGold: '#FDC939',
    bitsRed: '#EA1425',
  };

  const getIconColor = (index) => {
    const iconColors = [colors.bitsBlue, colors.bitsGold, colors.bitsRed];
    return iconColors[index % iconColors.length];
  };

  return (
    <section id='services' className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className={styles.sectionHeading}
          >
            Our Core Features
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
            Leverage our platform to connect with alumni and access valuable
            resources.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {servicesData.map((service, index) => (
            <ServiceCard
              key={service.heading}
              service={service}
              index={index}
              onShowMore={setModalContent}
              setActiveSection={setActiveSection}
              icons={icons}
              cardColor={getIconColor(index)} // Pass the calculated color as a prop
            />
          ))}
        </div>
      </div>
    </section>
  );
}
