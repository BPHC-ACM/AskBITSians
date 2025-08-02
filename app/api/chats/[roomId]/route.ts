import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(req, { params }) {
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
