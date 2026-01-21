# UNIVERSAL.md - Shared AI Context
## Clean Up Bros

**Purpose:** This file contains all shared context that ANY AI needs.
**Used by:** Claude, Gemini, GPT, or any future AI

---

## BUSINESS CONTEXT

```yaml
Business: Clean Up Bros
Type: Cleaning services company
ABN: 26 443 426 374
Location: Liverpool, NSW 2170 (Western Sydney hub)
Phone: +61 406 764 585
Email: cleanupbros.au@gmail.com
Website: https://cleanupbros.com.au
Owners: Hafsah & Shamal

Services:
  - Residential cleaning (standard, deep clean)
  - End-of-lease / bond cleaning
  - Commercial / office cleaning
  - Airbnb turnover cleaning

Tagline: "Making Your Space Shine"
Tone: Warm, friendly, Aussie-casual, professional
```

---

## SERVICE AREAS

### Zone 1 (No extra charge)
Liverpool, Cabramatta, Casula, Moorebank, Prestons, Edmondson Park,
Ingleburn, Glenfield, Leppington, Carnes Hill, Hoxton Park, Green Valley

### Zone 2 (+$20)
Campbelltown, Parramatta, Bankstown

### Zone 3 (+$40)
Sydney CBD, Penrith, Sutherland

---

## PRICING TABLES

### Residential Base Prices (AUD)

| Beds | Baths | Standard | Deep Clean | End-of-Lease |
|------|-------|----------|------------|--------------|
| 1 | 1 | $150 | $210 | $225 |
| 2 | 1 | $200 | $280 | $300 |
| 2 | 2 | $250 | $350 | $375 |
| 3 | 1 | $280 | $392 | $420 |
| 3 | 2 | $320 | $448 | $480 |
| 4 | 2 | $400 | $560 | $600 |
| 4 | 3 | $450 | $630 | $675 |
| 5+ | 3+ | $500+ | $700+ | $750+ |

### Service Multipliers

| Service | Multiplier |
|---------|------------|
| Standard | 1.0x |
| Deep Clean | 1.4x |
| End-of-Lease | 1.5x |
| Move-In | 1.3x |

### Add-Ons

| Add-On | Price |
|--------|-------|
| Oven (single) | $50 |
| Oven (double) | $80 |
| Rangehood | $30 |
| Fridge (inside) | $40 |
| Windows (interior/room) | $15 |
| Windows (exterior/room) | $25 |
| Blinds (per room) | $20 |
| Balcony | $50 |
| Garage (single) | $80 |
| Garage (double) | $120 |
| Carpet Steam (per room) | $40 |

### Frequency Discounts

| Frequency | Discount |
|-----------|----------|
| Weekly | 15% |
| Fortnightly | 10% |
| Monthly | 5% |

### Quote Format
```
QUOTE FOR: [Customer Name]

Property: [X] bed, [X] bath in [Suburb]
Service: [Service Type]

BASE CLEAN: $[Amount]
ADD-ONS: $[Amount]
SUBTOTAL: $[Amount]
[DISCOUNT: -$X (Y% frequency discount)]

TOTAL: $[AMOUNT]

Deposit (25%): $[X]
Balance on completion: $[X]

Valid for 7 days | ABN: 26 443 426 374
```

---

## N8N WEBHOOKS

**Base URL:** `https://nioctibinu.online`

### Lead Forms
| Webhook | Path | Purpose |
|---------|------|---------|
| RESIDENTIAL | `/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c` | Home cleaning leads |
| COMMERCIAL | `/webhook/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32` | Business cleaning leads |
| AIRBNB | `/webhook/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f` | Airbnb turnover leads |
| JOBS | `/webhook/67f764f2-adff-481e-aa49-fd3de1feecde` | Job applications |
| LANDING | `/webhook/8fe0b2c9-3d5b-44f5-84ff-0d0ef896e1fa` | Landing page leads |

### Features
| Webhook | Path | Purpose |
|---------|------|---------|
| FEEDBACK | `/webhook/client-feedback` | Customer feedback |
| GIFT_CARD | `/webhook/gift-card-purchase` | Gift card purchases |
| PAYMENT | `/webhook/create-payment-link` | Payment link creation |
| BOOKING | `/webhook/booking-confirmed` | Booking confirmation |

### Webhook Call Pattern
```javascript
const response = await fetch('https://nioctibinu.online/webhook/[PATH]', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    suburb: "Liverpool",
    bedrooms: 3,
    bathrooms: 2,
    serviceType: "end-of-lease",
    fullName: "John Smith",
    email: "john@example.com",
    phone: "0412345678",
    priceEstimate: 450
  })
});
```

### Test Command
```bash
curl -X POST "https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","phone":"0400000000","suburb":"Liverpool","TEST":true}'
```

---

## EMAIL TEMPLATES

### Quote Response
```
Subject: Your Clean Up Bros Quote - [Service] in [Suburb]

Hi [First Name],

Thanks for reaching out to Clean Up Bros!

Here's your quote for [Service Type] at your [Property Type] in [Suburb]:

Property: [Bedrooms] bed, [Bathrooms] bath
Service: [Service Type]
Add-ons: [Add-ons List]

TOTAL: $[Amount]
  Deposit (25%): $[Deposit]
  Balance on completion: $[Balance]

What's included:
- All rooms cleaned thoroughly
- Kitchen & bathrooms deep cleaned
- Floors vacuumed & mopped

Ready to book? Just reply "YES" or call us: 0406 764 585

Cheers,
Hafsah & the Clean Up Bros Team
Making Your Space Shine

Clean Up Bros | Liverpool, Western Sydney
0406 764 585 | cleanupbros.au@gmail.com
cleanupbros.com.au | ABN: 26 443 426 374
```

### 48hr Follow-Up
```
Subject: Still interested in your quote? - Clean Up Bros

Hi [First Name],

Just following up on the quote we sent for your [Service Type] cleaning.

Quick reminder:
- [Property details]
- $[Amount] total ($[Deposit] deposit)

Still interested? Just reply "YES" and we'll book you in.

Changed your mind? No worries at all - just let us know.

Cheers,
Hafsah
Clean Up Bros
```

---

## TELEGRAM NOTIFICATIONS

```yaml
Bot: @CLEANUPBROSBOT
Group Chat ID: -1003155659527
Use for: Admin alerts on new leads
```

---

## MCP INTEGRATIONS

### Connected Servers
| Server | Purpose | Status |
|--------|---------|--------|
| Square | Payment processing | Connected |
| Twitter/X | Social media | Connected |
| OpenAI | GPT models | Connected |
| Gemini | Google AI | Connected |
| Apify | Web scraping | Connected |
| ElevenLabs | Voice generation | Connected |
| N8N | Workflow automation | Connected |

### Needs Auth
| Server | Purpose |
|--------|---------|
| Stripe | Payments (use /mcp to auth) |
| Figma | Design-to-code (use /mcp to auth) |

---

## GST & TAX

```yaml
ABN: 26 443 426 374
GST Rate: 10%
Financial Year: 1 July - 30 June
Record Keeping: 5 years minimum

BAS Due Dates:
  Q1 (Jul-Sep): 28 October
  Q2 (Oct-Dec): 28 February
  Q3 (Jan-Mar): 28 April
  Q4 (Apr-Jun): 28 July

Invoice Format: INV-YYYYMM-XXX (e.g., INV-202601-001)
```

---

*Shared context for all AIs. Keep this file updated!*
