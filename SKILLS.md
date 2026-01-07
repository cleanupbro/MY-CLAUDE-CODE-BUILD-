# SKILLS.md - Clean Up Bros (CUBS)
## Complete Skill Library - All Skills in One File

**Project:** cubs.md
**Total Skills:** 24
**MCP Servers:** 10 (8 Connected + 2 Need Auth)
**Last Updated:** January 1, 2026

---

## MCP INTEGRATIONS (Supercharged Workspace)

### Connected MCP Servers (Ready to Use)
| Server | Purpose | Status |
|--------|---------|--------|
| **Square** | Payment processing, invoices | ✓ Connected |
| **Twitter/X** | Post tweets, search Twitter | ✓ Connected |
| **OpenAI** | Use GPT models from Claude | ✓ Connected |
| **Gemini** | Use Google Gemini AI | ✓ Connected |
| **Apify** | Web scraping, data extraction | ✓ Connected |
| **ElevenLabs** | Text-to-speech, voice cloning | ✓ Connected |
| **Filesystem** | Read/write files on your machine | ✓ Connected |
| **N8N** | Trigger workflows, manage automations | ✓ Connected |

### Servers Needing Authentication
| Server | Purpose | How to Auth |
|--------|---------|-------------|
| **Stripe** | Payments, invoices, customers | `/mcp` → Authenticate |
| **Figma** | Design-to-code, extract assets | `/mcp` → Authenticate |

### Using MCP Servers
```bash
# Check MCP status
/mcp

# Authenticate with services
/mcp  # Then click "Authenticate" for Stripe/Figma

# Example prompts:
"Post a tweet about our end-of-lease special"
"Use Apify to scrape competitor prices"
"Generate a voice message for our customer"
"Query the filesystem for all quote files"
"Trigger the residential lead workflow in N8N"
"Create a Square payment link for $450"
```

### API Keys Already Configured
All MCP servers are pre-configured with your API keys from `API_KEYS.md`:
- Twitter: Consumer keys + Access tokens
- OpenAI: API key configured
- Gemini: API key configured
- Apify: Token configured
- ElevenLabs: API key configured
- N8N: MCP key configured

---

## SKILL ROUTING

### Automatic Skills (Always Active)
| Skill | Trigger | Purpose |
|-------|---------|---------|
| SESSION_SKILL | Session start/end | Save progress, handoff |
| SELF_UPDATE_SKILL | After every command/code change | Update relevant skill files |
| ERROR_SKILL | On any error | Log errors, find solutions |
| HANDOFF_SKILL | Low context (~5%) | Preserve work before context limit |

### Task Skills (Keyword Triggered)
| Keyword | Skill | Action |
|---------|-------|--------|
| "quote", "price", "cost" | PRICING_SKILL | Calculate cleaning quotes |
| "email", "respond", "follow-up" | EMAIL_SKILL | Generate professional emails |
| "webhook", "n8n", "workflow" | N8N_SKILL | Trigger/build N8N workflows |
| "lead", "research", "prospect" | LEAD_SKILL | Research & score leads |
| "schedule", "booking", "job" | OPERATIONS_SKILL | Manage scheduling |
| "voice", "audio", "elevenlabs" | VOICE_SKILL | Generate voice audio |
| "video", "ugc", "tiktok" | VIDEO_SKILL | Generate video content |
| "post", "social", "instagram" | SOCIAL_SKILL | Social media posting |
| "content", "hook", "viral" | PROMPT_SKILL | Content prompts |
| "analytics", "metrics", "ga4" | ANALYTICS_SKILL | Track performance |
| "invoice", "expense", "tax" | ACCOUNTING_SKILL | Financial management |
| "chat", "chatbot", "ai" | AI_CHAT_SKILL | Build chatbots |
| "report", "roi", "pdf" | ROI_REPORT_SKILL | Generate reports |

---

# AUTOMATIC SKILLS

---

## SESSION_SKILL
### Context Management & Quick Save

**Trigger:** Session start, `:bye:` command, or low context warning

### Session Start
When session begins, Claude:
1. Read CLAUDE.md for full context
2. Check SESSION MEMORY for last session state
3. Check ERROR LOG for any unresolved issues
4. Continue from where left off

### Session End Commands
| Command | Action |
|---------|--------|
| `:bye:` | Full session save + summary |
| `done for today` | Same as :bye: |
| `save progress` | Quick save without ending |
| `what's my status` | Show current session state |

### On `:bye:` Execute:
```yaml
1. Update SESSION MEMORY in CLAUDE.md:
   - What was accomplished
   - What's in progress
   - Next steps

2. Update LEARNING LOG if:
   - Mistakes were made
   - New patterns discovered

3. Update ERROR LOG if:
   - Any errors occurred

4. Show Summary:
   - Tasks completed
   - Files changed
   - Next actions
```

### Summary Format
```
SESSION SAVED!

Date: [Date]
Duration: ~[X] minutes

ACCOMPLISHED:
- [Task 1]
- [Task 2]

IN PROGRESS:
- [Unfinished item]

NEXT TIME:
1. [First action]
2. [Second action]

Files Updated:
- CLAUDE.md (SESSION MEMORY)
```

---

## SELF_UPDATE_SKILL
### Auto-Update Skills After Changes

**Trigger:** After EVERY command or code change

### Purpose
Keep skills accurate by updating them when related code/patterns change.

### Process
After any command or code change:
```yaml
1. Identify affected skill:
   - If pricing code changed → Update PRICING_SKILL section
   - If webhook added → Update N8N_SKILL section
   - If email template changed → Update EMAIL_SKILL section

2. Update the skill:
   - Add new patterns learned
   - Update code examples
   - Fix any outdated info

3. Log the update:
   - Add to LEARNING LOG
   - Note what was updated and why
```

### Auto-Update Triggers
| Change Type | Update |
|-------------|--------|
| New webhook added | Add to N8N_SKILL webhooks list |
| Pricing formula changed | Update PRICING_SKILL calculation |
| New email template | Add to EMAIL_SKILL templates |
| New component built | Update relevant skill |
| Bug fixed | Add to LEARNING LOG for prevention |

### Example
```
Code changed: Added new add-on "Fridge Cleaning" at $45

Auto-update:
1. Open SKILLS.md
2. Find PRICING_SKILL section
3. Add "Fridge (inside) | $45" to Add-Ons table
4. Log: "Added fridge cleaning add-on to pricing"
```

---

## ERROR_SKILL
### Error Logging & Resolution

**Trigger:** On ANY error during execution

### Process
```yaml
1. Capture error:
   - Error message
   - File/line if available
   - What was attempted

2. Log to ERROR LOG in CLAUDE.md:
   | Date | Error | File | Fix Applied |

3. Check LEARNING LOG:
   - Has this error occurred before?
   - What was the fix?

4. Apply fix or ask for help

5. Add to LEARNING LOG:
   - What went wrong
   - How it was fixed
   - How to prevent next time
```

### Error Categories
| Category | Example | Action |
|----------|---------|--------|
| Build error | TypeScript type error | Fix types, test build |
| Webhook error | 404 from N8N | Check workflow active |
| API error | Rate limit | Wait and retry |
| Runtime error | Component crash | Debug and fix |

---

## HANDOFF_SKILL
### Low Context Preservation

**Trigger:** When context reaches ~5% remaining

### Process
```yaml
1. Warn user:
   "Context at 5% - save now or continue briefly"

2. Auto-save:
   - Update SESSION MEMORY
   - Log all progress
   - Note exact state

3. Create handoff:
   - What was being worked on
   - Exact file/line if editing
   - What needs to happen next
```

---

# TASK SKILLS

---

## PRICING_SKILL
### Quote Calculation for Clean Up Bros

**Trigger:** "quote", "price", "cost", "estimate"

### Base Pricing Matrix (AUD)
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

### Travel Zones (from Liverpool hub)
| Zone | Suburbs | Adjustment |
|------|---------|------------|
| Zone 1 | Liverpool, Cabramatta, Casula, Moorebank, Prestons, Edmondson Park, Ingleburn, Glenfield, Leppington, Carnes Hill, Hoxton Park, Green Valley | +$0 |
| Zone 2 | Campbelltown, Parramatta, Bankstown | +$20 |
| Zone 3 | Sydney CBD, Penrith, Sutherland | +$40 |

### Quote Formula
```javascript
function calculateQuote(params) {
  const { beds, baths, serviceType, addOns, frequency } = params;

  // Base price lookup
  let basePrice = BASE_PRICES[`${beds}bed_${baths}bath`];

  // Apply service multiplier
  basePrice *= SERVICE_MULTIPLIERS[serviceType];

  // Add add-ons
  let addOnsTotal = addOns.reduce((sum, addon) => sum + ADDON_PRICES[addon], 0);

  // Apply frequency discount
  const discount = FREQUENCY_DISCOUNTS[frequency] || 0;

  // Calculate total
  const subtotal = basePrice + addOnsTotal;
  const total = subtotal * (1 - discount);

  // Calculate deposit (25%)
  const deposit = Math.round(total * 0.25);

  return { basePrice, addOnsTotal, total, deposit };
}
```

### Quote Format
```
QUOTE FOR: [Customer Name]

Property: [X] bed, [X] bath in [Suburb]
Service: [Service Type]

BASE CLEAN: $[Amount]
ADD-ONS:
  - [Addon 1]: $[X]
  - [Addon 2]: $[X]
SUBTOTAL: $[Amount]
[DISCOUNT: -$X (Y% frequency discount)]

TOTAL: $[AMOUNT]

Deposit (25%): $[X]
Balance on completion: $[X]

Valid for 7 days | ABN: 26 443 426 374
```

---

## EMAIL_SKILL
### Professional Email Generation

**Trigger:** "email", "respond", "follow-up", "send"

### Brand Voice
```yaml
Tone: Warm, friendly, Aussie-casual, professional
Signature: "Making Your Space Shine"
Sign-off: "Cheers," or "Thanks,"
Never: Corporate jargon, robotic, over-formal
Always: Include contact details, next steps
```

### Template: Quote Response
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

### Template: Follow-Up (48hrs)
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

### Email Rules
- Subject: Always include key info
- First line: Personal, no "Dear Customer"
- Body: Short paragraphs, bullet points
- CTA: Clear next action
- Signature: Always include contact + ABN
- Timing: Send within 2 hours of inquiry

---

## N8N_SKILL
### Build & Trigger N8N Workflows

**Trigger:** "webhook", "n8n", "workflow", "automation"

### N8N Instance
```yaml
URL: https://nioctibinu.online
MCP: Connected
```

### Active Webhooks
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

## LEAD_SKILL
### Lead Research & Scoring

**Trigger:** "lead", "research", "prospect", "company"

### Target Industries
| Tier | Industries | Contract Value |
|------|------------|----------------|
| Tier 1 (Priority) | Medical, Aged Care, Childcare, Dental | $1-8K/month |
| Tier 2 | Strata, Real Estate, Airbnb, Gyms | $500-4K/month |
| Tier 3 | Small Offices, Retail, Restaurants | $300-1.5K/month |

### Lead Scoring (0-100)
| Factor | Weight | Scoring |
|--------|--------|---------|
| Industry Fit | 30 pts | Tier 1: 30, Tier 2: 20, Tier 3: 10 |
| Location | 20 pts | Zone 1: 20, Zone 2: 15, Zone 3: 5 |
| Company Size | 15 pts | 50-200: 15, 20-50: 10, <20: 5 |
| Decision Maker Found | 15 pts | Email: 15, Name: 10, None: 0 |
| Contract Potential | 10 pts | Recurring: 10, One-off: 5 |
| Timing Signals | 10 pts | Bad reviews: 10, New: 8, Expansion: 5 |

### Score Actions
| Score | Priority | Action |
|-------|----------|--------|
| 80-100 | Hot | Immediate outreach, phone call |
| 60-79 | Warm | Email sequence, follow up 48hrs |
| 40-59 | Cool | Add to nurture list |
| <40 | Cold | Low priority, bulk email only |

---

## OPERATIONS_SKILL
### Scheduling & Job Management

**Trigger:** "schedule", "booking", "job", "calendar"

### Booking Windows
| Time Slot | Hours | Best For |
|-----------|-------|----------|
| Morning | 7am-12pm | End-of-lease, deep cleans |
| Afternoon | 12pm-5pm | Standard cleans, Airbnb |
| Evening | 5pm-8pm | Office cleaning |

### Staff Allocation
| Job Size | Cleaners | Duration |
|----------|----------|----------|
| 1-2 bed | 1 | 2-3 hrs |
| 3 bed | 2 | 3-4 hrs |
| 4+ bed | 2-3 | 4-6 hrs |
| Commercial <200sqm | 2 | 3-4 hrs |

### Job Status Flow
```
BOOKED → CONFIRMED → IN_PROGRESS → COMPLETED → INVOICED → PAID
           ↓
        RESCHEDULED
           ↓
        CANCELLED
```

### Standard Checklist
```
KITCHEN: Wipe benchtops, stovetop, microwave, fridge exterior, sink, mop floor
BATHROOMS: Toilet, shower, sink, mirrors, taps, mop floor
BEDROOMS: Dust surfaces, vacuum, empty bins
LIVING: Dust, vacuum upholstery, vacuum/mop floors
GENERAL: Light switches, door handles, cobweb removal
```

---

## VOICE_SKILL
### ElevenLabs Voice Generation

**Trigger:** "voice", "audio", "elevenlabs", "tts"

### API Setup
```
POST https://api.elevenlabs.io/v1/text-to-speech/[voice_id]
Headers:
  xi-api-key: [ELEVENLABS_API_KEY]
```

### Voice Profiles
| Profile | Voice | Use For |
|---------|-------|---------|
| Nina (Receptionist) | Rachel | Customer calls, voicemail |
| UGC Female | Bella | TikTok voiceovers |
| Professional Male | Adam | Corporate content |

### Script Templates
```
IVR Greeting:
"Hi, you've reached Clean Up Bros, Sydney's trusted cleaning team.
For quotes, press 1. For existing bookings, press 2.
To speak with someone, press 0."

Voicemail:
"Hey, you've reached Clean Up Bros. Leave your name, number, and
what you need cleaned, and we'll call you back within 2 hours."
```

---

## VIDEO_SKILL
### Video Generation APIs

**Trigger:** "video", "ugc", "tiktok", "content"

### API Priority
| Priority | API | Cost/15s | Speed |
|----------|-----|----------|-------|
| 1 | Veo 3.1 | $0.75 | 2-5 min |
| 2 | Kie.ai | $1.50 | 5-10 min |
| 3 | Sora 2 | $2.25 | 10-20 min |

### Platform Specs
| Platform | Aspect | Duration |
|----------|--------|----------|
| TikTok | 9:16 | 15-60s |
| Reels | 9:16 | 15-30s |
| Shorts | 9:16 | 15-45s |

### Prompt Structure
```
[Subject] + [Action] + [Setting] + [Style] + [Technical]

Example:
"A female cleaner in branded navy polo [SUBJECT]
 meticulously wiping a white marble benchtop [ACTION]
 in a modern Australian kitchen with morning sunlight [SETTING]
 cinematic quality, shallow depth of field [STYLE]
 slow motion, 9:16 vertical format [TECHNICAL]"
```

---

## SOCIAL_SKILL
### Social Media Posting

**Trigger:** "post", "social", "instagram", "facebook"

### Optimal Times (Sydney AEST)
| Platform | Best Times | Frequency |
|----------|-----------|-----------|
| Instagram | 6-8am, 12pm, 7-9pm | Daily |
| TikTok | 7am, 12pm, 7pm | 1-3x daily |
| Facebook | 1-4pm | 3-4x weekly |

### Content Mix
```
40% - Satisfying cleaning content
30% - Tips & hacks
15% - Before/after transformations
10% - Behind the scenes / team
5%  - Promotional / offers
```

### Hashtag Sets
```
Universal: #cleanupbros #makingspacesshine #sydneycleaning
Cleaning: #cleaningtiktok #cleanwithme #satisfyingcleaning #oddlysatisfying
Local: #sydney #westernsydney #liverpoolnsw #cabramatta
Service: #bondcleaning #airbnbcleaning #endoflease
```

---

## PROMPT_SKILL
### Viral Content Prompts

**Trigger:** "content", "hook", "viral", "script"

### Viral Formulas
```
1. Transformation: BEFORE → SHOCKING → PROCESS → REVEAL
2. POV: "POV: You're a cleaner arriving at a bond clean"
3. ASMR: Pure cleaning sounds, no talking
4. Tips: "3 cleaning hacks property managers don't want you to know"
```

### Hook Lines (First 3 Seconds)
```
Question: "This oven hasn't been cleaned in HOW long?!"
Statement: "This took us 4 hours..."
POV: "POV: You're a cleaner and walk into THIS"
```

---

## ANALYTICS_SKILL
### Tracking & Measurement

**Trigger:** "analytics", "metrics", "ga4", "tracking"

### Key Metrics
| Metric | Target |
|--------|--------|
| Leads/week | 50+ |
| Quote-to-booking | 30%+ |
| Avg quote value | $300+ |
| Cost per lead | <$20 |

### GA4 Events
```javascript
gtag('event', 'quote_start', { service_type: 'residential' });
gtag('event', 'generate_lead', { currency: 'AUD', value: 350 });
gtag('event', 'click_to_call', { page: location.pathname });
```

---

## ACCOUNTING_SKILL
### Australian Tax-Compliant Financial Management

**Trigger:** "invoice", "expense", "tax", "BAS", "GST"

### Key Info
```yaml
ABN: 26 443 426 374
GST Rate: 10%
Financial Year: 1 July - 30 June
Record Keeping: 5 years minimum
```

### BAS Due Dates
| Quarter | Period | Due Date |
|---------|--------|----------|
| Q1 | Jul-Sep | 28 October |
| Q2 | Oct-Dec | 28 February |
| Q3 | Jan-Mar | 28 April |
| Q4 | Apr-Jun | 28 July |

### Invoice Format
```
INV-YYYYMM-XXX
Example: INV-202601-001
```

### GST Calculation
```javascript
// Customer pays $220 total:
const totalIncGST = 220;
const subtotalExGST = totalIncGST / 1.1;  // = $200
const gstAmount = totalIncGST - subtotalExGST;  // = $20
```

---

## AI_CHAT_SKILL
### Chatbot Building

**Trigger:** "chat", "chatbot", "ai assistant"

### Architecture
```
User Message → Frontend Widget → n8n Webhook → Gemini API → Response
```

### N8N Endpoint
```
POST https://nioctibinu.online/webhook/cubs-chat
```

### System Prompt
```
You are the Clean Up Bros AI assistant. You help customers get quotes
for cleaning services in Western Sydney.

Keep responses concise (2-3 sentences).
Always offer to provide a quote or book a call.
```

---

## ROI_REPORT_SKILL
### Automated PDF Reports

**Trigger:** "report", "roi", "pdf"

### Flow
```
Calculator Data → n8n Webhook → Generate HTML → Send Email → Notify Admin
```

---

# QUICK COMMANDS

```bash
# Calculate quote
"Quote for 3bed 2bath Liverpool end-of-lease with oven"

# Send follow-up email
"Send follow-up email to John at john@email.com for $450 quote"

# Check webhook
"Test the residential webhook"

# Score a lead
"Score lead: Medical clinic in Cabramatta, 20 staff, owner email found"

# Generate video prompt
"Create video prompt for bond clean transformation"
```

---

*cubs.md - Clean Up Bros Skills Library*
*Self-contained, self-updating, never forgets*
