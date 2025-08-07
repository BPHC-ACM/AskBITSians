import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

// Simple in-memory cache to reduce database calls
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function POST(req: Request) {
  try {
    const { email, name, role } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `${email}-${role}`;
    const cached = userCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Default to student if no role specified
    const userRole = role || 'student';

    let result;

    if (userRole === 'student') {
      result = await handleStudentSync(email, name);
    } else if (userRole === 'alumnus') {
      result = await handleAlumnusSync(email, name);
    } else {
      return NextResponse.json(
        { error: 'Invalid role. Must be either "student" or "alumnus"' },
        { status: 400 }
      );
    }

    // Cache the result
    userCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    // Clean up old cache entries periodically
    if (userCache.size > 1000) {
      const now = Date.now();
      for (const [key, value] of userCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          userCache.delete(key);
        }
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('User sync error:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync user data',
        details:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

async function handleStudentSync(email: string, name: string) {
  // Check if student exists
  const { data: studentExists } = await supabase
    .from('students')
    .select('id, identifier')
    .eq('email', email)
    .maybeSingle();

  if (studentExists) {
    return { ...studentExists, role: 'student' };
  }

  // Create new student with proper identifier generation
  const identifier = generateStudentIdentifier(name, email);
  const { data: newStudent, error: insertError } = await supabase
    .from('students')
    .insert({ email, name, identifier })
    .select('id, identifier')
    .single();

  if (insertError) throw insertError;

  return { ...newStudent, role: 'student' };
}

async function handleAlumnusSync(email: string, name: string) {
  // Check if alumnus exists
  const { data: alumnusExists } = await supabase
    .from('alumni')
    .select('id, company, role, domain')
    .eq('email', email)
    .maybeSingle();

  if (alumnusExists) {
    return {
      ...alumnusExists,
      role: 'alumnus',
      isNewUser: false,
    };
  }

  // Create new alumnus
  const { data: newAlumnus, error: insertError } = await supabase
    .from('alumni')
    .insert({ email, name })
    .select('id, company, role, domain')
    .single();

  if (insertError) throw insertError;

  return {
    ...newAlumnus,
    role: 'alumnus',
    isNewUser: true,
  };
}

function generateStudentIdentifier(name: string, email: string): string {
  // Extract year from email if possible, otherwise use placeholder
  const emailMatch = email.match(/f(\d{4})/);
  if (emailMatch) {
    return `20${emailMatch[1].slice(-2)}XXXH`;
  }

  // Fallback to generic format
  return '20XXXXH';
}
