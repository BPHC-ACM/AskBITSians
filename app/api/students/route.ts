import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function PATCH(req: Request) {
	if (!supabase) {
		return NextResponse.json(
			{
				error: 'Supabase client not initialized. Check environment variables.',
			},
			{ status: 500 }
		);
	}

	try {
		const { studentid, branch, cgpa, batch } = await req.json();

		if (
			!studentid ||
			!branch ||
			cgpa === undefined ||
			cgpa === null ||
			!batch
		) {
			return NextResponse.json(
				{
					error: 'Missing required fields: studentid, branch, cgpa, batch',
				},
				{ status: 400 }
			);
		}

		if (typeof cgpa !== 'number') {
			try {
				const parsedCgpa = parseFloat(cgpa);
				if (isNaN(parsedCgpa)) {
					return NextResponse.json(
						{ error: 'Invalid CGPA format. Must be a number.' },
						{ status: 400 }
					);
				}
			} catch (e) {
				return NextResponse.json(
					{ error: 'Invalid CGPA format.' },
					{ status: 400 }
				);
			}
		}

		const identifier = `${batch}${branch}H`;

		const { data, error } = await supabase
			.from('students')
			.update({
				branch: branch,
				cgpa: parseFloat(cgpa.toString()),
				identifier: identifier,
			})
			.eq('id', studentid)
			.select()
			.single();

		if (error) {
			console.error('Supabase update error:', error);

			if (error.code === 'PGRST116') {
				return NextResponse.json(
					{ error: `Student with id ${studentid} not found.` },
					{ status: 404 }
				);
			}
			return NextResponse.json(
				{
					error: 'Failed to update student data',
					details: error.message,
				},
				{ status: 500 }
			);
		}
		return NextResponse.json({
			message: 'Student data updated successfully',
			updatedStudent: data,
		});
	} catch (err: any) {
		console.error('Error processing PATCH request:', err);
		if (err instanceof SyntaxError) {
			return NextResponse.json(
				{ error: 'Invalid JSON format in request body' },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{
				error: 'An unexpected error occurred',
				details: err.message || String(err),
			},
			{ status: 500 }
		);
	}
}
