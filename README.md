# Clean Up Bros Website

> Professional cleaning services website for Liverpool & Western Sydney
> Live at: https://cleanupbros.com.au

---

## Current Progress

> **Last Session:** January 22, 2026
> **Phase:** Phase 0 - Backend SaaS Build Foundation
> **Status:** In Progress

### What Was Done
- Organized 13 API skill files (Stripe, Supabase, N8N, etc.)
- Copied skills to master directory for cross-project use
- Added Skill Protocol to CLAUDE.md and GEMINI.md
- Updated SKILLS_INDEX.md with all API skills
- Implemented persistent context system (startup/shutdown protocols)

### Next Session Focus
- [ ] Continue Phase 1: Database schema design
- [ ] Supabase table structure for bookings
- [ ] Payment integration testing

### Active Files
- `CLAUDE.md` - AI protocol with skill system
- `docs/skills/` - 17 skill files (4 core + 13 API)
- `src/services/` - Backend service files

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Opens at localhost:3000

# Build for production
npm run build
```

---

## Project Structure

```
./
├── STATUS.md              # Current state (READ FIRST)
├── PLAN.md                # Roadmap & phases
├── LOG.md                 # Session history
├── CLAUDE.md              # AI protocol (Claude)
├── GEMINI.md              # AI protocol (Gemini)
│
├── src/                   # React application
│   ├── views/             # Page components
│   ├── components/        # Reusable UI
│   ├── services/          # API services
│   └── lib/               # Utilities
│
├── public/                # Static assets
│   ├── images/            # Before-after photos
│   ├── logo.png           # Main logo
│   └── sitemap.xml        # SEO
│
├── api/                   # Vercel serverless functions
│   └── webhooks/          # N8N webhook handlers
│
├── docs/                  # Documentation
│   ├── skills/            # AI skill files
│   ├── media/             # Business assets (logos, ads)
│   ├── _legacy_memory/    # Archived old memory system
│   └── _legacy_AI/        # Archived old AI workspace
│
├── index.html             # Vite entry
├── package.json           # Dependencies
├── vite.config.ts         # Build config
├── tailwind.config.js     # CSS config
└── tsconfig.json          # TypeScript config
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | Frontend framework |
| TypeScript | Type safety |
| Vite | Build tool |
| TailwindCSS | Styling |
| Supabase | Database & Auth |
| Stripe | Payments |
| Vercel | Hosting |
| N8N | Automation (nioctibinu.online) |

---

## Design System

```css
/* Colors */
Primary:    #0066CC
Accent:     #2997FF
Success:    #30D158
Gold:       #FFD60A

/* Containers */
Content:    max-w-7xl
Hero:       max-w-5xl
Forms:      max-w-2xl

/* Effects */
Ken Burns animation: 20s
Glassmorphism backgrounds
Sparkle decorations
```

---

## Protocol Files (Sealed Universe)

This project uses the **Sealed Universe Protocol** for AI-assisted development.

| File | Purpose |
|------|---------|
| `STATUS.md` | Current state - READ THIS FIRST |
| `PLAN.md` | Roadmap and build status |
| `LOG.md` | Chronological history |
| `CLAUDE.md` | Protocol for Claude AI |
| `GEMINI.md` | Protocol for Gemini AI |

### How It Works

1. AI reads `STATUS.md` to understand current state
2. AI checks `PLAN.md` for roadmap context
3. AI reviews `LOG.md` for recent history
4. AI makes changes and logs to `LOG.md`
5. AI updates `STATUS.md` with new focus

---

## Skills

Skills are reusable procedures in `docs/skills/`. See `docs/skills/SKILLS_INDEX.md` for full list.

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `done-for-day.md` | "done", "end session" | End-of-session backup |
| `deploy.md` | "deploy", "go live" | Deploy to production |
| `bug-fix.md` | "bug", "error", "fix" | Debug issues |

---

## Deployment

Changes pushed to `main` branch auto-deploy via Vercel.

```bash
# Manual deploy process
npm run build              # Verify build passes
git add -A                 # Stage changes
git commit -m "message"    # Commit
git push origin main       # Push (triggers Vercel)
```

---

## Business Context

- **Company**: Clean Up Bros
- **Location**: Liverpool, NSW 2170 (Western Sydney)
- **Services**: Residential, Commercial, End-of-Lease, Airbnb
- **Phone**: +61 406 764 585
- **Email**: cleanupbros.au@gmail.com
- **ABN**: 26 443 426 374

---

## Migration Notes (January 21, 2026)

### What Changed

1. **Sealed Universe Protocol** - New AI context system
   - Replaced old `memory/` folder with `STATUS.md`, `PLAN.md`, `LOG.md`
   - Replaced old `_AI/` folder with `CLAUDE.md`, `GEMINI.md`

2. **Directory Cleanup**
   - Moved `memory/` → `docs/_legacy_memory/`
   - Moved `_AI/` → `docs/_legacy_AI/`
   - Moved `media/` → `docs/media/`
   - Moved business assets from `public/cleanupbrosbible.md/` → `docs/media/`
   - Removed empty `ops/`, `agents/`, `system/` folders

3. **Skills System**
   - Created `docs/skills/` with reusable procedures
   - Added `done-for-day.md`, `deploy.md`, `bug-fix.md`

### What Stayed the Same

- All source code in `src/` unchanged
- Build process unchanged (`npm run dev`, `npm run build`)
- Deployment unchanged (Vercel auto-deploy)
- All integrations (Supabase, Stripe, N8N) unchanged

---

## License

Private - Clean Up Bros Pty Ltd

---

*Last updated: January 22, 2026*
