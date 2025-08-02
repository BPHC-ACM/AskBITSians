import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const isServer = typeof window === 'undefined';

const supabaseKey = isServer
	? process.env.SUPABASE_SERVICE_ROLE_KEY
	: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
	throw new Error('Missing Supabase URL.');
}

if (!supabaseKey) {
	const errorMessage = isServer
		? 'Missing Supabase Service Role Key.'
		: 'Missing Supabase Anon Key.';
	throw new Error(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
