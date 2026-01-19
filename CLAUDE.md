# Clean Up Bros Website
> cleanupbros.com.au | React + Vite + TailwindCSS

## Start Here
Read `memory/handoff.md` for current state. All session context lives there.

---

## Quick Reference
| Item | Value |
|------|-------|
| Dev | `npm run dev` (localhost:3000) |
| Build | `npm run build` |
| Deploy | `vercel deploy` |
| Credentials | `../../credentials/owner/cleanupbros.env` |
| Business Config | `_AI/config/UNIVERSAL.md` |

---

## Key Files
| File | Purpose |
|------|---------|
| `src/views/LandingViewNew.tsx` | Main landing (1200+ lines) |
| `src/views/*View.tsx` | All page components |
| `public/images/` | Local images (before-after, heroes) |
| `memory/handoff.md` | Current state (read first) |

---

## Design System (Phase 1 Complete)
```css
Colors: #0066CC (primary), #2997FF (accent), #30D158 (success), #FFD60A (gold)
Containers: max-w-7xl (content), max-w-5xl (hero), max-w-2xl (forms)
Effects: Ken Burns 20s, glassmorphism, sparkles
```
All pages updated: Landing, Services, About, Contact, Reviews

---

## Integrations
Supabase | Stripe | N8N (nioctibinu.online) | Vercel

---

## Project Phases
- [x] Phase 1: Visual overhaul (Jan 19, 2026) - COMPLETE
- [ ] Phase 2: Database (Supabase quote storage)
- [ ] Phase 3: Backend (N8N workflow automation)

---

## Session Protocol
1. **Start:** Read `memory/handoff.md`
2. **Hourly:** Update `memory/session-log.md`
3. **End:** Run handoff skill or say "done for today"

---

## Skills (Auto-Invoke)
See `_AI/skills/SKILLS_INDEX.md` for full list.

| Trigger | Skill |
|---------|-------|
| "handoff", "done for today" | handoff.md |
| "deploy", "push" | deploy.md |
| "quote", "price" | pricing.md |
| "bug", "fix" | bug-fix.md |

---

## Memory Files
| File | Purpose |
|------|---------|
| `memory/handoff.md` | Current state (PRIMARY) |
| `memory/session-log.md` | Hourly logging |
| `memory/state.md` | Project status |
| `memory/changelog.md` | History |

---

## Business Context
- **Phone:** +61 406 764 585
- **Email:** cleanupbros.au@gmail.com
- **Location:** Liverpool, NSW (Western Sydney)
- **Services:** Residential, Commercial, End-of-Lease, Airbnb

---

*Last updated: January 19, 2026 - Handoff system unified*
