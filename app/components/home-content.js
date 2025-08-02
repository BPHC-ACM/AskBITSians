'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/userContext';
import { AnimatePresence } from 'framer-motion';
import Section1 from './Dashboard/section1';
import Section2 from './Requests/section2';
import Section3 from './Chats/section3';
import Section4 from './Forum/section4';
import Section5 from './Resources/section5';
import Sidebar from './Sidebar/sidebar';
import pageStyles from '../page.module.css';
import ScrollToTop from './ScrollToTop/scroll-to-top';

export default function HomeContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user, loading } = useUser();

  // Handle client-side hydration and set initial states
  useEffect(() => {
    setIsClient(true);

    // Set initial states immediately to prevent flash
    const isMobileView = window.innerWidth <= 768;
    setIsMobile(isMobileView);
    setIsSidebarExpanded(!isMobileView); // Expanded on desktop, collapsed on mobile
  }, []);

  useEffect(() => {
    if (!isClient) return; // Skip on server

    const checkMobile = () => {
      const isMobileView = window.innerWidth <= 768;
      const wasMobile = isMobile;

      setIsMobile(isMobileView);

      // Only update sidebar expansion on actual screen size changes
      // Don't change it during initial load to prevent flash
      if (wasMobile !== isMobileView) {
        if (!isMobileView && wasMobile) {
          // Switched from mobile to desktop - expand sidebar
          setIsSidebarExpanded(true);
        } else if (isMobileView && !wasMobile) {
          // Switched from desktop to mobile - collapse sidebar
          setIsSidebarExpanded(false);
        }
      }
    };

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [isClient, isMobile]);

  const toggleSidebar = (forceState) => {
    setIsSidebarExpanded((prevState) =>
      typeof forceState === 'boolean' ? forceState : !prevState
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Section1 key='dashboard' setActiveSection={setActiveSection} />;
      case 'messages':
        return <Section3 key='messages' />;
      case 'community':
        return <Section4 key='community' />;
      case 'resources':
        return <Section5 key='resources' />;
      case 'requests':
        return <Section2 key='requests' />;
      default:
        return <Section1 key='dashboard' setActiveSection={setActiveSection} />;
    }
  };

  const getMainContentClass = () => {
    if (isMobile) {
      return pageStyles.mainMobile;
    }

    return isSidebarExpanded
      ? pageStyles.mainExpanded
      : pageStyles.mainCollapsed;
  };

  return (
    <div
      className={`${pageStyles.content} ${
        isMobile && isSidebarExpanded ? pageStyles.mobileSidebarOpen : ''
      }`}
    >
      <Sidebar
        setActiveSection={setActiveSection}
        activeSection={activeSection}
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
        loading={false} // Don't block sidebar rendering on user loading
      />
      <main className={`${pageStyles.main} ${getMainContentClass()}`}>
        <AnimatePresence mode='wait'>{renderSection()}</AnimatePresence>
        <ScrollToTop selector='main' dependency={activeSection} />
      </main>
    </div>
  );
}
