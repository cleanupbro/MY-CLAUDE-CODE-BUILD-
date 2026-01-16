# CONFIG.md - Clean Up Bros AI Workspace
## The Perfect AI Workspace

**Philosophy:** Any AI opens `_AI/`, reads this file, and knows EVERYTHING.

---

## IDENTITY

```yaml
Project: Clean Up Bros Quote Portal
Business: Cleaning services company
Location: Liverpool, NSW (Western Sydney hub)
Live URL: https://cleanupbros.com.au
GitHub: https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD-.git
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

## WORKSPACE STRUCTURE

```
clean-up-bros/
├── _AI/ ......................... AI WORKSPACE (you are here)
│   ├── CONFIG.md ................ This file - main entry point
│   ├── MEMORY.md ................ Workspace state & history
│   ├── HANDOFF.md ............... Session continuity
│   ├── TASKS.md ................. Work queue
│   ├── config/
│   │   ├── UNIVERSAL.md ......... Business context, pricing, webhooks
│   │   ├── CLAUDE.md ............ Claude-specific behavior
│   │   └── GEMINI.md ............ Gemini-specific behavior
│   ├── secrets/
│   │   └── KEYS.md .............. All API keys (gitignored)
│   ├── skills/ .................. Auto-invoke skills (10 files)
│   ├── directives/ .............. SOPs (4 files)
│   ├── executors/ ............... Bash scripts (2 files)
│   └── _archive/ ................ Old config files
├── src/ ......................... React app
├── public/ ...................... Static assets
├── api/ ......................... Vercel serverless functions
├── package.json
├── vite.config.ts
└── [other dev files]
```

---

## SESSION WORKFLOW

### On Start
```yaml
1. Read _AI/CONFIG.md (this file) - Get full context
2. Read _AI/HANDOFF.md - What happened last session
3. Read _AI/TASKS.md - What needs to be done
4. Continue from where previous AI left off
```

### On Every Change
```yaml
1. SYNC skill auto-triggers (_AI/skills/sync.md)
2. Update _AI/MEMORY.md with current state
3. Log any errors to MEMORY.md errors section
```

### On End
```yaml
1. Update _AI/MEMORY.md - Current state
2. Update _AI/HANDOFF.md - What's in progress, what's next
3. GitHub backup if requested
```

---

## TECH STACK

```yaml
Frontend: Vite + React 19 + TypeScript + Tailwind CSS
Backend: N8N at nioctibinu.online
Database: Supabase
Payments: Stripe (live) + Square
Hosting: Vercel (auto-deploy on push)
Domain: cleanupbros.com.au (GoDaddy → Vercel)
```

---

## DESIGN SYSTEM

### Colors
```css
--brand-teal: #008080     /* Primary - buttons, focus */
--brand-gold: #F2B705     /* Accent - prices, highlights */
--brand-navy: #0B2545     /* Hero backgrounds */
--brand-navy-light: #134074 /* Gradients */
--success-green: #28A745  /* Success states */
--error-red: #DC3545      /* Error states */
```

### Component Patterns
```tsx
// Hero Section
<section className="relative min-h-[60vh] bg-gradient-to-br from-[#0B2545] via-[#134074] to-[#0B2545]">

// Primary Button
<button className="btn-primary">Get Quote</button>
```

---

## SKILLS (Auto-Invoke)

Skills trigger automatically based on keywords. Full list in `_AI/skills/SKILLS_INDEX.md`

| Trigger Words | Skill | Action |
|---------------|-------|--------|
| "quote", "price" | pricing.md | Calculate cleaning quotes |
| "deploy", "push" | deploy.md | Build and deploy |
| "bug", "fix", "error" | bug-fix.md | Debug issues |
| "feature", "add" | new-feature.md | Implement features |
| "test", "verify" | testing.md | Run tests |
| "backup", "commit" | backup.md | Git push |
| "done for today" | done-for-day.md | End session |

### Always Active (Implicit)
- **sync.md** - Runs AFTER every action
- **code-review.md** - Runs BEFORE every commit

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
| Full business context | _AI/config/UNIVERSAL.md |
| Pricing tables | _AI/config/UNIVERSAL.md |
| N8N webhooks | _AI/config/UNIVERSAL.md |
| API keys | _AI/secrets/KEYS.md |
| Current state | _AI/MEMORY.md |
| Last session | _AI/HANDOFF.md |
| Work queue | _AI/TASKS.md |
| Skills | _AI/skills/ |

---

## RULES

1. **Read this file first** - Contains all entry points
2. **Auto-sync enabled** - Every change triggers sync.md
3. **Never hardcode secrets** - Use _AI/secrets/KEYS.md
4. **Test before deploy** - Run `npm run build`
5. **Update memory** - Before ending session
6. **Plan before building** - Explain steps, get approval

---

## MAGIC COMMANDS

| Command | Action |
|---------|--------|
| "done for today" | Full save, backup, session end |
| "backup" | GitHub commit and push |
| "deploy" | Build + push to production |
| "status" | Show current state |

---

*Clean Up Bros - Making Your Space Shine*
*The Boris Standard: Any AI. One folder. 100% Context.*
