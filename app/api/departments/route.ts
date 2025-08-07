import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET() {
  try {
    // Query the database to get all distinct roles and domains from the alumni table
    const { data: alumni, error } = await supabase
      .from('alumni')
      .select('role, domain');

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Extract unique roles and domains
    const rolesSet = new Set<string>();
    const domainsSet = new Set<string>();

    alumni.forEach((alumnus) => {
      if (alumnus.role) {
        rolesSet.add(alumnus.role);
      }
      if (alumnus.domain) {
        domainsSet.add(alumnus.domain);
      }
    });

    const domains = Array.from(domainsSet).sort();
    const roles = Array.from(rolesSet).sort();

    return NextResponse.json({
      domains,
      roles,
    });
  } catch (error) {
    console.error('Error fetching domains and roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alumni categories' },
      { status: 500 }
    );
  }
}
