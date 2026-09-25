import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fnpjbrhhuhajgekrofzj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZucGpicmhodWhhamdla3JvZnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjQ0NDksImV4cCI6MjEwNTgwMDQ0OX0.K6aE0Eol_k6jRi4HUKWshZfRmLjrvbWnm9lZMa60Bzg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
