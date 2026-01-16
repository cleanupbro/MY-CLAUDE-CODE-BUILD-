# MEMORY.md - Workspace State
## Clean Up Bros

**Last Updated:** January 16, 2026
**Updated By:** Claude Code (Workspace Restructure)

---

## CURRENT STATE

```yaml
Build Status: PASSING
Last Build: January 7, 2026
Modules: 710
Build Time: 3.27s

Live Site: https://cleanupbros.com.au
Status: OPERATIONAL
```

---

## VERSION HISTORY

| Date | Version | Change | By |
|------|---------|--------|-----|
| Jan 16, 2026 | 2.0.0 | Boris Standard restructure - AI.md, skills/, .secrets/ | Claude Code |
| Jan 7, 2026 | 1.5.0 | Full system validation, Supabase fix, GEMINI.md | Claude Code |
| Jan 3, 2026 | 1.4.0 | Million dollar redesign + SEO | Claude Code |
| Jan 1, 2026 | 1.3.0 | MCP supercharge, 10 servers installed | Claude Code |
| Jan 1, 2026 | 1.2.0 | SKILLS.md created with 24 skills | Claude Code |
| Dec 31, 2025 | 1.1.0 | Migrated to cubs.md workspace | Claude Code |

---

## LESSONS LEARNED

Track mistakes so they're NEVER repeated:

| Date | Issue | Solution | Prevention |
|------|-------|----------|------------|
| Jan 7, 2026 | Supabase key invalid format | Get JWT from dashboard API settings | Always use JWT format keys (start with eyJ) |
| Jan 3, 2026 | Build failed on deployment | Fixed TypeScript errors before push | Always run `npm run build` before deploy |
| Dec 28, 2025 | Webhook 500 error | N8N workflow was inactive | Always check workflow status in N8N dashboard |

---

## SKILLS ACQUIRED

Patterns and techniques learned in this project:

```yaml
- API Proxy pattern for hiding webhook URLs in production
- Lazy loading views with React.lazy() and Suspense
- Graceful fallback when Supabase is not configured
- Dual AI config files for seamless AI handoff
- Boris Standard: Single entry point architecture
- Auto-invoke skills on keyword triggers
```

---

## ERROR LOG

| Date | Error | File | Fix Applied | Status |
|------|-------|------|-------------|--------|
| Jan 7, 2026 | Supabase anon key invalid | .env.local | Updated with JWT from dashboard | RESOLVED |

---

## WEBHOOK STATUS

Last verified: January 7, 2026

| Webhook | Status | Endpoint |
|---------|--------|----------|
| Residential | WORKING | /webhook/98d35453-... |
| Commercial | WORKING | /webhook/bb5fdb61-... |
| Airbnb | WORKING | /webhook/5d3f6ff4-... |
| Jobs | NOT TESTED | /webhook/67f764f2-... |
| Feedback | NOT TESTED | /webhook/client-feedback |

---

## DEPENDENCIES

```yaml
Core:
  - react: 19.x
  - typescript: 5.x
  - vite: 6.x
  - tailwindcss: 4.x

Packages: 204 total
Vulnerabilities: 1 critical (non-blocking)
```

---

## SELF-CONTAINMENT RULES

This workspace is 100% self-contained:

1. **ZERO external references** - No links to _CENTRAL/, claude-global/, etc.
2. **All keys in .secrets/** - Never reference external key files
3. **All skills in skills/** - Complete skill library here
4. **All context in AI_CONFIG/** - Business info, pricing, webhooks

If you need something, it's IN this folder.

---

## AUTO-UPDATE RULE

**CRITICAL: After EVERY action, the sync skill runs automatically.**

The sync skill (skills/sync.md):
1. Updates MEMORY.md with current state
2. Logs any errors
3. Updates HANDOFF.md if session ending
4. Keeps all files synchronized

This ensures perfect memory continuity between sessions.

---

*Last synced: January 16, 2026*
*Build: PASSING | Site: LIVE | Memory: SYNCED*
