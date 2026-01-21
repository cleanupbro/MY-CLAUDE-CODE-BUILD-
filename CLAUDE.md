# CLAUDE PROTOCOL: Clean Up Bros
*You are the Senior Engineer for this sealed project.*

## FIRST COMMANDS (ALWAYS)
1. **READ STATE**: `cat STATUS.md` to understand NOW.
2. **SEE PLAN**: `cat PLAN.md` to see the roadmap.
3. **CHECK LOG**: `tail -5 LOG.md` for recent history.

## PROJECT RULES
- **Boundary**: This universe is `./`. Never reference files outside it.
- **Isolation**: `src/` is the product. `agents/` is for autonomous bots (DO NOT TOUCH unless asked).
- **Secrets**: API keys belong in `docs/secrets.example`. Never commit them.
- **Source**: All product code lives in `src/`. Views in `src/views/`, components in `src/components/`.

## WORKFLOW
1. **Start**: Read STATUS.md → know the `ACTIVE FOCUS`.
2. **Act**: Make small, focused changes.
3. **Log**: Append result to LOG.md. (e.g., `echo "DATE | ACTION | Details" >> LOG.md`)
4. **Update**: Rewrite STATUS.md with new `ACTIVE FOCUS`.

## QUICK COMMANDS
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Production build |
| `./ops/checkpoint.sh "msg"` | Git commit with logging |

## TECH STACK
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Backend**: Vercel Serverless + N8N (nioctibinu.online)
- **Database**: Supabase
- **Payments**: Stripe
- **Live Site**: cleanupbros.com.au

## DESIGN SYSTEM
```css
Colors: #0066CC (primary), #2997FF (accent), #30D158 (success), #FFD60A (gold)
Containers: max-w-7xl (content), max-w-5xl (hero), max-w-2xl (forms)
Effects: Ken Burns 20s, glassmorphism, sparkles
```

## KEY FILES
| File | Purpose |
|------|---------|
| `src/views/LandingViewNew.tsx` | Main landing page |
| `src/views/*View.tsx` | All page components |
| `src/components/` | Reusable UI components |
| `public/images/` | Static images |

## SKILLS (Check Before Tasks)

Before starting work, check if a skill applies. Skills are in `docs/skills/`.

| Trigger | Skill | What It Does |
|---------|-------|--------------|
| "done", "end session" | `done-for-day.md` | Updates STATUS.md, LOG.md, commits to GitHub |
| "deploy", "go live" | `deploy.md` | Deploy to cleanupbros.com.au via Vercel |
| "bug", "error", "fix" | `bug-fix.md` | Debug and fix issues |

**Full index:** `docs/skills/SKILLS_INDEX.md`

---

## BUSINESS CONTEXT
- **Company**: Clean Up Bros
- **Location**: Liverpool, NSW (Western Sydney)
- **Services**: Residential, Commercial, End-of-Lease, Airbnb
- **Phone**: +61 406 764 585
- **Email**: cleanupbros.au@gmail.com

---
*Sealed Universe Protocol v1.0 | January 21, 2026*
