import { NextResponse } from 'next/server';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/utils/supabaseClient';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(to, subject, html) {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Nodemailer error:', error);
    return false;
  }
}

async function getUserEmail(userId, role) {
  const table = role === 'alumnus' ? 'alumni' : 'students';
  const { data, error } = await supabase
    .from(table)
    .select('email')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error(`Error fetching ${role} email for ID ${userId}:`, error);
    return null;
  }
  return data.email;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const alumnus_id = searchParams.get('alumnus_id');

  let query = supabase
    .from('requests')
    .select(
      `
      id,
      student_id,
      alumnus_id,
      subject,
      details,
      status,
      created_at,
      students (name, identifier, cgpa)
    `
    )
    .eq('status', 'pending');

  if (alumnus_id) {
    query = query.eq('alumnus_id', alumnus_id);
  }

  const { data, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const requestsWithRelativeTime = data.map((request) => {
    const createdAtDate = new Date(request.created_at);
    const student = request.students?.[0];

    return {
      ...request,
      relativeTime: formatDistanceToNow(createdAtDate, {
        addSuffix: true,
      }),

      name: student?.name,
      identifier: student?.identifier,
      cgpa: student?.cgpa,
    };
  });

  return NextResponse.json({
    requests: requestsWithRelativeTime,
    totalRequests: data.length,
  });
}

export async function POST(req) {
  try {
    const { student_id, alumnus_id, subject, details } = await req.json();

    if (!student_id || !alumnus_id || !subject || !details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('requests')
      .insert([
        {
          student_id,
          alumnus_id,
          subject,
          details,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const alumnusEmail = await getUserEmail(alumnus_id, 'alumnus');
    const { data: studentData } = await supabase
      .from('students')
      .select('name')
      .eq('id', student_id)
      .single();

    if (alumnusEmail) {
      const studentName = studentData?.name || 'A student';

      await sendEmail(
        alumnusEmail,
        'New Student Query - AskBITSians',
        `
        <h2>New Student Query</h2>
        <p>${studentName} has reached out to you through AskBITSians.</p>
        <h3>Subject: ${subject}</h3>
        <p><strong>Details:</strong> ${details}</p>
        <p>Please log in to AskBITSians to accept or decline this request and help a fellow BITSian!</p>
        `
      );
    }

    return NextResponse.json({
      message: 'Request created successfully',
      request: data,
    });
  } catch (err) {
    console.error('Error creating request:', err);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const { id, status, alumnus_id, student_id } = await req.json();

    if (!id || !['accepted', 'declined'].includes(status) || !alumnus_id) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { data: requestData, error: requestError } = await supabase
      .from('requests')
      .select('subject')
      .eq('id', id)
      .single();

    if (requestError) {
      console.error('Error fetching request details:', requestError);
    }

    const { error: updateError } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', id);

    if (updateError) throw updateError;

    let chatRoomId = null;
    if (status === 'accepted') {
      if (!student_id) {
        return NextResponse.json(
          { error: 'Student ID is missing' },
          { status: 400 }
        );
      }

      const { data: existingRoom } = await supabase
        .from('chats')
        .select('roomid')
        .eq('alumnus_id', alumnus_id)
        .eq('student_id', student_id)
        .maybeSingle();

      if (!existingRoom) {
        const { data: newChatRoom, error: chatRoomError } = await supabase
          .from('chats')
          .insert({ alumnus_id, student_id, messages: [] })
          .select('roomid')
          .single();

        if (chatRoomError) throw chatRoomError;
        chatRoomId = newChatRoom.roomid;
      } else {
        chatRoomId = existingRoom.roomid;
      }
    }

    const studentEmail = await getUserEmail(student_id, 'student');
    const { data: alumnusData } = await supabase
      .from('alumni')
      .select('name')
      .eq('id', alumnus_id)
      .single();

    if (studentEmail && alumnusData) {
      const alumnusName = alumnusData.name || 'The alumnus';
      const subject = requestData?.subject || 'your mentorship request';

      const emailSubject = `Your Query was ${
        status.charAt(0).toUpperCase() + status.slice(1)
      } - AskBITSians`;
      const emailHtml =
        status === 'accepted'
          ? `
          <h2>Query Accepted</h2>
          <p>${alumnusName} has <strong>accepted</strong> your query about "${subject}".</p>
          <p>You can now chat with them through the messaging system on AskBITSians.</p>
          <p>Log in to start your conversation and get the guidance you need!</p>
          `
          : `
          <h2>Query Declined</h2>
          <p>${alumnusName} has <strong>declined</strong> your query about "${subject}".</p>
          <p>Don't worry! You can try reaching out to other alumni or post your question in the community forum.</p>
          `;

      await sendEmail(studentEmail, emailSubject, emailHtml);
    }

    return NextResponse.json({
      message: `Request ${id} updated to ${status}`,
      chatRoomId: status === 'accepted' ? chatRoomId : null,
    });
  } catch (err) {
    console.error('Unexpected error in PATCH:', err);
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
