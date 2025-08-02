import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(req: Request) {
	try {
		const { email, name } = await req.json();

		if (!email || !name) {
			return NextResponse.json(
				{ error: 'Email and name are required' },
				{ status: 400 }
			);
		}

		const { data: studentExists } = await supabase
			.from('students')
			.select('id, identifier')
			.eq('email', email)
			.maybeSingle();

		if (studentExists) {
			return NextResponse.json(studentExists);
		}

		const identifier = `20XXXXH`;
		const { data: newStudent, error: insertError } = await supabase
			.from('students')
			.insert({ email, name, identifier })
			.select('id, identifier')
			.single();

		if (insertError) throw insertError;

		return NextResponse.json(newStudent);
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
