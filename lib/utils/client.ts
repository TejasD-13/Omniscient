import { createClient } from '@supabase/supabase-js'

// Import keys from .env and ensure they are set
const SUPABASE_URL = "https://wqelregwykvtvxtlpmvl.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZWxyZWd3eWt2dHZ4dGxwbXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2Mjg4ODAsImV4cCI6MjA1ODIwNDg4MH0.RjtVmlsG8XI5nn5lp5B7qeWd-9XhPp4aLdDb9Vv6ZOQ"
const SUPABASE_SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZWxyZWd3eWt2dHZ4dGxwbXZsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjYyODg4MCwiZXhwIjoyMDU4MjA0ODgwfQ.AHmVrKoKPVdAs4OLwnDTyyh0CAvMgR55ZOp-qLUon0w"

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE) {
  throw new Error('Missing necessary environment variables');
}

// Initialize Supabase clients
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const supabaseAdminRole = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

