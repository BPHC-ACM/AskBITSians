import { Poppins } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
  preload: true, // Ensure font is preloaded
});

export const metadata = {
  title: {
    default: 'AskBITSians | Connect with BITS Alumni',
    template: '%s | AskBITSians',
  },

  description:
    'Connect with well-placed BITS Pilani alumni for career guidance, academic support, and professional networking. Join our vibrant community platform for 1:1 chats and forums.',

  keywords: [
    'BITS Pilani',
    'Alumni Network',
    'Career Platform',
    'Career Guidance',
    'BITSians',
    'Community Forum',
    'Professional Networking',
    'Academic Support',
    'Alumni Network',
  ],

  openGraph: {
    title: 'AskBITSians | Connect with BITS Alumni ',
    description:
      'Connect with successful BITS alumni for career guidance and professional growth.',
    url: 'https://askbitsians.acmbphc.in',
    siteName: 'AskBITSians',
    images: [
      {
        url: 'https://askbitsians.acmbphc.in/askbitsians-og.png',
        width: 512,
        height: 512,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary',
    title: 'AskBITSians | Connect with BITS Alumni ',
    description:
      'Connect with successful BITS alumni for career guidance and professional growth.',
    images: ['https://askbitsians.acmbphc.in/askbitsians-og.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={poppins.variable}>
      <head>
        {/* Preconnect to third-party origins for performance */}
        <link rel='preconnect' href='https://img.icons8.com' />

        {/* Icons */}
        <link rel='icon' type='image/x-icon' href='/askbitsians-icon.ico' />
        <link rel='icon' type='image/png' href='/askbitsians-icon.png' />
        <meta
          name='google-site-verification'
          content='KDTHyNvfLy_eV1Ci1GoZfGVSrAbZh-7U3C8kYDPAYxc'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='AskBITSians | Connect with Alumni  for Career Guidance'
        />
        <meta
          name='keywords'
          content='AskBITSians, BITS Alumni, Career Platform, Career Guidance'
        />
        <meta name='author' content='ACM BPHC' />
      </head>
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
