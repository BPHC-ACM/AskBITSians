import { Providers } from './providers';
import './globals.css';

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
    <html lang='en'>
      <head>
        {/* Preconnect to third-party origins for performance */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''
        />
        <link rel='preconnect' href='https://img.icons8.com' />

        {/* Preload critical font - only essential weights */}
        <link
          rel='preload'
          href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap'
          as='style'
          crossOrigin=''
        />

        {/* Load fonts optimally with font-display: swap */}
        <link
          href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap'
          rel='stylesheet'
          media='print'
          onLoad='this.media="all"'
        />
        <noscript>
          <link
            href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap'
            rel='stylesheet'
          />
        </noscript>

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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
