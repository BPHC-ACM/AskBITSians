/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'sonner',
      '@tabler/icons-react',
      'lucide-react',
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['ui-avatars.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: `
		default-src 'self';
		img-src * data: blob:;
		script-src 'self' 'unsafe-eval' 'unsafe-inline';
		sandbox;
	  `,
    // Add image optimization
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
  poweredByHeader: false,
  compress: true,
  // Enable React strict mode for better performance insights
  reactStrictMode: true,
};

export default nextConfig;
