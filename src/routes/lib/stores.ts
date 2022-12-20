import { writable, type Writable } from 'svelte/store';
import { createClient } from '@supabase/supabase-js';

import * as dotenv from 'dotenv';
dotenv.config();

// Create a single supabase client for interacting with your database
export const sp = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON || '');

interface Message {
	id: number;
	title: string;
	message: string;
	created_at: Date;
}

export const messages: Writable<Message> = writable();
