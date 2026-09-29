import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

let savedUrl = localStorage.getItem('supabase_url');
let savedKey = localStorage.getItem('supabase_anon_key');

const fallbackUrl = 'https://fnpjbrhhuhajgekrofzj.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZucGpicmhodWhhamdla3JvZnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjQ0NDksImV4cCI6MjEwNTgwMDQ0OX0.K6aE0Eol_k6jRi4HUKWshZfRmLjrvbWnm9lZMa60Bzg';

const supabaseUrl = envUrl || savedUrl || fallbackUrl;
const supabaseAnonKey = envKey || savedKey || fallbackKey;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;



