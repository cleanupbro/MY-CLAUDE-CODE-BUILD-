# PROJECT BLUEPRINT: Clean Up Bros

## BUILD STATUS
| Component | Status | Description |
| :--- | :--- | :--- |
| **Fuselage** (Core) | Live | React 19 + Vite + TailwindCSS |
| **Wings** (Features) | Live | Quotes, Contracts, Gift Cards, Admin |
| **Engines** (Auto) | Partial | N8N at nioctibinu.online |
| **Cockpit** (Memory) | Live | Sealed Universe Protocol |

## ROADMAP
- [x] Phase 0: Sealed Universe Setup (Jan 21, 2026)
- [x] Phase 1: Visual Overhaul (Jan 19, 2026)
- [ ] Phase 2: Database (Supabase quote storage)
- [ ] Phase 3: Backend (N8N workflow automation)
- [ ] Phase 4: AI Agents (autonomous bots in `agents/`)

## ARCHITECTURE
```
./
├── src/           # React application (80+ files)
├── public/        # Static assets
├── api/           # Vercel serverless functions
├── docs/          # Knowledge base & legacy archives
├── agents/        # Autonomous bots (future)
├── ops/           # Operations scripts
├── STATUS.md      # Current state (read first!)
├── PLAN.md        # This file
├── LOG.md         # Session history
├── CLAUDE.md      # Claude protocol
└── GEMINI.md      # Gemini protocol
```

## INTEGRATIONS
| Service | Purpose | Status |
|---------|---------|--------|
| Supabase | Database & Auth | Connected |
| Stripe | Payments | Connected |
| N8N | Automation | nioctibinu.online |
| Vercel | Hosting | cleanupbros.com.au |
| Google AI | Assistant | Configured |

## BUSINESS CONTEXT
- **Company**: Clean Up Bros
- **Location**: Liverpool, NSW (Western Sydney)
- **Services**: Residential, Commercial, End-of-Lease, Airbnb
- **Phone**: +61 406 764 585
- **Email**: cleanupbros.au@gmail.com
