import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET() {
  try {
    const { data: alumni, error } = await supabase
      .from('alumni')
      .select('areas_of_expertise, company');

    if (error) throw error;

    const expertise = new Set();
    const companies = new Set();

    alumni.forEach((alumnus) => {
      if (alumnus.areas_of_expertise) {
        alumnus.areas_of_expertise.forEach((area) => expertise.add(area));
      }
      if (alumnus.company) {
        companies.add(alumnus.company);
      }
    });

    return NextResponse.json({
      expertise: Array.from(expertise).sort(),
      companies: Array.from(companies).sort(),
    });
  } catch (error) {
    console.error('Error fetching expertise areas and companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expertise areas and companies' },
      { status: 500 }
    );
  }
}
