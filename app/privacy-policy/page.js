import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const colors = {
  primaryLight: '#dbeafe',
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  secondary: '#ffa500',
  darkBg: '#1f2937',
  textDark: '#111827',
  textLight: '#f9fafb',
  textMuted: '#6b7280',
  textMutedLight: '#d1d5db',
};

export default function PrivacyPolicy() {
  const styles = {
    pageWrapper: {
      backgroundColor: colors.lightBg,
      color: colors.textDark,
    },
    header: {
      backgroundColor: colors.darkBg,
      color: colors.textLight,
      padding: '3rem 1rem',
      textAlign: 'center',
      borderBottom: `4px solid ${colors.primary}`,
    },
    contentWrapper: {
      maxWidth: '48rem',
      margin: '0 auto',
      padding: '3rem 1rem',
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      marginBottom: '1rem',
      color: 'white',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      marginBottom: '1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: `2px solid ${colors.primaryLight}`,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '1rem',
      marginTop: '1.5rem',
    },
    p: {
      marginBottom: '1rem',
      lineHeight: 1.7,
      color: colors.textMuted,
    },
    ul: {
      listStyle: 'disc',
      marginLeft: '1.5rem',
      marginBottom: '1rem',
    },
    li: {
      marginBottom: '0.5rem',
      color: colors.textMuted,
      lineHeight: 1.7,
    },
    footer: {
      backgroundColor: colors.darkBg,
      color: colors.textMutedLight,
      padding: '4rem 1rem 2rem',
      borderTop: `5px solid ${colors.primary}`,
    },
  };

  return (
    <div style={styles.pageWrapper}>
      <header style={styles.header}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <p
            style={{
              color: colors.primary,
              marginBottom: '0.5rem',
            }}
          >
            Legal
          </p>
          <h1 style={styles.h1}>Privacy Policy</h1>
        </div>
      </header>

      <main style={styles.contentWrapper}>
        <p style={{ ...styles.p, fontStyle: 'italic' }}>
          Last Updated: April 21, 2025
        </p>
        <p style={styles.p}>
          This Privacy Policy describes Our policies and procedures on the
          collection, use and disclosure of Your information when You use the
          Service and tells You about Your privacy rights and how the law
          protects You.
        </p>

        <h2 style={styles.h2}>Interpretation and Definitions</h2>
        <h3 style={styles.h3}>Interpretation</h3>
        <p style={styles.p}>
          The words of which the initial letter is capitalized have meanings
          defined under the following conditions. The following definitions
          shall have the same meaning regardless of whether they appear in
          singular or in plural.
        </p>
        <h3 style={styles.h3}>Definitions</h3>
        <p style={styles.p}>For the purposes of this Privacy Policy:</p>
        <ul style={styles.ul}>
          <li style={styles.li}>
            <strong>Account</strong> means a unique account created for You to
            access our Service or parts of our Service.
          </li>
          <li style={styles.li}>
            <strong>Company</strong> (referred to as either "the Company", "We",
            "Us" or "Our" in this Agreement) refers to AskBITSians, a platform
            connecting BITS Pilani students with alumni for mentorship and
            career guidance.
          </li>
          {/* ... other definitions ... */}
        </ul>

        <h2 style={styles.h2}>Contact Us</h2>
        <p style={styles.p}>
          If you have any questions about this Privacy Policy, You can contact
          us:
        </p>
        <ul style={styles.ul}>
          <li style={styles.li}>By email: academiccounsellingcell@gmail.com</li>
        </ul>
      </main>

      <footer style={styles.footer}>
        <div
          style={{
            maxWidth: '72rem',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              fontSize: '1.3rem',
              fontWeight: 600,
              marginBottom: '0.85rem',
              color: 'white',
            }}
          >
            Academic Counselling Cell
          </h3>
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: `1px solid ${colors.textMutedLight}33`,
              fontSize: '0.8rem',
            }}
          >
            © {new Date().getFullYear()} Academic Counselling Cell (ACC), BITS
            Pilani Hyderabad Campus. All Rights Reserved.
            <div style={{ marginTop: '1rem' }}>
              <Link
                href='/'
                style={{
                  color: colors.textMutedLight,
                  textDecoration: 'none',
                  margin: '0 0.5rem',
                }}
              >
                Home
              </Link>
              <Link
                href='/privacy-policy'
                style={{
                  color: colors.textMutedLight,
                  textDecoration: 'none',
                  margin: '0 0.5rem',
                }}
              >
                Privacy
              </Link>
              <Link
                href='/terms-of-service'
                style={{
                  color: colors.textMutedLight,
                  textDecoration: 'none',
                  margin: '0 0.5rem',
                }}
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
