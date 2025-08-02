import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

import { saveMessage } from '../../../../utils/db';
import type { Message } from '../../../../utils/types';

export async function POST(req: Request, { params }) {
	try {
		const body = await req.json();
		if (!body.id || !body.content) {
			return NextResponse.json(
				{ error: 'Missing fields' },
				{ status: 400 }
			);
		}

		const { roomId } = await params;

		const message: Message = {
			roomid: roomId,
			id: body.id,
			content: body.content,
			timestamp: new Date().toISOString(),
		};

		await saveMessage(message);

		return NextResponse.json({ message, status: 'success' });
	} catch (err: any) {
		console.error('Unexpected Error:', err); // Log unexpected errors
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function GET(req: Request, { params }) {
	const { roomId } = await params;

	const { data, error } = await supabase
		.from('chats')
		.select('messages')
		.eq('roomid', roomId)
		.single();

	if (error) {
		console.error('Supabase Error:', error);
		return NextResponse.json({ messages: [] }, { status: 200 });
	}

	return NextResponse.json({ messages: data ? data.messages : [] });
}
