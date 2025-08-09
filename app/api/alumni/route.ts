import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // For fetching specific alumni
  const domain = searchParams.get('domain');
  const role = searchParams.get('role');
  const type = searchParams.get('type'); // For filtering by type

  try {
    let query = supabase.from('alumni').select('*');

    // If ID is specified, fetch specific alumni
    if (id) {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return NextResponse.json(data);
    }

    if (domain) {
      query = query.eq('domain', domain);
    }

    if (role) {
      query = query.eq('role', role);
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

// Create or update alumni profile
export async function POST(request) {
  try {
    const {
      name,
      email,
      company,
      role,
      domain,
      graduation_year,
      linkedin_profile_url,
    } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('alumni')
      .insert([
        {
          name,
          email,
          company,
          role,
          domain,
          graduation_year,
          linkedin_profile_url,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Alumni profile created successfully',
      alumni: data,
    });
  } catch (error) {
    console.error('Error creating alumni profile:', error);
    return NextResponse.json(
      { error: 'Failed to create alumni profile' },
      { status: 500 }
    );
  }
}

// Update alumni profile
export async function PATCH(request) {
  try {
    const {
      id,
      name,
      company,
      role,
      domain,
      graduation_year,
      linkedin_profile_url,
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Alumni ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (company) updateData.company = company;
    if (role) updateData.role = role;
    if (domain) updateData.domain = domain;
    if (graduation_year) updateData.graduation_year = graduation_year;
    if (linkedin_profile_url)
      updateData.linkedin_profile_url = linkedin_profile_url;

    const { data, error } = await supabase
      .from('alumni')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Alumni profile updated successfully',
      alumni: data,
    });
  } catch (error) {
    console.error('Error updating alumni profile:', error);
    return NextResponse.json(
      { error: 'Failed to update alumni profile' },
      { status: 500 }
    );
  }
}
