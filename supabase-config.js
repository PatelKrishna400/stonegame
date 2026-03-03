// Supabase Configuration
const SUPABASE_URL = 'https://ymvzpswjzrqpwoenpkz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltdnpwc3dqenJxcHdvZW5wcGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDE5MTEsImV4cCI6MjA4ODExNzkxMX0.T0Gc6TSxuTbu7lrZiXdy3t05cQCqPfnXpMmAtKgIfu0';

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase };
