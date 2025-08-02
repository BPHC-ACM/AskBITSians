import { NextResponse } from 'next/server';

export async function GET() {
	const baseUrl = 'https://acc-bphc.netlify.app';

	const staticPages = ['/', '/terms-of-service', '/privacy-policy'];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
			.map((path) => {
				return `
            <url>
              <loc>${baseUrl}${path}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>${path === '/' ? 'weekly' : 'yearly'}</changefreq>
              <priority>${path === '/' ? '1.0' : '0.5'}</priority>
            </url>
          `;
			})
			.join('')}
    </urlset>`;

	return new NextResponse(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
		},
	});
}
