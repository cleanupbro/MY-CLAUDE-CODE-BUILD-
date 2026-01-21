# Clean Up Bros - AI Protocol
*Sealed Universe: All work stays in this folder. Last updated: January 22, 2026*

## Session Startup (On ANY greeting or session start)

**When user says "hi", "hello", "hey", or starts a new session:**

1. **Read context files** (silently):
   - `STATUS.md` → Current state & active focus
   - `README.md` → "Current Progress" section
   - `tail -10 LOG.md` → Recent history

2. **Greet with context**:
   ```
   Welcome back! Here's where we left off:
   - **Phase**: [from STATUS.md]
   - **Last Session**: [date from LOG.md]
   - **Active Focus**: [from STATUS.md]
   - **Next Tasks**: [from README.md Current Progress]

   Ready to continue, or want to work on something else?
   ```

3. **Wait for direction** before taking action

## First Commands (For Context Refresh)
```bash
cat STATUS.md    # Current state
cat PLAN.md      # Roadmap
tail -10 LOG.md  # Recent history
```

## Build Commands
```bash
npm run dev      # Start dev server (localhost:3000+)
npm run build    # Production build
npm run lint     # Check for issues
```

## Git Commands
```bash
git add . && git commit -m "msg"  # Commit changes
git push                          # Push to GitHub
```

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Backend**: N8N (nioctibinu.online) + Vercel Serverless
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe + Square

## Key Paths
| Path | Purpose |
|------|---------|
| `src/views/` | 23 page components (LandingViewNew.tsx is main) |
| `src/components/` | 28 reusable UI components |
| `src/services/` | 18 backend services |
| `src/lib/priceCalculator.ts` | Pricing logic (25-30% margins) |
| `docs/credentials/API_KEYS.env` | All API keys (NEVER commit) |
| `docs/skills/` | AI assistant skills |
| `docs/ai-cache/` | Pre-computed knowledge for AI assistants |

## AI Knowledge Cache
**Location**: `docs/ai-cache/`

Read these files before working on forms, webhooks, or notifications:
| File | Contents |
|------|----------|
| `forms-inventory.md` | All forms, fields, endpoints, test payloads |
| `services-inventory.md` | All 18 backend services |
| `webhooks-inventory.md` | All N8N webhook URLs |
| `notification-channels.md` | Email, SMS, Telegram, WhatsApp config |

## Code Style
- Use ES modules (import/export), not CommonJS
- Use TypeScript strict mode
- TailwindCSS for styling, no inline styles
- Components go in `src/components/`, pages in `src/views/`

## Skill Protocol (MANDATORY)

**Before executing any task:**
1. Search `docs/skills/` for matching skill file
2. If skill exists → read and follow it exactly
3. If no skill → proceed normally

**After every task, report:**
```
Tools Used: [list MCP tools or "None"]
Skills Applied: [list skill files or "None"]
```

## Skills Reference

| Trigger Keywords | Skill File | MCP Tools |
|------------------|------------|-----------|
| "done", "end session" | `done-for-day.md` | - |
| "deploy", "go live" | `deploy.md` | - |
| "bug", "error", "fix" | `bug-fix.md` | - |
| "n8n", "workflow", "automation" | `n8n-manager.md` | `mcp__n8n-mcp__*` |
| "n8n api", "workflow api" | `api-n8n.md` | `mcp__n8n-mcp__*` |
| "stripe", "payment", "invoice" | `api-stripe.md` | `mcp__stripe__*` |
| "supabase", "database", "query" | `api-supabase.md` | - |
| "square", "pos", "terminal" | `api-square.md` | - |
| "twilio", "sms", "call" | `api-twilio.md` | - |
| "google", "gemini", "gmail" | `api-google.md` | - |
| "elevenlabs", "voice", "tts" | `api-elevenlabs.md` | - |
| "pinecone", "vector", "embed" | `api-pinecone.md` | `mcp__pinecone__*` |
| "openrouter", "llm", "ai model" | `api-openrouter.md` | - |
| "firebase", "auth", "realtime" | `api-firebase.md` | `mcp__firebase__*` |
| "firecrawl", "scrape", "crawl" | `api-firecrawl.md` | - |
| "apify", "web automation" | `api-apify.md` | - |
| "sentry", "error tracking" | `api-sentry.md` | `mcp__sentry__*` |

## N8N Webhooks (nioctibinu.online)
| Endpoint | Purpose | Status |
|----------|---------|--------|
| `/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c` | Residential quotes | Working |
| `/webhook/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32` | Commercial quotes | Working |
| `/webhook/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f` | Airbnb quotes | Working |
| `/webhook/67f764f2-adff-481e-aa49-fd3de1feecde` | Job applications | Working |
| `/webhook/contact-form` | Contact inquiries | Working |
| `/webhook/client-feedback` | Client feedback | Working |

## Notification Channels
| Channel | Provider | Status |
|---------|----------|--------|
| Email | Gmail SMTP (via N8N) | Working |
| SMS | Twilio (via N8N) | Working |
| Telegram | Bot @CLEANUPBROSBOT | Working |
| WhatsApp | Meta Business API | Needs Setup |

**Telegram Bot**: `7851141818:AAE7KnPJUL5QW82OhaLN2aaE7Shpq1tQQbk` | Group: `-1003155659527`

## Design System
```
Colors: #0066CC (primary), #2997FF (accent), #30D158 (success), #FFD60A (gold)
Containers: max-w-7xl (content), max-w-5xl (hero), max-w-2xl (forms)
```

## Business Context
- **Company**: Clean Up Bros
- **Location**: Liverpool, NSW (Western Sydney)
- **Phone**: +61 406 764 585
- **Email**: cleanupbros.au@gmail.com
- **Website**: cleanupbros.com.au
- **Admin**: cleanupbros.com.au/admin (admin@cleanupbros.com.au / Admin2026Secure)

## Session Shutdown (On "done", "end session", etc.)

**Follow `docs/skills/done-for-day.md` exactly. Quick summary:**

1. Display visual session summary
2. Update these files:
   - `STATUS.md` → New active focus
   - `LOG.md` → Append session entry
   - `PLAN.md` → Check off completed phases
   - `README.md` → Update "Current Progress" section
3. Git: `add -A` → `commit` → `push`
4. Confirm with commit hash

## Rules
1. **Boundary**: Never reference files outside this folder
2. **Secrets**: API keys in `docs/credentials/API_KEYS.env` - never commit
3. **Logging**: Always update STATUS.md, LOG.md, and README.md after work
4. **Testing**: Run `npm run build` before committing
