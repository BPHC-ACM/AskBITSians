'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import Overview from './components/Overview';
import VisionMission from './components/VisionMission';
import Services from './components/Services';
import Footer from './components/Footer';
import ServiceModal from './components/ServiceModal';
import { fontStyles, colors } from './components/styles';

export default function Section1({ setActiveSection }) {
  const [modalContent, setModalContent] = useState(null);

  return (
    <div
      style={{
        backgroundColor: colors.lightBg,
        position: 'relative',
        ...fontStyles.body,
      }}
    >
      <Header setActiveSection={setActiveSection} />
      <main>
        <Overview />
        <VisionMission />
        <Services
          setActiveSection={setActiveSection}
          setModalContent={setModalContent}
        />
      </main>
      <Footer setActiveSection={setActiveSection} />
      <ServiceModal
        modalContent={modalContent}
        setModalContent={setModalContent}
      />
    </div>
  );
}
