import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zivdfypkmalrlgojdlmy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppdmRmeXBrbWFscmxnb2pkbG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNDkzNzksImV4cCI6MjEwNTgyNTM3OX0.0we8qj9_F9kQNy3t53ogL77iVe2QAHh3KCVky_cHAf8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
