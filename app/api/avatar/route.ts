import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const name = searchParams.get('name');

	const cleanedName = name
		? name.replace(/\b(Prof\.|Dr\.)\s*/gi, '').trim()
		: '';

	const avatarUrl = cleanedName
		? `https://ui-avatars.com/api/?name=${encodeURIComponent(
				cleanedName
		  )}&background=cccccc&color=222222`
		: 'https://www.svgrepo.com/show/507442/user-circle.svg';

	try {
		const response = await fetch(avatarUrl);
		const buffer = await response.arrayBuffer();
		return new Response(Buffer.from(buffer), {
			headers: {
				'Content-Type': 'image/png',
			},
		});
	} catch (error) {
		console.error('Error fetching avatar:', error);
		return new Response('Error fetching avatar', { status: 500 });
	}
}
