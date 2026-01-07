# CLAUDE.md - Clean Up Bros
## Complete Self-Contained Project Configuration

**Project:** Clean Up Bros Quote Portal
**Workspace:** ~/Desktop/clean-up-bros/
**Status:** LIVE at https://cleanupbros.com.au
**Stack:** Vite + React 19 + TypeScript + Tailwind CSS
**Last Updated:** January 7, 2026

---

## GLOBAL HUB

Shared resources: `~/Desktop/claude-global/`
- Learning Log: `~/Desktop/claude-global/LEARNING_LOG.md`
- Skills Library: `~/Desktop/claude-global/SKILLS.md`
- Agents: `~/Desktop/claude-global/agents/`

---

## INSTANT CONTEXT (Read This First)

```yaml
What: Cleaning services quote portal for Sydney-based cleaning company
Where: Liverpool, NSW (Western Sydney hub)
Services: Residential, Commercial, Airbnb, End-of-Lease cleaning
Live URL: https://cleanupbros.com.au
GitHub: https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD-.git
Backend: N8N at https://nioctibunu.online
```

---

## QUICK COMMANDS

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production

# Deployment (auto-deploys on push)
git add . && git commit -m "message" && git push origin main
```

---

## PROJECT STRUCTURE

```
clean-up-bros/
├── CLAUDE.md           # This file - ALL context here
├── HANDOFF.md          # Session handoff document
├── SKILLS.md           # All 24 skills - full documentation
├── API_KEYS.md         # All API credentials for this project
├── index.html          # Entry point with Tailwind config
├── vite.config.ts      # Build configuration
├── package.json        # Dependencies
├── public/             # Static assets
└── src/
    ├── index.tsx       # App entry
    ├── App.tsx         # Main app with view routing
    ├── types.ts        # TypeScript types
    ├── constants.ts    # App constants
    ├── views/          # All page components
    ├── components/     # Reusable UI components
    ├── services/       # API services
    ├── lib/            # Utility functions
    ├── contexts/       # React contexts
    ├── hooks/          # Custom hooks
    └── styles/         # CSS files
```

---

## VIEWS (Pages)

| View | Route | Purpose |
|------|-------|---------|
| LandingView | / | Homepage with hero + quick quote |
| ResidentialQuoteView | /residential | Multi-step home cleaning form |
| CommercialQuoteView | /commercial | Commercial cleaning form |
| AirbnbQuoteView | /airbnb | Airbnb turnover form |
| ServicesView | /services | Services listing |
| AboutView | /about | About page |
| ContactView | /contact | Contact form |
| ReviewsView | /reviews | Customer reviews |
| JobApplicationView | /jobs | Job application form |
| ClientFeedbackView | /feedback | NPS + feedback form |
| GiftCardPurchaseView | /gift-cards | Buy gift cards |
| CheckBalanceView | /check-balance | Check gift card balance |
| AdminLoginView | /admin | Admin authentication |
| AdminDashboardView | /admin/dashboard | Admin panel |
| AdminGiftCardsView | /admin/gift-cards | Manage gift cards |
| AdminContractsView | /admin/contracts | Manage contracts |

---

## N8N WEBHOOKS (All Working)

**Base URL:** `https://nioctibinu.online`

| Webhook | Path | Purpose |
|---------|------|---------|
| RESIDENTIAL | `/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c` | Home cleaning leads |
| COMMERCIAL | `/webhook/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32` | Business cleaning leads |
| AIRBNB | `/webhook/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f` | Airbnb turnover leads |
| JOBS | `/webhook/67f764f2-adff-481e-aa49-fd3de1feecde` | Job applications |
| LANDING | `/webhook/8fe0b2c9-3d5b-44f5-84ff-0d0ef896e1fa` | Landing page leads |
| FEEDBACK | `/webhook/client-feedback` | Customer feedback |
| GIFT_CARD | `/webhook/gift-card-purchase` | Gift card purchases |
| PAYMENT | `/webhook/create-payment-link` | Payment link creation |

---

## BRAND DESIGN SYSTEM

### Colors
```css
--brand-teal: #008080     /* Primary - buttons, focus */
--brand-gold: #F2B705     /* Accent - prices, highlights */
--brand-navy: #0B2545     /* Hero backgrounds */
--brand-navy-light: #134074 /* Gradients */
--success-green: #28A745  /* Success states */
--error-red: #DC3545      /* Error states */
```

### Antigravity Theme
- Floating orbs with blur effects
- Glassmorphism cards
- Smooth hover animations
- Gradient text effects

### Component Patterns
```tsx
// Hero Section
<section className="relative min-h-[60vh] bg-gradient-to-br from-[#0B2545] via-[#134074] to-[#0B2545]">
  {/* Floating orbs */}
  <div className="absolute w-64 h-64 rounded-full bg-[#F2B705]/30 blur-3xl animate-drift" />
</section>

// Floating Card
<div className="floating-card bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">

// Form Input
<input className="input" /> {/* Teal focus ring */}

// Primary Button
<button className="btn-primary">Get Quote</button>
```

---

## PRICING SKILL

### Residential Base Prices (AUD)
| Beds | Baths | Standard | Deep Clean | End-of-Lease |
|------|-------|----------|------------|--------------|
| 1 | 1 | $150 | $210 | $225 |
| 2 | 1 | $200 | $280 | $300 |
| 2 | 2 | $250 | $350 | $375 |
| 3 | 2 | $320 | $448 | $480 |
| 4 | 2 | $400 | $560 | $600 |
| 4 | 3 | $450 | $630 | $675 |

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
| Fridge (inside) | $40 |
| Carpet Steam (per room) | $40 |
| Balcony | $50 |
| Garage (single) | $80 |
| Windows (interior/room) | $15 |

### Frequency Discounts
| Frequency | Discount |
|-----------|----------|
| Weekly | 15% |
| Fortnightly | 10% |
| Monthly | 5% |

### Quote Format
```
TOTAL: $[AMOUNT]
Deposit (25%): $[X]
Balance on completion: $[X]
Valid for 7 days | ABN: 26 443 426 374
```

---

## N8N SKILL

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

### Test Webhook
```bash
curl -X POST "https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","phone":"0400000000","suburb":"Liverpool","TEST":true}'
```

---

## EMAIL SKILL

### Quote Email Template
```
Subject: Your Clean Up Bros Quote - $[TOTAL]

Hi [NAME],

Thank you for your inquiry! Here's your personalized quote:

SERVICE: [TYPE] Cleaning
PROPERTY: [X] bed, [X] bath in [SUBURB]
TOTAL: $[AMOUNT] (incl. GST)

To secure your booking, a 25% deposit of $[DEPOSIT] is required.

Book Now: [BOOKING_LINK]

Questions? Call us: 0406 764 585
Email: cleanupbros.au@gmail.com

Clean Up Bros - Making Your Space Shine
```

---

## BUSINESS CONTEXT

```yaml
Business: Clean Up Bros
ABN: 26 443 426 374
Location: Liverpool, NSW 2170
Service Area: Western Sydney (Liverpool hub)
Phone: +61 406 764 585
Email: cleanupbros.au@gmail.com
Website: https://cleanupbros.com.au
Owners: Hafsah & Shamal

Zone 1 (No extra charge):
  Liverpool, Cabramatta, Casula, Moorebank, Prestons,
  Edmondson Park, Ingleburn, Glenfield, Leppington,
  Carnes Hill, Hoxton Park, Green Valley

Zone 2 (+$20):
  Campbelltown, Parramatta, Bankstown

Zone 3 (+$40):
  Sydney CBD, Penrith, Sutherland
```

---

## COMMON TASKS

### Add New View
1. Create `src/views/NewView.tsx`
2. Add lazy import in `src/App.tsx`
3. Add case in `renderView()` switch
4. Add to `ViewType` in `src/types.ts`
5. Add navigation in Header if needed

### Deploy Changes
1. Make changes
2. Test: `npm run dev`
3. Build: `npm run build`
4. Push: `git add . && git commit -m "message" && git push origin main`
5. Vercel auto-deploys

### Test Webhook
1. Check N8N dashboard: https://nioctibinu.online
2. Verify workflow is ACTIVE
3. Test with curl command above

---

## TROUBLESHOOTING

### NPM Cache Error
```bash
sudo chown -R $(whoami) ~/.npm
```

### Port Already in Use
Dev server falls back to 3001 if 3000 is busy

### Webhook Not Working
1. Check N8N dashboard is online
2. Verify workflow is activated
3. Check Telegram bot token is valid

---

## DEPLOYMENT

| Item | Value |
|------|-------|
| GitHub | https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD-.git |
| Vercel | https://vercel.com/shamals-projects-0f4386e4/my-claude-code-build |
| Live URL | https://cleanupbros.com.au |
| Domain | GoDaddy → Vercel |
| Auto-Deploy | Yes - on push to main |

---

## SESSION MEMORY

**Last Session:** January 3, 2026
**What Was Done:** Million Dollar Redesign + Full SEO Optimization
**What's Next:** Deploy to production, monitor Google rankings

### Memory Log
```
Jan 3, 2026 - MILLION DOLLAR REDESIGN + SEO
- Complete visual overhaul: bold dark theme (#1A1A1A) with lime/coral/cyan accents
- Added rainbow-pulse CTA animation to Header and Footer
- Created hero sections for 8+ views with Unsplash images
- Added Gallery section with masonry grid (6 images)
- Added Blog/Tips section with 4 article cards
- Added SERVICE AREAS section with 18 suburb grid
- Full SEO optimization for Liverpool NSW:
  - ResidentialQuoteView: "Liverpool's #1 Bond Clean Experts"
  - CommercialQuoteView: "Professional Office Cleaning Liverpool NSW"
  - AirbnbQuoteView: "Airbnb Turnover Cleaning Liverpool & Sydney"
  - Hidden sr-only SEO text for crawlers
  - Suburb grid: Liverpool, Cabramatta, Casula, + 15 more suburbs
- BUILD PASSED - Ready for deployment
- Created 3 global skills: cubs-ui-design-system, seo-local-business-australia, frontend-design-agents

Jan 1, 2026 - MCP SUPERCHARGE SESSION
- Installed 10 MCP servers (8 connected, 2 need auth)
- Connected: Square, Twitter, OpenAI, Gemini, Apify, ElevenLabs, Filesystem, N8N
- Needs Auth: Stripe, Figma (use /mcp to authenticate)
- All API keys from API_KEYS.md configured in MCP servers
- Updated SKILLS.md with complete MCP integration docs
- Workspace now has direct access to: payments, social media, AI models,
  web scraping, voice generation, file system, and workflow automation

Jan 1, 2026 - SKILLS.MD CREATED
- Created SKILLS.md with all 24 skills
- Added SELF_UPDATE_SKILL that triggers after every command/code change
- Skills organized: 4 automatic + 20 task-triggered
- CLAUDE.md updated to reference SKILLS.md

Dec 31, 2025 - INITIAL SETUP
- Migrated from clean-up-bros-quote-&-application-portal to cubs.md
- All source code moved to src/ folder
- Created standalone API_KEYS.md
- Embedded all skills into this CLAUDE.md
- Removed dependency on shared folders
- Build tested successfully
```

---

## LEARNING LOG

### Lessons Learned
Track mistakes and fixes here so they're never repeated:

| Date | Issue | Solution | Prevention |
|------|-------|----------|------------|
| Example | Webhook returned 500 | N8N workflow was inactive | Always check workflow status first |

### Skills Acquired
New patterns and techniques learned in this project:

```
- Pattern 1: [Description]
- Pattern 2: [Description]
```

---

## ERROR LOG

### Recent Errors
| Date | Error | File | Fix Applied |
|------|-------|------|-------------|
| | | | |

### Known Issues
- [None currently]

---

## SELF-LEARNING SKILL

After EVERY session, Claude MUST:

1. **Update SESSION MEMORY** above with:
   - What was done
   - Any errors encountered
   - What's left to do

2. **Add to LEARNING LOG** if:
   - A mistake was made (so it's never repeated)
   - A new pattern was discovered
   - A useful technique was learned

3. **Add to ERROR LOG** if:
   - Any errors occurred
   - Any bugs were fixed
   - Any issues were encountered

This ensures Claude NEVER forgets context between sessions.

---

## SKILLS LIBRARY

**All 24 skills are in SKILLS.md** - Read it for detailed skill documentation.

### Automatic Skills (Always Active)
| Skill | Trigger |
|-------|---------|
| SESSION_SKILL | Session start/end |
| SELF_UPDATE_SKILL | After every command/code change |
| ERROR_SKILL | On any error |
| HANDOFF_SKILL | Low context (~5%) |

### Task Skills (Read SKILLS.md for full details)
| Keyword | Skill |
|---------|-------|
| "quote", "price" | PRICING_SKILL |
| "email", "respond" | EMAIL_SKILL |
| "webhook", "n8n" | N8N_SKILL |
| "lead", "research" | LEAD_SKILL |
| "schedule", "job" | OPERATIONS_SKILL |
| "video", "ugc" | VIDEO_SKILL |
| "post", "social" | SOCIAL_SKILL |
| "invoice", "tax" | ACCOUNTING_SKILL |

---

## RULES FOR CLAUDE

1. **Read this file first** - Contains all context needed
2. **Read SKILLS.md** - For detailed skill instructions
3. **Read API_KEYS.md** - For credentials
4. **Update memory sections** - Before ending session
5. **SELF_UPDATE_SKILL** - After code changes, update relevant skills
6. **Plan before building** - Explain steps, get approval
7. **Test before push** - Run `npm run build`
8. **Never hardcode secrets** - Use .env files
9. **Keep prices accurate** - Use pricing table above
10. **Log all errors** - Add to ERROR LOG section

---

*Clean Up Bros - Making Your Space Shine*
*Codename: cubs.md | Self-contained with memory*
*SKILLS.md contains all 24 skills*
