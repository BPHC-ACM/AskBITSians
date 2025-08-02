import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: {
    default: 'AskBITSians | Connect with BITS Alumni & Mentors',
    template: '%s | AskBITSians',
  },

  description:
    'Connect with well-placed BITS Pilani alumni and experienced mentors for career guidance, academic support, and professional mentorship. Join our vibrant community platform for 1:1 chats and forums.',

  keywords: [
    'BITS Pilani',
    'Alumni Network',
    'Mentorship Platform',
    'Career Guidance',
    'BITSians',
    'Community Forum',
    'Professional Networking',
    'Academic Support',
    'Alumni Mentors',
  ],

  openGraph: {
    title: 'AskBITSians | Connect with BITS Alumni & Mentors',
    description:
      'Connect with successful BITS alumni and experienced mentors for career guidance and professional growth.',
    url: 'https://askbitsians.netlify.app',
    siteName: 'AskBITSians',
    images: [
      {
        url: 'https://askbitsians.netlify.app/askbitsians-logo.png',
        width: 512,
        height: 512,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary',
    title: 'AskBITSians | Connect with BITS Alumni & Mentors',
    description:
      'Connect with successful BITS alumni and experienced mentors for career guidance and professional growth.',
    images: ['https://askbitsians.netlify.app/askbitsians-logo.png'],
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
    <html lang='en'>
      <head>
        <link
          href='https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap'
          rel='stylesheet'
        />
        <title>AskBITSians | Connect with Alumni & Mentors</title>
        <link
          rel='icon'
          type='image/x-icon'
          href='/askbitsians-small-icon.ico'
        />
        <link rel='icon' type='image/x-icon' href='/askbitsians-icon.ico' />
        <link rel='icon' type='image/png' href='/askbitsians-icon.png' />
        <meta
          name='google-site-verification'
          content='KDTHyNvfLy_eV1Ci1GoZfGVSrAbZh-7U3C8kYDPAYxc'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='AskBITSians | Connect with Alumni & Mentors for Career Guidance'
        />
        <meta
          name='keywords'
          content='AskBITSians, BITS Alumni, Mentorship Platform, Career Guidance'
        />
        <meta name='author' content='AskBITSians Team' />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
