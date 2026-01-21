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

// Database types - Clean Up Bros Full Schema (January 2026)
export interface Database {
  public: {
    Tables: {
      // Existing: Quote submissions
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

      // Existing: Admin users
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

      // NEW: Customers (CRM)
      customers: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          suburb: string | null;
          notes: string | null;
          total_bookings: number;
          total_spent: number;
          last_service_date: string | null;
          preferred_cleaner: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          suburb?: string | null;
          notes?: string | null;
          total_bookings?: number;
          total_spent?: number;
          last_service_date?: string | null;
          preferred_cleaner?: string | null;
        };
        Update: {
          full_name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          suburb?: string | null;
          notes?: string | null;
          total_bookings?: number;
          total_spent?: number;
          last_service_date?: string | null;
          preferred_cleaner?: string | null;
        };
      };

      // NEW: Team members (Staff/Cleaners)
      team_members: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          email: string | null;
          phone: string;
          role: 'cleaner' | 'supervisor' | 'admin';
          status: 'active' | 'inactive' | 'on_leave';
          hourly_rate: number | null;
          skills: string[];
          availability: Record<string, string[]> | null;
          photo_url: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name: string;
          email?: string | null;
          phone: string;
          role?: 'cleaner' | 'supervisor' | 'admin';
          status?: 'active' | 'inactive' | 'on_leave';
          hourly_rate?: number | null;
          skills?: string[];
          availability?: Record<string, string[]> | null;
          photo_url?: string | null;
          notes?: string | null;
        };
        Update: {
          full_name?: string;
          email?: string | null;
          phone?: string;
          role?: 'cleaner' | 'supervisor' | 'admin';
          status?: 'active' | 'inactive' | 'on_leave';
          hourly_rate?: number | null;
          skills?: string[];
          availability?: Record<string, string[]> | null;
          photo_url?: string | null;
          notes?: string | null;
        };
      };

      // NEW: Bookings (Scheduled Jobs)
      bookings: {
        Row: {
          id: string;
          created_at: string;
          submission_id: string | null;
          customer_id: string | null;
          booking_date: string;
          start_time: string | null;
          end_time: string | null;
          service_type: string;
          address: string;
          suburb: string | null;
          bedrooms: number | null;
          bathrooms: number | null;
          add_ons: string[];
          special_instructions: string | null;
          assigned_to: string | null;
          assigned_team: string[];
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
          quoted_price: number | null;
          final_price: number | null;
          deposit_amount: number | null;
          deposit_paid: boolean;
          completed_at: string | null;
          completion_notes: string | null;
          photos_before: string[];
          photos_after: string[];
          customer_signature: string | null;
          payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
          payment_method: string | null;
          invoice_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          submission_id?: string | null;
          customer_id?: string | null;
          booking_date: string;
          start_time?: string | null;
          end_time?: string | null;
          service_type: string;
          address: string;
          suburb?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          add_ons?: string[];
          special_instructions?: string | null;
          assigned_to?: string | null;
          assigned_team?: string[];
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
          quoted_price?: number | null;
          final_price?: number | null;
          deposit_amount?: number | null;
          deposit_paid?: boolean;
          completed_at?: string | null;
          completion_notes?: string | null;
          photos_before?: string[];
          photos_after?: string[];
          customer_signature?: string | null;
          payment_status?: 'pending' | 'partial' | 'paid' | 'refunded';
          payment_method?: string | null;
          invoice_id?: string | null;
        };
        Update: {
          submission_id?: string | null;
          customer_id?: string | null;
          booking_date?: string;
          start_time?: string | null;
          end_time?: string | null;
          service_type?: string;
          address?: string;
          suburb?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          add_ons?: string[];
          special_instructions?: string | null;
          assigned_to?: string | null;
          assigned_team?: string[];
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
          quoted_price?: number | null;
          final_price?: number | null;
          deposit_amount?: number | null;
          deposit_paid?: boolean;
          completed_at?: string | null;
          completion_notes?: string | null;
          photos_before?: string[];
          photos_after?: string[];
          customer_signature?: string | null;
          payment_status?: 'pending' | 'partial' | 'paid' | 'refunded';
          payment_method?: string | null;
          invoice_id?: string | null;
        };
      };

      // NEW: Invoices
      invoices: {
        Row: {
          id: string;
          created_at: string;
          invoice_number: string;
          customer_id: string | null;
          booking_id: string | null;
          subtotal: number;
          discount: number;
          tax: number;
          total: number;
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          due_date: string | null;
          paid_at: string | null;
          payment_method: string | null;
          stripe_payment_id: string | null;
          square_invoice_id: string | null;
          pdf_url: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          invoice_number: string;
          customer_id?: string | null;
          booking_id?: string | null;
          subtotal: number;
          discount?: number;
          tax?: number;
          total: number;
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          due_date?: string | null;
          paid_at?: string | null;
          payment_method?: string | null;
          stripe_payment_id?: string | null;
          square_invoice_id?: string | null;
          pdf_url?: string | null;
          notes?: string | null;
        };
        Update: {
          invoice_number?: string;
          customer_id?: string | null;
          booking_id?: string | null;
          subtotal?: number;
          discount?: number;
          tax?: number;
          total?: number;
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          due_date?: string | null;
          paid_at?: string | null;
          payment_method?: string | null;
          stripe_payment_id?: string | null;
          square_invoice_id?: string | null;
          pdf_url?: string | null;
          notes?: string | null;
        };
      };

      // NEW: Complaints
      complaints: {
        Row: {
          id: string;
          created_at: string;
          customer_id: string | null;
          booking_id: string | null;
          type: 'quality' | 'timing' | 'damage' | 'other';
          description: string;
          photos: string[];
          status: 'open' | 'investigating' | 'resolved' | 'closed';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          assigned_to: string | null;
          resolution: string | null;
          resolved_at: string | null;
          refund_amount: number | null;
          reclean_offered: boolean;
          reclean_completed: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          customer_id?: string | null;
          booking_id?: string | null;
          type: 'quality' | 'timing' | 'damage' | 'other';
          description: string;
          photos?: string[];
          status?: 'open' | 'investigating' | 'resolved' | 'closed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assigned_to?: string | null;
          resolution?: string | null;
          resolved_at?: string | null;
          refund_amount?: number | null;
          reclean_offered?: boolean;
          reclean_completed?: boolean;
        };
        Update: {
          customer_id?: string | null;
          booking_id?: string | null;
          type?: 'quality' | 'timing' | 'damage' | 'other';
          description?: string;
          photos?: string[];
          status?: 'open' | 'investigating' | 'resolved' | 'closed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assigned_to?: string | null;
          resolution?: string | null;
          resolved_at?: string | null;
          refund_amount?: number | null;
          reclean_offered?: boolean;
          reclean_completed?: boolean;
        };
      };

      // NEW: Job Applications (Careers)
      job_applications: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          email: string;
          phone: string;
          suburb: string | null;
          years_experience: number | null;
          previous_employers: string | null;
          skills: string[];
          has_own_transport: boolean;
          has_own_equipment: boolean;
          availability: Record<string, string[]> | null;
          preferred_hours: 'full_time' | 'part_time' | 'casual' | null;
          resume_url: string | null;
          police_check_url: string | null;
          references: string[];
          status: 'new' | 'reviewed' | 'interview' | 'trial' | 'hired' | 'rejected';
          interview_date: string | null;
          notes: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name: string;
          email: string;
          phone: string;
          suburb?: string | null;
          years_experience?: number | null;
          previous_employers?: string | null;
          skills?: string[];
          has_own_transport?: boolean;
          has_own_equipment?: boolean;
          availability?: Record<string, string[]> | null;
          preferred_hours?: 'full_time' | 'part_time' | 'casual' | null;
          resume_url?: string | null;
          police_check_url?: string | null;
          references?: string[];
          status?: 'new' | 'reviewed' | 'interview' | 'trial' | 'hired' | 'rejected';
          interview_date?: string | null;
          notes?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          full_name?: string;
          email?: string;
          phone?: string;
          suburb?: string | null;
          years_experience?: number | null;
          previous_employers?: string | null;
          skills?: string[];
          has_own_transport?: boolean;
          has_own_equipment?: boolean;
          availability?: Record<string, string[]> | null;
          preferred_hours?: 'full_time' | 'part_time' | 'casual' | null;
          resume_url?: string | null;
          police_check_url?: string | null;
          references?: string[];
          status?: 'new' | 'reviewed' | 'interview' | 'trial' | 'hired' | 'rejected';
          interview_date?: string | null;
          notes?: string | null;
          reviewed_by?: string | null;
        };
      };
    };
  };
}

// Type exports for convenience
export type Customer = Database['public']['Tables']['customers']['Row'];
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type Complaint = Database['public']['Tables']['complaints']['Row'];
export type JobApplication = Database['public']['Tables']['job_applications']['Row'];

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};
