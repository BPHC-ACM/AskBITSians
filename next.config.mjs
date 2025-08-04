/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'sonner',
      '@tabler/icons-react',
      'lucide-react',
    ],
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['ui-avatars.com', 'img.icons8.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
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
    loader: 'default',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  poweredByHeader: false,
  compress: true,
  // Enable React strict mode for better performance insights
  reactStrictMode: true,
  // Enable SWC minification for better performance
  swcMinify: true,
};

export default nextConfig;
