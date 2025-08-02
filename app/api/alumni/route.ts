import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // For fetching specific alumni
  const domain = searchParams.get('domain'); // Changed from expertise
  const company = searchParams.get('company');
  const role = searchParams.get('role'); // New parameter for job roles
  const graduationYear = searchParams.get('graduation_year');

  try {
    let query = supabase.from('alumni').select('*');

    // If ID is specified, fetch specific alumni
    if (id) {
      query = query.eq('id', id);
    }

    if (domain) {
      query = query.contains('areas_of_expertise', [domain]);
    }

    if (company) {
      query = query.ilike('company', `%${company}%`);
    }

    if (role) {
      query = query.ilike('job_title', `%${role}%`);
    }

    if (graduationYear) {
      query = query.eq('graduation_year', parseInt(graduationYear));
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
      job_title,
      graduation_year,
      linkedin_profile_url,
      areas_of_expertise,
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
          job_title,
          graduation_year,
          linkedin_profile_url,
          areas_of_expertise: areas_of_expertise || [],
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
      job_title,
      graduation_year,
      linkedin_profile_url,
      areas_of_expertise,
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
    if (job_title) updateData.job_title = job_title;
    if (graduation_year) updateData.graduation_year = graduation_year;
    if (linkedin_profile_url)
      updateData.linkedin_profile_url = linkedin_profile_url;
    if (areas_of_expertise) updateData.areas_of_expertise = areas_of_expertise;

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
