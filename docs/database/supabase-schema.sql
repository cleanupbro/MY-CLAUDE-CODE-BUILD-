-- ============================================================
-- CLEAN UP BROS - SUPABASE DATABASE SCHEMA
-- Last Updated: February 2, 2026
-- 
-- Run this in Supabase SQL Editor to create all required tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: submissions (Quote requests)
-- ============================================================
CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    type TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    data JSONB NOT NULL DEFAULT '{}',
    summary TEXT,
    lead_score INTEGER,
    lead_reasoning TEXT,
    admin_notes TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- ============================================================
-- TABLE: admin_users
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: customers (CRM)
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    suburb TEXT,
    notes TEXT,
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    last_service_date DATE,
    preferred_cleaner UUID
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_suburb ON customers(suburb);

-- ============================================================
-- TABLE: team_members (Staff/Cleaners)
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    role TEXT DEFAULT 'cleaner' CHECK (role IN ('cleaner', 'supervisor', 'admin')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    hourly_rate DECIMAL(10,2),
    skills TEXT[] DEFAULT '{}',
    availability JSONB,
    photo_url TEXT,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);

-- ============================================================
-- TABLE: bookings (Scheduled Jobs)
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    submission_id TEXT REFERENCES submissions(id),
    customer_id UUID REFERENCES customers(id),
    booking_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    service_type TEXT NOT NULL,
    address TEXT NOT NULL,
    suburb TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    add_ons TEXT[] DEFAULT '{}',
    special_instructions TEXT,
    assigned_to UUID REFERENCES team_members(id),
    assigned_team UUID[] DEFAULT '{}',
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled')),
    quoted_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    deposit_amount DECIMAL(10,2),
    deposit_paid BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    completion_notes TEXT,
    photos_before TEXT[] DEFAULT '{}',
    photos_after TEXT[] DEFAULT '{}',
    customer_signature TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
    payment_method TEXT,
    invoice_id UUID
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_assigned_to ON bookings(assigned_to);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);

-- ============================================================
-- TABLE: invoices
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    invoice_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    booking_id UUID REFERENCES bookings(id),
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    due_date DATE,
    paid_at TIMESTAMPTZ,
    payment_method TEXT,
    stripe_payment_id TEXT,
    square_invoice_id TEXT,
    pdf_url TEXT,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);

-- ============================================================
-- TABLE: complaints
-- ============================================================
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_id UUID REFERENCES customers(id),
    booking_id UUID REFERENCES bookings(id),
    type TEXT NOT NULL CHECK (type IN ('quality', 'timing', 'damage', 'other')),
    description TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES team_members(id),
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    refund_amount DECIMAL(10,2),
    reclean_offered BOOLEAN DEFAULT FALSE,
    reclean_completed BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);

-- ============================================================
-- TABLE: job_applications
-- ============================================================
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    suburb TEXT,
    years_experience INTEGER,
    previous_employers TEXT,
    skills TEXT[] DEFAULT '{}',
    has_own_transport BOOLEAN DEFAULT FALSE,
    has_own_equipment BOOLEAN DEFAULT FALSE,
    availability JSONB,
    preferred_hours TEXT CHECK (preferred_hours IN ('full_time', 'part_time', 'casual')),
    resume_url TEXT,
    police_check_url TEXT,
    references TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'interview', 'trial', 'hired', 'rejected')),
    interview_date DATE,
    notes TEXT,
    reviewed_by UUID REFERENCES team_members(id)
);

CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for authenticated users (admin use)
-- Note: In production, you may want more restrictive policies

CREATE POLICY "Allow all for authenticated" ON submissions
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated" ON customers
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated" ON team_members
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated" ON bookings
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated" ON invoices
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated" ON complaints
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated" ON job_applications
    FOR ALL USING (true);

-- Allow anon key to insert submissions (for public quote forms)
CREATE POLICY "Allow anon insert" ON submissions
    FOR INSERT WITH CHECK (true);

-- ============================================================
-- DONE!
-- ============================================================
-- After running this, verify with:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
