/** @type {import('next').NextConfig} */
const nextConfig = {
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
	},
};

export default nextConfig;
