# Clean Up Bros - Complete Setup Guide
**Created:** February 2, 2026  
**For:** Sam (Shamal Krishna)  
**Status:** Ready for final setup steps

---

## 📋 SUMMARY

Your website is 95% complete. You just need to:
1. Set up Supabase (database + admin user)
2. Add environment variables to Vercel
3. Test everything works

**Estimated time:** 15-20 minutes

---

## ✅ WHAT'S ALREADY DONE

| Component | Status |
|-----------|--------|
| Website code | ✅ Complete |
| Admin panel (SimpleCRM) | ✅ Built |
| Form submissions | ✅ Working |
| Telegram notifications | ✅ Working |
| Security (anti-scraping) | ✅ Enabled |
| Bot protection | ✅ Enabled |
| GitHub repo | ✅ Pushed |

---

# PART 1: SUPABASE SETUP

## Step 1.1: Open Supabase

1. Go to: https://supabase.com/dashboard
2. Login with your account
3. Select your **Clean Up Bros** project
   - Project URL: `rtnamqbkowtrwogelgqv.supabase.co`

---

## Step 1.2: Create Database Tables

1. Click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste this ENTIRE SQL block:

```sql
-- CLEAN UP BROS - SECURE DATABASE SCHEMA
-- February 2, 2026

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

-- Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit forms
DROP POLICY IF EXISTS "insert_submissions" ON submissions;
CREATE POLICY "insert_submissions" ON submissions
    FOR INSERT WITH CHECK (true);

-- Only authenticated users can view
DROP POLICY IF EXISTS "select_submissions" ON submissions;
CREATE POLICY "select_submissions" ON submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can update
DROP POLICY IF EXISTS "update_submissions" ON submissions;
CREATE POLICY "update_submissions" ON submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- ============================================================
-- TABLE: customers
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
    last_service_date DATE
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_only_customers" ON customers;
CREATE POLICY "admin_only_customers" ON customers
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: bookings
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
    special_instructions TEXT,
    status TEXT DEFAULT 'scheduled',
    quoted_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    completed_at TIMESTAMPTZ,
    payment_status TEXT DEFAULT 'pending'
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_only_bookings" ON bookings;
CREATE POLICY "admin_only_bookings" ON bookings
    FOR ALL USING (auth.role() = 'authenticated');

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
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'draft',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    payment_method TEXT
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_only_invoices" ON invoices;
CREATE POLICY "admin_only_invoices" ON invoices
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: team_members
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
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

DROP POLICY IF EXISTS "admin_only_team" ON team_members;
CREATE POLICY "admin_only_team" ON team_members
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- DONE!
-- ============================================================
SELECT 'Database setup complete!' as message;
```

4. Click **Run** (or press Cmd+Enter)
5. You should see: `Database setup complete!`

---

## Step 1.3: Create Admin User

1. Click **Authentication** in the left sidebar
2. Click **Users** tab
3. Click **Add User** button (top right)
4. Fill in:
   - **Email:** `Cleanupbros.au@gmail.com`
   - **Password:** `Mikail@786`
   - **Auto Confirm User:** ✅ Check this box
5. Click **Create User**

✅ Admin user created!

---

## Step 1.4: Verify Setup

1. Click **Table Editor** in left sidebar
2. You should see these tables:
   - `submissions`
   - `customers`
   - `bookings`
   - `invoices`
   - `team_members`

If you see all 5 tables, Supabase is ready! ✅

---

# PART 2: VERCEL SETUP

## Step 2.1: Open Vercel

1. Go to: https://vercel.com
2. Login to the account that has **Clean Up Bros** project
   - (You have 3 Vercel accounts - use the one with cleanupbros)
3. Click on **cleanupbros** project

---

## Step 2.2: Add Environment Variables

1. Click **Settings** tab (top)
2. Click **Environment Variables** (left sidebar)
3. Add these variables ONE BY ONE:

### Variable 1: Resend API Key (for emails)
```
Name:  RESEND_API_KEY
Value: re_ez9Q7Laq_FEBdwEv9uU7fyBebhRLMjSPu
Environment: Production, Preview, Development (all checked)
```
Click **Save**

### Variable 2: Email From Address
```
Name:  FROM_EMAIL
Value: Clean Up Bros <noreply@untierxoia.resend.app>
Environment: Production, Preview, Development (all checked)
```
Click **Save**

### Variable 3: Telegram Bot Token
```
Name:  TELEGRAM_BOT_TOKEN
Value: 7851141818:AAE7KnPJUL5QW82OhaLN2aaE7Shpq1tQQbk
Environment: Production, Preview, Development (all checked)
```
Click **Save**

### Variable 4: Telegram Chat ID
```
Name:  TELEGRAM_CHAT_ID
Value: -1003155659527
Environment: Production, Preview, Development (all checked)
```
Click **Save**

---

## Step 2.3: Redeploy

1. Click **Deployments** tab (top)
2. Find the most recent deployment
3. Click the **3 dots** menu (right side)
4. Click **Redeploy**
5. Check **Use existing Build Cache** 
6. Click **Redeploy**

Wait 1-2 minutes for deployment to complete.

---

# PART 3: TEST EVERYTHING

## Test 1: Admin Login

1. Go to: https://cleanupbros.com.au/admin
2. Login with:
   - Email: `Cleanupbros.au@gmail.com`
   - Password: `Mikail@786`
3. You should see the admin dashboard ✅

---

## Test 2: Submit a Quote

1. Go to: https://cleanupbros.com.au
2. Click "Get Quote" or go to residential quote form
3. Fill out a test submission
4. Submit
5. Check:
   - ✅ Success page appears
   - ✅ Telegram notification received
   - ✅ Appears in admin panel under "Quotes"

---

## Test 3: Admin Functions

1. Go to admin panel: https://cleanupbros.com.au/admin
2. Click **Quotes** - see your test submission
3. Click on the submission - see details
4. Click **Call** or **WhatsApp** - should open dialer
5. Click **Approve** - status should change

---

# PART 4: OPTIONAL - VERIFY RESEND DOMAIN

For professional emails (from `@cleanupbros.com.au` instead of `@resend.app`):

1. Go to: https://resend.com/domains
2. Click **Add Domain**
3. Enter: `cleanupbros.com.au`
4. Add the DNS records they show to your domain registrar
5. Click **Verify**

This is optional - emails work without it, just from a generic address.

---

# QUICK REFERENCE

## URLs
| What | URL |
|------|-----|
| Website | https://cleanupbros.com.au |
| Admin Panel | https://cleanupbros.com.au/admin |
| Supabase | https://supabase.com/dashboard |
| Vercel | https://vercel.com |
| GitHub | https://github.com/cleanupbro/CLEANUPBROS-REPO |

## Login Credentials

### Admin Panel
- Email: `Cleanupbros.au@gmail.com`
- Password: `Mikail@786`

### Bank Details (for customers)
- BSB: `067873`
- Account: `21358726`
- Name: `Hafsah Nuzhat`

## Support Contacts
- Phone: 0415 429 117
- Email: hello@cleanupbros.com.au

---

# TROUBLESHOOTING

## "Access Denied" on admin login
- Make sure you created the user in Supabase Authentication
- Make sure email matches exactly: `Cleanupbros.au@gmail.com`
- Check password is correct: `Mikail@786`

## Telegram notifications not working
- Check TELEGRAM_BOT_TOKEN is in Vercel env vars
- Check TELEGRAM_CHAT_ID is in Vercel env vars
- Make sure you redeployed after adding vars

## Submissions not showing in admin
- Run the SQL to create tables
- Check Row Level Security is enabled
- Make sure you're logged in to admin

## Emails not sending
- Check RESEND_API_KEY is in Vercel env vars
- Verify domain in Resend (optional but recommended)

---

# WHAT'S PROTECTED

| Data | Protection |
|------|------------|
| Admin panel | Email whitelist + password |
| Customer data | Row Level Security (only admins) |
| API tokens | Server-side only (not in browser) |
| Submissions | Public can add, only admins can view |
| Scrapers/Bots | Auto-blocked |

---

# CHECKLIST

## Supabase
- [ ] Run SQL to create tables
- [ ] Create admin user (Cleanupbros.au@gmail.com)
- [ ] Verify tables exist in Table Editor

## Vercel
- [ ] Add RESEND_API_KEY
- [ ] Add FROM_EMAIL
- [ ] Add TELEGRAM_BOT_TOKEN
- [ ] Add TELEGRAM_CHAT_ID
- [ ] Redeploy

## Testing
- [ ] Admin login works
- [ ] Form submission works
- [ ] Telegram notification received
- [ ] Quote appears in admin panel

---

**Questions?** Message me (Atlas) anytime. Good night! 🌙
