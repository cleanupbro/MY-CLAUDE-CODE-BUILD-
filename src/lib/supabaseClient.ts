import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper to check if URL is valid
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Only create client if we have valid credentials
const hasValidCredentials = isValidUrl(supabaseUrl) &&
  supabaseAnonKey &&
  supabaseAnonKey.length > 20 &&
  !supabaseAnonKey.includes('your_supabase');

if (!hasValidCredentials) {
  console.warn('⚠️ Supabase not configured. Using localStorage fallback mode.');
  console.warn('📝 To enable Supabase: Update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

// Create Supabase client only with valid credentials
export const supabase = hasValidCredentials
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Database types
export interface Database {
  public: {
    Tables: {
      submissions: {
        Row: {
          id: string;
          created_at: string;
          type: string;
          status: string;
          data: any;
          summary: string | null;
          lead_score: number | null;
          lead_reasoning: string | null;
          admin_notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          type: string;
          status?: string;
          data: any;
          summary?: string | null;
          lead_score?: number | null;
          lead_reasoning?: string | null;
          admin_notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          type?: string;
          status?: string;
          data?: any;
          summary?: string | null;
          lead_score?: number | null;
          lead_reasoning?: string | null;
          admin_notes?: string | null;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};
