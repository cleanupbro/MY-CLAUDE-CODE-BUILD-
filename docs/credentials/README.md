# API Credentials Index

*Last Updated: January 22, 2026*

This document indexes all API credentials used by Clean Up Bros without exposing sensitive values.

---

## Active APIs

| Service | Purpose | Environment Variable | Status |
|---------|---------|---------------------|--------|
| **Supabase** | Database & Auth | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Production |
| **Stripe** | Payments | `VITE_STRIPE_PUBLISHABLE_KEY` | Live |
| **Square** | Invoicing | `VITE_SQUARE_APPLICATION_ID` | Production |
| **Google AI** | Gemini Chat | `VITE_GEMINI_API_KEY` | Active |
| **N8N** | Workflow Automation | `N8N_BASE_URL`, `N8N_API_KEY` | Active |

---

## Credential Locations

| Environment | File | Git Tracked |
|-------------|------|-------------|
| Local Development | `.env.local` | No (gitignored) |
| Vercel Production | Vercel Dashboard > Settings > Environment Variables | N/A |
| Backup | `/Users/shamalkrishna/Documents/cleanupbros-os/.secrets/API_KEYS.md` | No |

---

## N8N Workflows (nioctibinu.online)

### Clean Up Bros Workflows (14 total)
- `49xi6gSdDwMlcHmj` - ROI Calculator (OPTIMIZED)
- `BhC9oeocD3MLWDRK` - AI Chat Widget (Gemini)
- `FO3EBleUNJlLkscB` - Outbound Sales Caller (ElevenLabs)
- `Qw5wXjnkwktS7C9e` - Booking Confirmation & Reminders
- `TWo7Fvva39DKed5t` - Accounting Logger
- `UkiGz64ysmifd3q9` - Review Request Automator
- `WMPRz55gvZx9ePOb` - SMS Follow-up (Twilio)
- `aK91nwonDiEdNLxQ` - Inbound Call Agent (ElevenLabs)
- `b3OulillXkWze5nK` - Payment Link + Notifications
- `j4xK5E8kdx8OC1Is` - Gift Card System
- `nHp2wFED5I6iW8fT` - Telegram Assistant
- `pw5VQWwoNYQ2IAdQ` - Email Follow-Up Automator

### Webhook Endpoints
All quotes submit to: `https://nioctibinu.online/webhook/clean-up-bros-roi`

---

## Adding New Credentials

1. Add to `.env.local` for local development
2. Add to Vercel Dashboard for production
3. Update this README with the new service
4. Prefix with `VITE_` if needed in frontend code

---

## Security Notes

- Never commit `.env.local` to git
- Rotate API keys quarterly
- Use environment-specific keys (test/live)
- Keep backup in secure location (cleanupbros-os/.secrets/)
