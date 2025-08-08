import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract query parameters
  const search = searchParams.get('search');
  const role = searchParams.get('role');
  const domain = searchParams.get('domain');
  const company = searchParams.get('company');
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  try {
    // Build the base query
    let query = supabase
      .from('alumni')
      .select(
        'id, name, company, role, domain, graduation_year, linkedin_profile_url'
      );

    // Apply filters
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (domain && domain !== 'all') {
      query = query.eq('domain', domain);
    }

    if (company && company !== 'all') {
      query = query.eq('company', company);
    }

    // Apply search filter
    if (search) {
      // Use a proper filter that works with Supabase
      query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%`);
    }

    // Apply sorting
    const ascending = sortOrder === 'asc';
    switch (sortBy) {
      case 'graduation_year':
        query = query.order('graduation_year', {
          ascending,
          nullsFirst: false,
        });
        break;
      case 'company':
        query = query.order('company', { ascending, nullsFirst: false });
        break;
      case 'name':
      default:
        query = query.order('name', { ascending });
        break;
    }

    const { data: alumni, error } = await query;

    if (error) {
      console.error('Error fetching alumni:', error);
      throw error;
    }

    // Get all available filter options
    const { data: allAlumni, error: filterError } = await supabase
      .from('alumni')
      .select('role, domain, company');

    if (filterError) {
      console.error('Error fetching filter options:', filterError);
      throw filterError;
    }

    // Build filter options
    const roles = new Set<string>();
    const domains = new Set<string>();
    const companies = new Set<string>();

    allAlumni.forEach((alumnus) => {
      if (alumnus.role) roles.add(alumnus.role);
      if (alumnus.domain) domains.add(alumnus.domain);
      if (alumnus.company) companies.add(alumnus.company);
    });

    const filters = {
      roles: Array.from(roles).sort(),
      domains: Array.from(domains).sort(),
      companies: Array.from(companies).sort(),
    };

    return NextResponse.json({
      alumni: alumni || [],
      filters,
      total: alumni?.length || 0,
      applied_filters: {
        search,
        role: role === 'all' ? null : role,
        domain: domain === 'all' ? null : domain,
        company: company === 'all' ? null : company,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error('Error in alumni showcase API:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch alumni showcase data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
