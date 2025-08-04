'use client';
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useUser } from '@/context/userContext';
import dynamic from 'next/dynamic';
import pageStyles from '../page.module.css';
import Section1 from './Dashboard/section1';
import Section2 from './Requests/section2';
import Section3 from './Chats/section3';
import Section4 from './Forum/section4';
import Section5 from './Resources/section5';
import Sidebar from './Sidebar/sidebar';
import ScrollToTop from './ScrollToTop/scroll-to-top';
import { profileIncomplete } from './common/notification-service';

export default function HomeContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(true); // Default to mobile to prevent flash
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Always start collapsed
  const [isClient, setIsClient] = useState(false);
  const { user, loading, isNewAlumni } = useUser();
  const sidebarRef = useRef(null);
  const hasShownNotification = useRef(false);

  // Handle client-side hydration and set initial states
  useEffect(() => {
    setIsClient(true);

    // Set initial states immediately to prevent flash
    const isMobileView = window.innerWidth <= 768;
    setIsMobile(isMobileView);
    // Only expand sidebar if it's desktop AND we haven't set it already
    if (!isMobileView) {
      setIsSidebarExpanded(true);
    }
    // On mobile, keep it collapsed (already false from initial state)
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

  // Show profile incomplete notification for newly registered alumni
  useEffect(() => {
    if (
      isClient &&
      !loading &&
      user &&
      user.role === 'alumnus' &&
      isNewAlumni &&
      !hasShownNotification.current
    ) {
      hasShownNotification.current = true;

      // Show notification with action to open profile update modal
      profileIncomplete(() => {
        // Trigger the sidebar to open the alumni profile update modal
        if (sidebarRef.current && sidebarRef.current.openUpdateModal) {
          sidebarRef.current.openUpdateModal();
        }
      });
    }
  }, [isClient, loading, user, isNewAlumni]);

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
          ref={sidebarRef}
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
