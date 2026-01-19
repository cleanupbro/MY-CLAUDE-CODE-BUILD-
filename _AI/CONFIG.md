# CONFIG.md - Clean Up Bros AI Workspace
## Entry Point for All AIs

**Philosophy:** Any AI opens `_AI/`, reads this file, gets EVERYTHING.

---

## START HERE

```yaml
1. Read ./CLAUDE.md OR ./GEMINI.md (root folder - identical files)
2. Read memory/handoff.md (current state)
3. Check _AI/TASKS.md (work queue)
4. Continue from where previous AI left off
```

---

## IDENTITY

```yaml
Project: Clean Up Bros Quote Portal
Business: Cleaning services company
Location: Liverpool, NSW (Western Sydney hub)
Live URL: https://cleanupbros.com.au
GitHub: https://github.com/cleanupbro/CLEANUPBROS-REPO.git
Backend: https://nioctibinu.online (N8N)
ABN: 26 443 426 374
```

---

## QUICK COMMANDS

```bash
npm run dev          # Start localhost:3000
npm run build        # Build for production
git push origin main # Auto-deploys to Vercel
```

---

## MEMORY SYSTEM (UNIFIED)

**Primary files in `memory/` folder:**

| File | Purpose |
|------|---------|
| `memory/handoff.md` | Current state - READ FIRST |
| `memory/session-log.md` | Hourly logging |
| `memory/state.md` | Project status |
| `memory/changelog.md` | History |

**AI context in root folder:**

| File | Purpose |
|------|---------|
| `./CLAUDE.md` | Claude context (89 lines) |
| `./GEMINI.md` | Gemini context (identical) |

---

## WORKSPACE STRUCTURE

```
clean-up-bros/
├── CLAUDE.md ................... AI context (read this)
├── GEMINI.md ................... AI context (identical)
├── memory/ ..................... State & history
│   ├── handoff.md .............. Current state (PRIMARY)
│   ├── session-log.md .......... Hourly logging
│   ├── state.md ................ Project status
│   └── changelog.md ............ History
├── _AI/ ........................ AI workspace
│   ├── CONFIG.md ............... This file (entry point)
│   ├── TASKS.md ................ Work queue
│   ├── config/
│   │   └── UNIVERSAL.md ........ Business context, pricing, webhooks
│   ├── skills/ ................. Auto-invoke skills (11 files)
│   ├── directives/ ............. SOPs (4 files)
│   └── _archive/ ............... Old config files
├── src/ ........................ React app
├── public/ ..................... Static assets
└── api/ ........................ Vercel serverless functions
```

---

## SKILLS (Auto-Invoke)

Full list in `_AI/skills/SKILLS_INDEX.md`

| Trigger Words | Skill | Action |
|---------------|-------|--------|
| "handoff", "done for today" | handoff.md | Session handoff |
| "quote", "price" | pricing.md | Calculate quotes |
| "deploy", "push" | deploy.md | Build and deploy |
| "bug", "fix", "error" | bug-fix.md | Debug issues |

---

## CONTACT & BUSINESS

```yaml
Phone: +61 406 764 585
Email: cleanupbros.au@gmail.com
Website: https://cleanupbros.com.au
Owners: Hafsah & Shamal
```

---

## WHERE TO FIND THINGS

| Need | Location |
|------|----------|
| AI context | ./CLAUDE.md or ./GEMINI.md |
| Current state | memory/handoff.md |
| Work queue | _AI/TASKS.md |
| Business context | _AI/config/UNIVERSAL.md |
| Pricing tables | _AI/config/UNIVERSAL.md |
| N8N webhooks | _AI/config/UNIVERSAL.md |
| Skills | _AI/skills/ |

---

## RULES

1. **Read CLAUDE.md/GEMINI.md first** - Token-efficient context
2. **Read memory/handoff.md** - Current state
3. **Never hardcode secrets** - Use env vars
4. **Test before deploy** - Run `npm run build`
5. **Update memory** - Before ending session

---

*Clean Up Bros - Making Your Space Shine*
*Unified Memory System - January 19, 2026*
