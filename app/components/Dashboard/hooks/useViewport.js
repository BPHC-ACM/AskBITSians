// Hooks and utilities for viewport management
import { useState, useEffect } from 'react';

export const useViewport = () => {
  const [width, setWidth] = useState(1200); // Default to desktop width for SSR
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleWindowResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isClient]);

  return {
    width,
    isMobile: isClient ? width < 768 : false,
    isTablet: isClient ? width >= 768 && width < 1099 : false,
    isLaptop: isClient ? width >= 1099 && width < 1300 : true,
    isDesktop: isClient ? width >= 1300 : true,
    isClient,
  };
};

// BITS Pilani Official Color Scheme and styles
export const colors = {
  bitsBlue: '#85C5E8',
  bitsGold: '#FDC939',
  bitsRed: '#EA1425',
  primary: '#85C5E8',
  secondary: '#FDC939',
  tertiary: '#EA1425',
  dark: '#1a202c',
  light: '#f7fafc',
  gray: '#718096',
  lightGray: '#edf2f7',
  white: '#ffffff',
};

export const fontStyles = {
  primary:
    'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  secondary: 'Inter, sans-serif',
  monospace:
    '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Courier New", monospace',
};

export const getIconBgColor = (index) => {
  const bgColors = [colors.primary, colors.secondary, colors.tertiary];
  return bgColors[index % bgColors.length];
};
