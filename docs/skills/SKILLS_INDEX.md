# Skills Index

> Quick reference for all available skills in this project
> Location: `docs/skills/`

---

## Available Skills

### Core Skills

| Skill | Trigger Words | Purpose |
|-------|---------------|---------|
| `done-for-day.md` | "done", "done for the day", "end session" | End-of-session backup: updates STATUS.md, LOG.md, commits to GitHub |
| `deploy.md` | "deploy", "go live", "ship it" | Deploy changes to cleanupbros.com.au via Vercel |
| `bug-fix.md` | "error", "bug", "broken", "fix" | Debug and fix issues in the application |
| `n8n-manager.md` | "n8n", "workflow", "automation" | Manage N8N workflows: list, activate, execute |
| `ui-fix.md` | "invisible text", "btn-secondary", "UI broken" | Fix invisible text, buttons, and form elements |

### API Skills

| Skill | Trigger Words | MCP Tools | Purpose |
|-------|---------------|-----------|---------|
| `api-n8n.md` | "n8n api", "workflow api" | `mcp__n8n-mcp__*` | N8N REST API: workflows, executions, credentials |
| `api-stripe.md` | "stripe", "payment", "invoice" | `mcp__stripe__*` | Stripe payments, customers, subscriptions |
| `api-supabase.md` | "supabase", "database", "query" | - | Supabase DB queries, auth, storage |
| `api-square.md` | "square", "pos", "terminal" | - | Square POS, invoices, catalog |
| `api-twilio.md` | "twilio", "sms", "call" | - | Twilio SMS, voice, WhatsApp |
| `api-google.md` | "google", "gemini", "gmail" | - | Google APIs: Gemini, Gmail, Sheets |
| `api-elevenlabs.md` | "elevenlabs", "voice", "tts" | - | ElevenLabs text-to-speech |
| `api-pinecone.md` | "pinecone", "vector", "embed" | `mcp__pinecone__*` | Pinecone vector DB, embeddings |
| `api-openrouter.md` | "openrouter", "llm", "ai model" | - | OpenRouter multi-model AI |
| `api-firebase.md` | "firebase", "auth", "realtime" | `mcp__firebase__*` | Firebase auth, Firestore, storage |
| `api-firecrawl.md` | "firecrawl", "scrape", "crawl" | - | Firecrawl web scraping |
| `api-apify.md` | "apify", "web automation" | - | Apify actors, scrapers |
| `api-sentry.md` | "sentry", "error tracking" | `mcp__sentry__*` | Sentry error monitoring, issues |

---

## How to Use Skills

1. **Check this index** when starting a task
2. **Read the skill file** if it matches your task
3. **Follow the steps** in the skill
4. **Update LOG.md** after completing the skill

---

## Skill Quick Reference

### done-for-day.md
**When:** End of session, saving work
**Does:**
- Displays session summary
- Updates STATUS.md with next focus
- Appends to LOG.md
- Commits and pushes to GitHub

### deploy.md
**When:** Ready to push changes live
**Does:**
- Runs build verification
- Commits changes
- Pushes to GitHub (triggers Vercel)
- Updates protocol files

### bug-fix.md
**When:** Something is broken
**Does:**
- Guides through debugging process
- Identifies common issues
- Documents fix in LOG.md
- Provides rollback instructions

### ui-fix.md
**When:** Text/buttons are invisible or hard to see
**Does:**
- Fixes `btn-secondary` class issues
- Adds explicit text colors to inputs/selects
- Provides standard class patterns for buttons & forms
- Documents common contrast issues with brand colors

---

## API Skills Quick Reference

### api-n8n.md
**MCP Tools:** `mcp__n8n-mcp__*`
**Endpoints:** Workflows, executions, credentials
**Auth:** API key via header

### api-stripe.md
**MCP Tools:** `mcp__stripe__*`
**Endpoints:** Customers, products, invoices, payments
**Auth:** Secret key in Authorization header

### api-supabase.md
**MCP Tools:** None (use HTTP/fetch)
**Endpoints:** Database REST, auth, storage
**Auth:** Service role key + anon key

### api-square.md
**MCP Tools:** None (use HTTP/fetch)
**Endpoints:** Payments, invoices, catalog
**Auth:** Access token in Authorization header

### api-twilio.md
**MCP Tools:** None (use HTTP/fetch)
**Endpoints:** SMS, voice, WhatsApp
**Auth:** Account SID + Auth Token (Basic auth)

### api-google.md
**MCP Tools:** None (use HTTP/fetch)
**Endpoints:** Gemini AI, Gmail, Sheets, Calendar
**Auth:** API key or OAuth tokens

### api-elevenlabs.md
**MCP Tools:** None (use HTTP/fetch)
**Endpoints:** Text-to-speech, voices, models
**Auth:** API key in xi-api-key header

### api-pinecone.md
**MCP Tools:** `mcp__pinecone__*`
**Endpoints:** Index operations, upsert, query
**Auth:** API key in header

### api-openrouter.md
**MCP Tools:** None (use HTTP/fetch)
**Endpoints:** Chat completions, models
**Auth:** API key in Authorization header

### api-firebase.md
**MCP Tools:** `mcp__firebase__*`
**Endpoints:** Auth, Firestore, Realtime DB, Storage
**Auth:** Firebase Admin SDK or API keys

### api-firecrawl.md
**MCP Tools:** None (use HTTP/fetch)
**Endpoints:** Scrape, crawl, map
**Auth:** API key in Authorization header

### api-apify.md
**MCP Tools:** None (use HTTP/fetch)
**Endpoints:** Actors, runs, datasets
**Auth:** API token in query param or header

### api-sentry.md
**MCP Tools:** `mcp__sentry__*`
**Endpoints:** Issues, events, projects
**Auth:** Auth token in Authorization header

---

## Adding New Skills

1. Create `docs/skills/[skill-name].md`
2. Follow the template structure:
   - Triggers
   - Pre-flight checks
   - Steps
   - Verification
   - Success message
3. Add to this index

---

## Protocol Files That Reference Skills

- `CLAUDE.md` - Lists skills for coding tasks
- `GEMINI.md` - Lists skills for strategic tasks

---

*Skills help maintain consistency across sessions and AI assistants.*
