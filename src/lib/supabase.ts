import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types
export type Database = {
  public: {
    Tables: {
      submissions: {
        Row: {
          id: string;
          created_at: string;
          service_type: string;
          property_type: string;
          bedrooms: number;
          bathrooms: number;
          square_footage: number;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          address: string;
          additional_notes: string;
          status: string;
          ai_estimated_price: number | null;
          ai_lead_score: number | null;
          ai_summary: string | null;
        };
        Insert: Omit<Database['public']['Tables']['submissions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['submissions']['Insert']>;
      };
      gift_cards: {
        Row: {
          id: string;
          code: string;
          type: string;
          original_amount: number;
          bonus_amount: number;
          current_balance: number;
          status: string;
          purchase_date: string;
          purchaser_name: string;
          purchaser_email: string;
          purchaser_phone: string;
          recipient_name: string | null;
          recipient_email: string | null;
          recipient_phone: string | null;
          activation_date: string | null;
          expiry_date: string | null;
          square_payment_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['gift_cards']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['gift_cards']['Insert']>;
      };
      gift_card_transactions: {
        Row: {
          id: string;
          gift_card_id: string;
          transaction_type: string;
          amount: number;
          balance_before: number;
          balance_after: number;
          transaction_date: string;
          reference_type: string | null;
          reference_id: string | null;
          description: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['gift_card_transactions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['gift_card_transactions']['Insert']>;
      };
      service_contracts: {
        Row: {
          id: string;
          contract_number: string;
          type: string;
          status: string;
          client_name: string;
          client_email: string;
          client_phone: string;
          client_company: string | null;
          property_address: string;
          property_type: string | null;
          bedrooms: number | null;
          bathrooms: number | null;
          square_footage: number | null;
          total_contract_value: number;
          payment_frequency: string;
          payment_amount: number;
          start_date: string;
          end_date: string | null;
          duration_months: number;
          service_description: string;
          terms_content: string;
          signature_data: string | null;
          signature_ip: string | null;
          signed_at: string | null;
          pdf_url: string | null;
          square_invoice_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['service_contracts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['service_contracts']['Insert']>;
      };
      square_invoices: {
        Row: {
          id: string;
          square_invoice_id: string;
          service_contract_id: string | null;
          invoice_number: string;
          customer_name: string;
          customer_email: string;
          amount: number;
          status: string;
          payment_url: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['square_invoices']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['square_invoices']['Insert']>;
      };
    };
  };
};
