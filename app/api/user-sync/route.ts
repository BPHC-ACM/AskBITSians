import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(req: Request) {
  try {
    const { email, name, role } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Default to student if no role specified
    const userRole = role || 'student';

    if (userRole === 'student') {
      // Check if student exists
      const { data: studentExists } = await supabase
        .from('students')
        .select('id, identifier')
        .eq('email', email)
        .maybeSingle();

      if (studentExists) {
        return NextResponse.json({ ...studentExists, role: 'student' });
      }

      // Create new student
      const identifier = `20XXXXH`;
      const { data: newStudent, error: insertError } = await supabase
        .from('students')
        .insert({ email, name, identifier })
        .select('id, identifier')
        .single();

      if (insertError) throw insertError;

      return NextResponse.json({ ...newStudent, role: 'student' });
    } else if (userRole === 'alumnus') {
      // Check if alumnus exists
      const { data: alumnusExists } = await supabase
        .from('alumni')
        .select('id, company, job_title')
        .eq('email', email)
        .maybeSingle();

      if (alumnusExists) {
        return NextResponse.json({ ...alumnusExists, role: 'alumnus' });
      }

      // Create new alumnus
      const { data: newAlumnus, error: insertError } = await supabase
        .from('alumni')
        .insert({ email, name })
        .select('id, company, job_title')
        .single();

      if (insertError) throw insertError;

      return NextResponse.json({ ...newAlumnus, role: 'alumnus' });
    } else {
      return NextResponse.json(
        { error: 'Invalid role. Must be either "student" or "alumnus"' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('User sync error:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync user data',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
