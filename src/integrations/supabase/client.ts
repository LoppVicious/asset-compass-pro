// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gkjmovzvpxfycyozzcmo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdram1vdnp2cHhmeWN5b3p6Y21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjcwMTAsImV4cCI6MjA2NjQ0MzAxMH0.97_kjdBEEheBJklIW7TiiJ9fTQuUlTAgUxNWt-meZuM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);