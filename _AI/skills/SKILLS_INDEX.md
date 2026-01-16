# SKILLS_INDEX.md - Auto-Invoke Registry
## Clean Up Bros Skills

**Total Skills:** 10
**Last Updated:** January 16, 2026

---

## HOW AUTO-INVOKE WORKS

When the AI detects trigger words in user input, the corresponding skill auto-loads.
No manual invocation needed.

---

## ALWAYS ACTIVE (Implicit)

These skills run automatically without being asked:

| Skill | Trigger | Purpose |
|-------|---------|---------|
| **sync.md** | AFTER every action | Update MEMORY.md, keep state synced |
| **code-review.md** | BEFORE every commit | Review code quality |

**sync.md is CRITICAL** - It ensures no context is ever lost between sessions.

---

## KEYWORD-TRIGGERED SKILLS

| Trigger Words | Skill File | Purpose |
|---------------|------------|---------|
| "quote", "price", "cost", "estimate" | pricing.md | Calculate cleaning quotes |
| "deploy", "push", "production", "live" | deploy.md | Build and deploy to Vercel |
| "bug", "fix", "error", "broken", "issue" | bug-fix.md | Debug and resolve issues |
| "feature", "add", "build", "implement", "create" | new-feature.md | Implement new functionality |
| "test", "verify", "check", "validate" | testing.md | Run tests and verify |
| "backup", "save", "commit", "git" | backup.md | Git commit and push |
| "done for today", ":bye:", "end session" | done-for-day.md | End session, full backup |

---

## SKILL FILES

```
skills/
├── SKILLS_INDEX.md ....... This file (registry)
├── sync.md ............... Auto-sync after every action
├── done-for-day.md ....... End session workflow
├── deploy.md ............. Build and deploy
├── code-review.md ........ Review before commits
├── bug-fix.md ............ Debug issues
├── new-feature.md ........ Build features
├── testing.md ............ Run tests
├── backup.md ............. Git backup
└── pricing.md ............ Calculate quotes (CUBS-specific)
```

---

## SKILL EXECUTION ORDER

When multiple skills could apply:
1. **sync.md** - Always runs last (after action completes)
2. **code-review.md** - Runs before backup.md/deploy.md
3. **Other skills** - Run in order they were triggered

---

## ADDING NEW SKILLS

To add a new skill:
1. Create `skills/[skill-name].md`
2. Add entry to this index
3. Define trigger words
4. Document the workflow

---

## SKILL TEMPLATE

```markdown
# [skill-name].md - [Brief Description]
## Clean Up Bros

**Trigger:** [What triggers this skill]
**Purpose:** [What it does]

---

## WHEN TO USE

[When this skill applies]

---

## WORKFLOW

[Step-by-step execution]

---

## CHECKLIST

[ ] Step 1
[ ] Step 2
[ ] Step 3

---

*Auto-invoked by skills/SKILLS_INDEX.md*
```

---

*Skills auto-invoke on keyword triggers*
*sync.md runs after EVERY action*
