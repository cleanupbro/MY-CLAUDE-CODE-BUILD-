# Clean Up Bros - Complete Workflow Summary

*Last Updated: February 2, 2026*

---

## 🔄 How Form Submissions Work (End-to-End)

```
┌─────────────────────────────────────────────────────────────────┐
│                     CUSTOMER SUBMITS FORM                        │
│     (Residential / Commercial / Airbnb / Jobs / Feedback)        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     submissionService.ts                         │
│  1. Generate unique reference ID                                 │
│  2. Log to Google Sheets (backup)                                │
│  3. Send Telegram notification                                   │
│  4. Send SMS to admin                                            │
│  5. Save to Supabase (or localStorage fallback)                  │
└─────────────────────────────────────────────────────────────────┘
                               │
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │  TELEGRAM   │    │    SMS      │    │   SUPABASE  │
    │  Instant    │    │  +61 415    │    │  Database   │
    │  Group Msg  │    │  429 117    │    │  Storage    │
    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 📱 Telegram Message Format (Current)

When a form is submitted, you receive this in Telegram:

### Residential Quote:
```
🏠 NEW RESIDENTIAL QUOTE

👤 Customer: John Smith
📱 Phone: 0412 345 678
📧 Email: john@email.com
📍 Suburb: Liverpool
🧹 Service: End of Lease
🛏️ Bedrooms: 3 | 🚿 Bathrooms: 2
📅 Date: 2026-02-15
💰 Est. Price: $450

🔗 Reference: 1738443600-abc123
```

### Commercial Quote:
```
🏢 NEW COMMERCIAL QUOTE

🏛️ Company: ABC Retail
👤 Contact: Jane Manager
📱 Phone: 0413 456 789
📧 Email: jane@abc.com
🏗️ Facility: Office
📐 Size: 500 sqm
📆 Frequency: Weekly
💰 Est. Price: $800

🔗 Reference: 1738443600-def456
```

### Airbnb Quote:
```
🏨 NEW AIRBNB QUOTE

👤 Host: Property Host
📱 Phone: 0414 567 890
📧 Email: host@airbnb.com
🏠 Property: Apartment
🛏️ Bedrooms: 2 | 🚿 Bathrooms: 1
📆 Frequency: Per turnover
📅 Start Date: ASAP
💰 Est. Price: $180

🔗 Reference: 1738443600-ghi789
```

### Job Application:
```
👷 NEW JOB APPLICATION

👤 Applicant: New Cleaner
📱 Phone: 0415 678 901
📧 Email: cleaner@email.com
🔧 Experience: 2+ years
📅 Available: Mon, Wed, Fri
📍 Suburbs: Liverpool, Cabramatta

🔗 Reference: 1738443600-jkl012
```

---

## 📄 Page-by-Page Workflow

### PUBLIC PAGES (No form submission)

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page, hero, CTAs |
| Services | `/services` | Service cards overview |
| Pricing | `/pricing` | Transparent pricing table |
| About | `/about` | Company story |
| Reviews | `/reviews` | Testimonials |
| Suburb Pages | `/cleaning-services-{suburb}` | SEO pages (11 suburbs) |
| Service Pages | `/residential-cleaning-{area}` | SEO service pages |

### QUOTE FORMS (Send Telegram + SMS + Save to DB)

| Page | URL | Notification Type |
|------|-----|-------------------|
| Residential Quote | `/quote/residential` | 🏠 Residential Quote |
| Commercial Quote | `/quote/commercial` | 🏢 Commercial Quote |
| Airbnb Quote | `/quote/airbnb` | 🏨 Airbnb Quote |
| Contact Form | `/contact` | 📩 Contact Message |

### CUSTOMER PORTAL

| Page | URL | What it does |
|------|-----|--------------|
| Booking Lookup | `/booking` | Customer enters ref ID → sees status |
| Feedback | `/feedback` | Post-service rating (sends ⭐ notification) |
| Gift Card Balance | `/gift-card/balance` | Check balance via ref code |
| Gift Card Purchase | `/gift-card/purchase` | Buy gift cards (Square checkout) |

### CAREERS

| Page | URL | Notification Type |
|------|-----|-------------------|
| Job Application | `/careers` | 👷 Job Application |

### ADMIN (Protected - requires login)

| Page | URL | Purpose |
|------|-----|---------|
| Admin Login | `/admin` | Supabase magic link login |
| Dashboard | `/admin/dashboard` | CRM, pipeline, submissions |
| Gift Cards | `/admin/gift-cards` | Manage gift card inventory |
| Contracts | `/admin/contracts` | View/create contracts |

---

## 🔧 Services Architecture

```
src/services/
├── submissionService.ts      # Main entry - handles ALL submissions
├── telegramService.ts        # Sends formatted Telegram messages
├── smsService.ts             # Sends SMS via Twilio
├── googleSheetsService.ts    # Backup logging to Google Sheets
├── gmailService.ts           # Email sending via N8N webhooks
├── googleCalendarService.ts  # Calendar event management
├── squareService.ts          # Invoicing & payments
├── bookingOrchestrationService.ts  # End-to-end booking workflow
└── n8nService.ts             # Triggers N8N automations
```

### Notification Chain:
```
Form Submit → submissionService.saveSubmission()
                    │
                    ├─→ telegramService.sendXXXNotification()
                    ├─→ smsService.sendXXXSMS()
                    ├─→ googleSheetsService.logXXX()
                    └─→ supabase.insert()
```

---

## 📲 Where Notifications Go

| Channel | Destination | Format |
|---------|-------------|--------|
| **Telegram** | Group: -1003155659527 | HTML formatted |
| **SMS** | +61 415 429 117 | Plain text |
| **Email** | Via N8N → Gmail | HTML template |
| **Database** | Supabase `submissions` table | JSON |
| **Backup** | Google Sheets | Row per submission |

---

## 🎯 Admin Quick Actions

From the Admin Dashboard, you can:

1. **Approve & Schedule** → Creates calendar event, sends confirmation email
2. **Complete & Invoice** → Creates Square invoice, sends invoice email
3. **Request Review** → Sends review request email

Each action triggers:
- Telegram notification to team
- Email to customer
- Database status update

---

## 📊 Database Schema (Supabase)

```sql
submissions (
  id              TEXT PRIMARY KEY,    -- Reference ID
  type            TEXT,                -- Residential/Commercial/Airbnb/Jobs/etc
  status          TEXT,                -- Pending/Approved/Completed/Cancelled
  data            JSONB,               -- All form fields
  summary         TEXT,                -- AI-generated summary
  lead_score      INTEGER,             -- 1-100 score
  lead_reasoning  TEXT,                -- Why this score
  created_at      TIMESTAMP
)
```

---

## 🔗 N8N Webhooks

**Base URL:** `https://nioctibinu.online`

| Endpoint | Triggered By |
|----------|--------------|
| `/webhook/residential-quote` | Residential form |
| `/webhook/commercial-quote` | Commercial form |
| `/webhook/airbnb-quote` | Airbnb form |
| `/webhook/job-application` | Careers form |
| `/webhook/client-feedback` | Feedback form |
| `/webhook/landing-lead` | Quick quote modal |
| `/webhook/contact-form` | Contact page |
| `/webhook/booking-confirmed` | Admin approval |

---

## 🚀 Deployment

- **Live Site:** https://cleanupbros.com.au
- **Hosting:** Vercel (auto-deploy from GitHub)
- **GitHub:** Push to main → auto deploys
- **Backend:** N8N at nioctibinu.online

---

## ✅ Current Status

| Feature | Status |
|---------|--------|
| Telegram notifications | ✅ Working |
| SMS notifications | ✅ Working |
| Supabase storage | ✅ Working |
| Google Sheets backup | ✅ Working |
| Admin dashboard | ✅ Working |
| N8N webhooks | ✅ Working |
| Email notifications | ⚠️ Via N8N (needs webhook setup) |
| WhatsApp | ⚠️ Pending verification |

---

## 📝 Notes

1. **Telegram Bot:** @CLEANUPBROSBOT (token in telegramService.ts)
2. **All submissions get a unique reference ID** - format: `timestamp-random`
3. **Messages are HTML formatted** for Telegram (bold, code blocks)
4. **SMS is plain text** - short version of Telegram message
5. **Supabase stores raw JSON** - all form fields preserved

---

*This document auto-generated from codebase analysis.*
