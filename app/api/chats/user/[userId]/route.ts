import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(req: any, { params }: any) {
  const { userId } = await params;

  const { data, error } = await supabase
    .from('chats')
    .select(
      `
      roomid,
      alumnus_id,
      student_id,
      messages,
      created_at,
      students:student_id (name, identifier),
      alumni:alumnus_id (name, company)
    `
    )
    .or(`alumnus_id.eq.${userId},student_id.eq.${userId}`);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const roomsWithNames = data.map((room: any) => {
    const isAlumnus = room.alumnus_id === userId;
    return {
      roomid: room.roomid,
      alumnus_id: room.alumnus_id,
      student_id: room.student_id,
      name: isAlumnus
        ? room.students?.name || 'Unknown'
        : room.alumni?.name || 'Unknown',
      identifier: isAlumnus
        ? room.students?.identifier || ''
        : room.alumni?.company || '',
      messages: room.messages,
      created_at: room.created_at,
    };
  });

  return NextResponse.json({ rooms: roomsWithNames });
}
