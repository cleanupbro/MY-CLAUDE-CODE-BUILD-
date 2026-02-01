# Clean Up Bros - Full Architecture Plan

## 📱 Website → App Conversion Strategy

---

## 🗺️ PAGE MAP (26 Views Total)

### PUBLIC PAGES (Customer-Facing)

| Page | Route | Purpose | Backend Needs |
|------|-------|---------|---------------|
| **LandingViewNew** | `/` | Hero, services overview, social proof, CTAs | - |
| **ServicesView** | `/services` | All services with pricing cards | - |
| **PricingView** | `/pricing` | Transparent pricing table | - |
| **SuburbLandingView** | `/cleaning-services-{suburb}` | SEO pages for 11 suburbs | - |
| **ServiceLandingView** | `/residential-cleaning-{area}` | SEO service pages | - |
| **AboutView** | `/about` | Company story, team, values | - |
| **ReviewsView** | `/reviews` | Customer testimonials, ratings | Fetch from Google/DB |
| **ContactView** | `/contact` | Contact form, location, hours | n8n webhook |

### QUOTE FORMS (Lead Generation)

| Page | Route | Purpose | Backend |
|------|-------|---------|---------|
| **ResidentialQuoteView** | `/quote/residential` | Home cleaning quote form | n8n → Supabase |
| **AirbnbQuoteView** | `/quote/airbnb` | Airbnb turnover quote form | n8n → Supabase |
| **CommercialQuoteView** | `/quote/commercial` | Business cleaning quote form | n8n → Supabase |
| **SubmissionSuccessView** | `/success` | Thank you + next steps | - |

### CUSTOMER PORTAL

| Page | Route | Purpose | Backend |
|------|-------|---------|---------|
| **BookingLookupView** | `/booking` | Track booking by reference ID | Supabase query |
| **ClientFeedbackView** | `/feedback` | Post-service rating + review | n8n → Supabase |
| **CheckBalanceView** | `/gift-card/balance` | Check gift card balance | Supabase query |
| **GiftCardPurchaseView** | `/gift-card/purchase` | Buy gift cards | Square API |
| **CleanUpCardView** | `/cleanupcard` | Loyalty program info | - |

### CONTRACTS & INVOICES

| Page | Route | Purpose | Backend |
|------|-------|---------|---------|
| **BasicContractView** | `/contract/basic` | Generate basic service contract | PDF generation |
| **AirbnbContractView** | `/contract/airbnb` | Airbnb-specific contract | PDF generation |
| **CommercialInvoiceView** | `/invoice` | Generate commercial invoice | Square API |

### CAREERS

| Page | Route | Purpose | Backend |
|------|-------|---------|---------|
| **JobApplicationView** | `/careers` | Job application form | n8n → Supabase |

### ADMIN PANEL (Protected)

| Page | Route | Purpose | Backend |
|------|-------|---------|---------|
| **AdminLoginView** | `/admin` | Magic link login | Supabase Auth |
| **AdminDashboardView** | `/admin/dashboard` | Full admin CRM | Supabase realtime |
| **AdminGiftCardsView** | `/admin/gift-cards` | Gift card management | Supabase CRUD |
| **AdminContractsView** | `/admin/contracts` | Contract management | Supabase CRUD |

---

## 🔧 CURRENT n8n INTEGRATIONS

**Base URL:** `https://nioctibinu.online`

| Webhook | Purpose | Status |
|---------|---------|--------|
| `/webhook/98d35453...` | Residential quote | ✅ Active |
| `/webhook/bb5fdb61...` | Commercial quote | ✅ Active |
| `/webhook/5d3f6ff4...` | Airbnb quote | ✅ Active |
| `/webhook/67f764f2...` | Job applications | ✅ Active |
| `/webhook/8fe0b2c9...` | Landing leads | ✅ Active |
| `/webhook/booking-confirmed` | Booking confirmation | ✅ Active |
| `/webhook/create-payment-link` | Square payment link | ✅ Active |
| `/webhook/cub-ai-chat` | AI chat responses | ✅ Active |
| `/webhook/cub-sms-followup` | SMS follow-up | ✅ Active |
| `/webhook/cub-inbound-call` | Inbound call handling | ✅ Active |
| `/webhook/cub-outbound-call` | Outbound call trigger | ✅ Active |
| `/webhook/client-feedback` | Feedback submission | ✅ Active |
| `/webhook/contact-form` | Contact form | ✅ Active |

---

## 💾 DATABASE SCHEMA (Supabase)

### Current Tables

```sql
-- Core Tables
submissions        -- All quote/lead submissions
admin_users        -- Admin authentication
customers          -- CRM customer records
team_members       -- Staff/cleaners
bookings           -- Scheduled jobs
invoices           -- Payment records
complaints         -- Issue tracking
job_applications   -- Career applications
```

### Data Flow

```
Customer Form → n8n Webhook → AI Processing → Supabase → Admin Dashboard
                    ↓
            Email/SMS Notifications
                    ↓
            Google Sheets Backup
```

---

## 🚀 BACKEND ARCHITECTURE FOR APP

### Option 1: Keep Current Stack (Recommended for Speed)

```
Frontend: React + Vite (PWA)
Backend: n8n + Supabase + Vercel Edge Functions
Payments: Square
Auth: Supabase Auth
Storage: Supabase Storage
```

### Option 2: Full Backend (For Scale)

```
Frontend: React Native / Expo
Backend: Node.js + Express (or Next.js API routes)
Database: Supabase PostgreSQL
Queue: n8n for automations
Payments: Square + Stripe
Auth: Supabase Auth
Push: Firebase Cloud Messaging
```

---

## 📱 APP FEATURES TO BUILD

### Phase 1: Customer App (PWA → Native)

- [ ] **Booking Flow** - Request quotes from mobile
- [ ] **Booking Tracker** - Real-time job status
- [ ] **Payment Portal** - Pay invoices, gift cards
- [ ] **Push Notifications** - Booking confirmations, reminders
- [ ] **Rating System** - Post-service feedback
- [ ] **Chat Support** - AI + human handoff

### Phase 2: Cleaner App

- [ ] **Job Dashboard** - Today's jobs, addresses, notes
- [ ] **Check-In/Out** - GPS timestamp for arrival/departure
- [ ] **Photo Upload** - Before/after photos
- [ ] **Customer Signature** - Digital signature capture
- [ ] **Earnings Tracker** - Weekly earnings, tips
- [ ] **Availability** - Set working hours

### Phase 3: Admin App

- [ ] **Live Dashboard** - Jobs in progress, team locations
- [ ] **Quick Dispatch** - Assign jobs on the go
- [ ] **Notifications** - Instant alerts for new leads
- [ ] **Revenue Overview** - Daily/weekly/monthly stats

---

## 🎨 UI IMPROVEMENTS (2026 Design Trends)

Based on current trends:

### 1. Barely-There UI (Hyper Minimal)
- Reduce visual noise
- More white/black space
- Single font family
- Fewer colors, more impact

### 2. Soft Maximalism (Controlled Bold)
- Hero sections with HUGE typography
- One strong accent color (your teal-to-gold gradient)
- Strategic moments of visual impact

### 3. Human Touch Design (Anti-AI)
- Hand-drawn elements
- Slightly imperfect layouts
- Real photography over stock
- Sketched icons

### 4. Story-Driven Motion
- Purposeful animations (not decorative)
- Scroll-linked reveals
- Interactive micro-moments
- Loading state animations

### 5. Content-First Layouts
- Let content breathe
- Reduce UI chrome
- Focus on readability
- Remove unnecessary sections

---

## 🐛 BUGS TO FIX

### High Priority
1. [ ] Mobile nav menu needs polish
2. [ ] Form validation error messages inconsistent
3. [ ] Price calculator edge cases (6+ bedrooms)
4. [ ] Exit popup too aggressive

### Medium Priority
1. [ ] Admin dashboard mobile responsiveness
2. [ ] Contract PDF generation sometimes fails
3. [ ] Gift card balance check slow
4. [ ] Image optimization (some hero images >500KB)

### Low Priority
1. [ ] SEO meta tags missing on some pages
2. [ ] Favicon needs update
3. [ ] 404 page design
4. [ ] Sitemap needs auto-generation

---

## 🔄 RECOMMENDED NEXT STEPS

### Immediate (This Week)
1. Fix critical bugs listed above
2. Optimize images and loading performance
3. Add PWA manifest for "Add to Home Screen"
4. Test all n8n webhooks are working

### Short-Term (This Month)
1. Build customer booking tracker
2. Add push notification support (PWA)
3. Implement real-time job status
4. Create cleaner mobile interface

### Medium-Term (Next Quarter)
1. React Native app shell
2. Cleaner app MVP
3. Advanced analytics dashboard
4. Automated follow-up sequences

---

## 📊 METRICS TO TRACK

| Metric | Current | Target |
|--------|---------|--------|
| Page Load Time | ~2.5s | <1.5s |
| Quote Conversion | ~15% | >25% |
| Mobile Traffic | ~70% | 80%+ |
| Bounce Rate | ~45% | <35% |
| Return Visitors | ~20% | >40% |

---

*Last Updated: February 2026*
*Version: 2.0*
