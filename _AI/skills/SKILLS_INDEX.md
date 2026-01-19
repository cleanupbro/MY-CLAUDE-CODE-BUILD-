# SKILLS_INDEX.md - Auto-Invoke Registry
## Clean Up Bros Skills

**Total Skills:** 11
**Last Updated:** January 19, 2026

---

## HOW AUTO-INVOKE WORKS

When the AI detects trigger words in user input, the corresponding skill auto-loads.
No manual invocation needed.

---

## ALWAYS ACTIVE (Implicit)

These skills run automatically without being asked:

| Skill | Trigger | Purpose |
|-------|---------|---------|
| **sync.md** | AFTER every action | Update memory files, keep state synced |
| **code-review.md** | BEFORE every commit | Review code quality |

**sync.md is CRITICAL** - It ensures no context is ever lost between sessions.

---

## KEYWORD-TRIGGERED SKILLS

| Trigger Words | Skill File | Purpose |
|---------------|------------|---------|
| "handoff", "done for today", ":bye:", "end session" | handoff.md | Session handoff, update all memory files |
| "quote", "price", "cost", "estimate" | pricing.md | Calculate cleaning quotes |
| "deploy", "push", "production", "live" | deploy.md | Build and deploy to Vercel |
| "bug", "fix", "error", "broken", "issue" | bug-fix.md | Debug and resolve issues |
| "feature", "add", "build", "implement", "create" | new-feature.md | Implement new functionality |
| "test", "verify", "check", "validate" | testing.md | Run tests and verify |
| "backup", "save", "commit", "git" | backup.md | Git commit and push |
| "summarize", "sticky note" | sticky-notes.md | Create token-saving summaries |

---

## SKILL FILES

```
skills/
├── SKILLS_INDEX.md ....... This file (registry)
├── handoff.md ............ Session handoff (NEW)
├── sticky-notes.md ....... Token-saving summaries (NEW)
├── sync.md ............... Auto-sync after every action
├── done-for-day.md ....... End session workflow
├── deploy.md ............. Build and deploy
├── code-review.md ........ Review before commits
├── bug-fix.md ............ Debug issues
├── new-feature.md ........ Build features
├── testing.md ............ Run tests
├── backup.md ............. Git backup
└── pricing.md ............ Calculate quotes
```

---

## SKILL EXECUTION ORDER

When multiple skills could apply:
1. **sync.md** - Always runs last (after action completes)
2. **code-review.md** - Runs before backup.md/deploy.md
3. **Other skills** - Run in order they were triggered

---

## NEW SKILLS ADDED (Jan 19, 2026)

### handoff.md
- **Triggers:** "handoff", "done for today", ":bye:", "end session"
- **Purpose:** Session continuity between Claude and Gemini
- **Actions:** Updates memory/handoff.md, memory/session-log.md

### sticky-notes.md
- **Triggers:** "summarize", "sticky note"
- **Purpose:** Create README summaries to avoid re-reading large files
- **Actions:** Creates token-saving summaries for files > 100 lines

---

## ADDING NEW SKILLS

To add a new skill:
1. Create `skills/[skill-name].md`
2. Add entry to this index
3. Define trigger words
4. Document the workflow

---

*Skills auto-invoke on keyword triggers*
*Updated: January 19, 2026*
