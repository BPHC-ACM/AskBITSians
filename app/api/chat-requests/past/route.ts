import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { formatDistanceToNow } from 'date-fns';

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const consultantId = searchParams.get('consultant_id');

	if (!consultantId) {
		return NextResponse.json(
			{ error: 'Missing consultant_id' },
			{ status: 400 }
		);
	}

	const { data, error } = await supabase
		.from('requests')
		.select(
			`
        id,
        student_id,
        consultant_id,
        subject,
        details,
        status,
        created_at,
        students (name, identifier, cgpa)
        `
		)
		.eq('consultant_id', consultantId)
		.in('status', ['accepted', 'declined']);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	const requestsWithRelativeTime = data.map((request) => {
		const createdAtDate = new Date(request.created_at);

		return {
			...request,
			relativeTime: formatDistanceToNow(createdAtDate, {
				addSuffix: true,
			}),

			name: request.students?.[0]?.name,
			identifier: request.students?.[0]?.identifier,
			cgpa: request.students?.[0]?.cgpa,
		};
	});

	return NextResponse.json({
		requests: requestsWithRelativeTime,
		totalRequests: data.length,
	});
}
