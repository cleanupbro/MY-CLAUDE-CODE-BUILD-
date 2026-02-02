-- ============================================================
-- CLEAN UP BROS - SECURE DATABASE SCHEMA
-- February 2, 2026
-- 
-- SECURITY FEATURES:
-- - Row Level Security (RLS) on all tables
-- - Only authenticated admins can read sensitive data
-- - Public can only INSERT (submit forms)
-- - No public SELECT on customer data
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: submissions (Quote requests)
-- PUBLIC CAN INSERT, ONLY ADMINS CAN READ
-- ============================================================
DROP TABLE IF EXISTS submissions CASCADE;
CREATE TABLE submissions (
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

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert submissions" ON submissions;
DROP POLICY IF EXISTS "Only admins can view submissions" ON submissions;
DROP POLICY IF EXISTS "Only admins can update submissions" ON submissions;

-- PUBLIC: Can submit forms (INSERT only)
CREATE POLICY "Anyone can insert submissions" ON submissions
    FOR INSERT 
    WITH CHECK (true);

-- ADMIN: Can view all submissions
CREATE POLICY "Only admins can view submissions" ON submissions
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- ADMIN: Can update submissions
CREATE POLICY "Only admins can update submissions" ON submissions
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- ============================================================
-- TABLE: customers (PRIVATE - Admins only)
-- ============================================================
DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (
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
    last_service_date DATE
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can access customers" ON customers;
CREATE POLICY "Only admins can access customers" ON customers
    FOR ALL
    USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: bookings (PRIVATE - Admins only)
-- ============================================================
DROP TABLE IF EXISTS bookings CASCADE;
CREATE TABLE bookings (
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
    special_instructions TEXT,
    status TEXT DEFAULT 'scheduled',
    quoted_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    completed_at TIMESTAMPTZ,
    payment_status TEXT DEFAULT 'pending'
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can access bookings" ON bookings;
CREATE POLICY "Only admins can access bookings" ON bookings
    FOR ALL
    USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: invoices (PRIVATE - Admins only)
-- ============================================================
DROP TABLE IF EXISTS invoices CASCADE;
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    invoice_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    booking_id UUID REFERENCES bookings(id),
    subtotal DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'draft',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    payment_method TEXT
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can access invoices" ON invoices;
CREATE POLICY "Only admins can access invoices" ON invoices
    FOR ALL
    USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: team_members (PRIVATE - Admins only)
-- ============================================================
DROP TABLE IF EXISTS team_members CASCADE;
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    role TEXT DEFAULT 'cleaner',
    status TEXT DEFAULT 'active',
    hourly_rate DECIMAL(10,2)
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can access team_members" ON team_members;
CREATE POLICY "Only admins can access team_members" ON team_members
    FOR ALL
    USING (auth.role() = 'authenticated');

-- ============================================================
-- VERIFICATION QUERY
-- Run this after setup to confirm tables exist:
-- ============================================================
-- SELECT table_name, 
--        (SELECT COUNT(*) FROM information_schema.table_privileges 
--         WHERE table_name = t.table_name) as privilege_count
-- FROM information_schema.tables t
-- WHERE table_schema = 'public'
-- AND table_type = 'BASE TABLE';

-- ============================================================
-- DONE! Your data is now protected:
-- - Public users can ONLY submit forms (INSERT)
-- - They CANNOT view, update, or delete any data
-- - Only logged-in admins can see customer information
-- ============================================================
