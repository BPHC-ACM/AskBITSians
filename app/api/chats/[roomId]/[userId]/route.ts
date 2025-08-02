import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request: NextRequest, { params }) {
  const { roomId, userId } = await params;

  // Fetch alumnus_id and student_id based on roomId
  const { data, error } = await supabase
    .from('chats')
    .select('alumnus_id, student_id')
    .eq('roomid', roomId)
    .single();

  if (error || !data) {
    console.error('Supabase Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Room not found' },
      { status: 500 }
    );
  }

  const { alumnus_id, student_id } = data;

  // Determine the role of the user and get the opposite party's details
  const isAlumnus = userId === alumnus_id;
  const targetId = isAlumnus ? student_id : alumnus_id;
  const targetTable = isAlumnus ? 'students' : 'alumni';
  const targetColumn = isAlumnus ? 'name, identifier' : 'name, company';

  // Fetch details of the opposite participant
  const { data: targetData, error: targetError } = await supabase
    .from(targetTable)
    .select(targetColumn)
    .eq('id', targetId)
    .single();

  if (targetError || !targetData) {
    console.error('Supabase Error:', targetError);
    return NextResponse.json(
      { error: targetError?.message || 'User not found' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    userName: targetData.name,
    info:
      'identifier' in targetData ? targetData.identifier : targetData.company,
  });
}
