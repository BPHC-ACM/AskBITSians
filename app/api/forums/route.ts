import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

// Fetch all forum posts with replies
export async function GET() {
  try {
    const { data: postsData, error: postsError } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError) throw postsError;

    const { data: repliesData, error: repliesError } = await supabase
      .from('forum_replies')
      .select('*');

    if (repliesError) throw repliesError;

    const mappedPosts = postsData.map((post) => ({
      ...post,
      answers: repliesData.filter((reply) => reply.post_id === post.id),
    }));

    return NextResponse.json({ success: true, data: mappedPosts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Post a new forum post
export async function POST(req: Request) {
  try {
    const { title, query, tags, id, name, identifier } = await req.json();

    if (!title.trim() || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title and query are required.' },
        { status: 400 }
      );
    }

    const newPost = {
      id: crypto.randomUUID(),
      name: name,
      title,
      query,
      tags: tags.map((tag: string) => tag.trim()),
      created_at: new Date().toISOString(),
      identifier,
    };

    const { error } = await supabase.from('forum_posts').insert([newPost]);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Post a new reply
export async function PATCH(req: Request) {
  try {
    const { post_id, answer, name, identifier } = await req.json(); // Changed from query_id to post_id

    if (!answer.trim()) {
      return NextResponse.json(
        { success: false, error: 'Reply text is required.' },
        { status: 400 }
      );
    }

    const newReply = {
      post_id: post_id, // Updated field name
      name,
      identifier,
      answer,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase.from('forum_replies').insert([newReply]);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
