# Skills Index

> Quick reference for all available skills in this project
> Location: `docs/skills/`

---

## Available Skills

| Skill | Trigger Words | Purpose |
|-------|---------------|---------|
| `done-for-day.md` | "done", "done for the day", "end session" | End-of-session backup: updates STATUS.md, LOG.md, commits to GitHub |
| `deploy.md` | "deploy", "go live", "ship it" | Deploy changes to cleanupbros.com.au via Vercel |
| `bug-fix.md` | "error", "bug", "broken", "fix" | Debug and fix issues in the application |

---

## How to Use Skills

1. **Check this index** when starting a task
2. **Read the skill file** if it matches your task
3. **Follow the steps** in the skill
4. **Update LOG.md** after completing the skill

---

## Skill Quick Reference

### done-for-day.md
**When:** End of session, saving work
**Does:**
- Displays session summary
- Updates STATUS.md with next focus
- Appends to LOG.md
- Commits and pushes to GitHub

### deploy.md
**When:** Ready to push changes live
**Does:**
- Runs build verification
- Commits changes
- Pushes to GitHub (triggers Vercel)
- Updates protocol files

### bug-fix.md
**When:** Something is broken
**Does:**
- Guides through debugging process
- Identifies common issues
- Documents fix in LOG.md
- Provides rollback instructions

---

## Adding New Skills

1. Create `docs/skills/[skill-name].md`
2. Follow the template structure:
   - Triggers
   - Pre-flight checks
   - Steps
   - Verification
   - Success message
3. Add to this index

---

## Protocol Files That Reference Skills

- `CLAUDE.md` - Lists skills for coding tasks
- `GEMINI.md` - Lists skills for strategic tasks

---

*Skills help maintain consistency across sessions and AI assistants.*
