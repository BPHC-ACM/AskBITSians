import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const expertise = searchParams.get('expertise');
  const company = searchParams.get('company');

  try {
    let query = supabase.from('alumni').select('*');

    if (expertise) {
      query = query.contains('areas_of_expertise', [expertise]);
    }

    if (company) {
      query = query.ilike('company', `%${company}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching alumni:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alumni' },
      { status: 500 }
    );
  }
}
