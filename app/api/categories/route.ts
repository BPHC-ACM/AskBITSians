import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

// Get all available categories for filtering alumni
export async function GET() {
  try {
    const { data: alumni, error } = await supabase
      .from('alumni')
      .select('areas_of_expertise, company, job_title, graduation_year');

    if (error) throw error;

    const domains = new Set();
    const companies = new Set();
    const roles = new Set();
    const years = new Set();

    alumni.forEach((alumnus) => {
      if (alumnus.areas_of_expertise) {
        alumnus.areas_of_expertise.forEach((area) => domains.add(area));
      }
      if (alumnus.company) {
        companies.add(alumnus.company);
      }
      if (alumnus.job_title) {
        roles.add(alumnus.job_title);
      }
      if (alumnus.graduation_year) {
        years.add(alumnus.graduation_year);
      }
    });

    return NextResponse.json({
      domains: Array.from(domains).sort(),
      companies: Array.from(companies).sort(),
      roles: Array.from(roles).sort(),
      graduationYears: Array.from(years).sort((a: any, b: any) => b - a), // Sort years descending
    });
  } catch (error) {
    console.error('Error fetching alumni categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alumni categories' },
      { status: 500 }
    );
  }
}
