'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useUser } from '@/context/userContext';
import dynamic from 'next/dynamic';
import pageStyles from '../page.module.css';

// Dynamic imports for better performance - load only when needed
const Section1 = dynamic(() => import('./Dashboard/section1'), {
  loading: () => <div className={pageStyles.loading}>Loading Dashboard...</div>,
});
const Section2 = dynamic(() => import('./Requests/section2'), {
  loading: () => <div className={pageStyles.loading}>Loading Requests...</div>,
});
const Section3 = dynamic(() => import('./Chats/section3'), {
  loading: () => <div className={pageStyles.loading}>Loading Chats...</div>,
});
const Section4 = dynamic(() => import('./Forum/section4'), {
  loading: () => <div className={pageStyles.loading}>Loading Forum...</div>,
});
const Section5 = dynamic(() => import('./Resources/section5'), {
  loading: () => <div className={pageStyles.loading}>Loading Resources...</div>,
});
const Sidebar = dynamic(() => import('./Sidebar/sidebar'), {
  loading: () => <div className={pageStyles.sidebarLoading}></div>,
});
const ScrollToTop = dynamic(() => import('./ScrollToTop/scroll-to-top'));

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
        return (
          <Suspense
            fallback={
              <div className={pageStyles.loading}>Loading Dashboard...</div>
            }
          >
            <Section1 key='dashboard' setActiveSection={setActiveSection} />
          </Suspense>
        );
      case 'messages':
        return (
          <Suspense
            fallback={
              <div className={pageStyles.loading}>Loading Messages...</div>
            }
          >
            <Section3 key='messages' />
          </Suspense>
        );
      case 'community':
        return (
          <Suspense
            fallback={
              <div className={pageStyles.loading}>Loading Community...</div>
            }
          >
            <Section4 key='community' />
          </Suspense>
        );
      case 'resources':
        return (
          <Suspense
            fallback={
              <div className={pageStyles.loading}>Loading Resources...</div>
            }
          >
            <Section5 key='resources' />
          </Suspense>
        );
      case 'requests':
        return (
          <Suspense
            fallback={
              <div className={pageStyles.loading}>Loading Requests...</div>
            }
          >
            <Section2 key='requests' />
          </Suspense>
        );
      default:
        return (
          <Suspense
            fallback={
              <div className={pageStyles.loading}>Loading Dashboard...</div>
            }
          >
            <Section1 key='dashboard' setActiveSection={setActiveSection} />
          </Suspense>
        );
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
      <Suspense fallback={<div className={pageStyles.sidebarLoading}></div>}>
        <Sidebar
          setActiveSection={setActiveSection}
          activeSection={activeSection}
          isExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          loading={false} // Don't block sidebar rendering on user loading
        />
      </Suspense>
      <main className={`${pageStyles.main} ${getMainContentClass()}`}>
        {renderSection()}
        {isClient && (
          <Suspense fallback={null}>
            <ScrollToTop selector='main' dependency={activeSection} />
          </Suspense>
        )}
      </main>
    </div>
  );
}
