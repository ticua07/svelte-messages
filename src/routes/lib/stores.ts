import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const sp = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON,
	{
		global: {
			fetch: fetch
		}
	}
);

export interface Message {
	id: number;
	title: string;
	message: string;
	created_at: Date;
}
