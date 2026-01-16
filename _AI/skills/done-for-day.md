# done-for-day.md - End Session Skill
## Clean Up Bros

**Trigger:** "done for today", ":bye:", "end session", "save and quit"
**Purpose:** Full session backup, update all memory files, GitHub push

---

## WHEN TO USE

When user is ending their session and wants to:
- Save all progress
- Update memory files
- Backup to GitHub
- Create handoff for next session

---

## WORKFLOW

### Step 1: Final Sync
```yaml
Run sync.md one last time:
- Update MEMORY.md current state
- Log any pending errors
- Update VERSION HISTORY if significant changes
```

### Step 2: Update HANDOFF.md
```yaml
Write to HANDOFF.md:
- Last Updated: [current date]
- Last Session By: [Claude Code / Gemini]

COMPLETED THIS SESSION:
- [List everything accomplished]

IN PROGRESS:
- [Anything left unfinished]

BLOCKED:
- [Any blockers encountered]

NEXT SESSION PRIORITIES:
1. [First thing to do next time]
2. [Second priority]
3. [Third priority]
```

### Step 3: Update TASKS.md
```yaml
Move completed tasks to COMPLETED RECENTLY section
Update status of in-progress tasks
Add any new discovered tasks to BACKLOG
```

### Step 4: GitHub Backup (if requested)
```yaml
Commands:
git add .
git commit -m "Session backup: [brief summary]"
git push origin main
```

### Step 5: Show Summary
```yaml
Display to user:

SESSION SAVED!

Date: [Date]
Duration: ~[X] minutes

ACCOMPLISHED:
- [Task 1]
- [Task 2]

IN PROGRESS:
- [Unfinished item]

NEXT TIME:
1. [First action]
2. [Second action]

Files Updated:
- MEMORY.md
- HANDOFF.md
- TASKS.md
[- GitHub (if backed up)]

See you next time!
```

---

## CHECKLIST

Before ending session:
- [ ] MEMORY.md is up to date
- [ ] HANDOFF.md has full context for next session
- [ ] TASKS.md reflects current state
- [ ] GitHub backup (if significant changes)
- [ ] Summary shown to user

---

## IMPORTANT

This skill ensures ZERO context loss between sessions.
The next AI (Claude, Gemini, or any other) will be able to:
1. Read AI.md
2. Read HANDOFF.md
3. Continue EXACTLY where you left off

Never skip this skill when ending a session.

---

*End of session. Memory preserved. Ready for next AI.*
