# handoff.md - Session Handoff & Auto-Logging Skill
## Clean Up Bros

**Trigger:** "handoff", "done for the day", "done for today", "save state", "end session", ":bye:"
**Auto-Trigger:** Hourly during active sessions, on plan creation/update
**Purpose:** Full session backup, update ALL memory files, ensure continuity for any AI

---

## WHEN TO USE

### Manual Triggers
- User says "handoff" or "done for the day"
- End of any work session
- Before switching to different AI (Claude ↔ Gemini)
- Before significant breaks

### Automatic Triggers
- Every hour during active session (session logging)
- When a plan is created or modified
- After completing major tasks
- Before any deployment

---

## CORE WORKFLOW

### Step 1: Update memory/handoff.md (ALWAYS FIRST)
```yaml
Update handoff.md with:
  Last Updated: [current datetime]
  Last AI: [Claude Code / Gemini]
  Status: [Active / Paused / Complete]

  Current Session:
    - What was accomplished
    - Files modified
    - Current state

  In Progress:
    - Active tasks
    - Pending items

  Next Session Priorities:
    1. First action
    2. Second action
    3. Third action
```

### Step 2: Update memory/state.md
```yaml
Update state.md with:
  Last Updated: [date]
  Status: [status]

  Active Work:
    - Current tasks
    - Progress percentage

  Recent Changes:
    - List of what changed

  Blockers:
    - Any blockers (or "None")
```

### Step 3: Update memory/changelog.md
```yaml
Append to changelog.md:
  ## [Date]
  - List of changes made this session
  - Features added
  - Bugs fixed
  - Files modified
```

### Step 4: Update memory/decisions.md (if applicable)
```yaml
If any architectural or significant decisions were made:
  ## [Date] - [Decision Title]
  Context: [Why this came up]
  Decision: [What was decided]
  Rationale: [Why this choice]
  Impact: [What it affects]
```

### Step 5: Update Plan File (if exists)
```yaml
If a plan file exists in ~/.claude/plans/:
  - Mark completed items as ✅
  - Update progress percentages
  - Add any new discovered tasks
  - Note blockers or changes
```

### Step 6: Sync CLAUDE.md and GEMINI.md
```yaml
Ensure both files contain:
  - Same project context
  - Same phase status
  - Same commands
  - Same structure references
  - Links to memory/handoff.md
```

### Step 7: Git Commit (optional but recommended)
```yaml
If significant changes:
  git add .
  git commit -m "Session: [brief summary]"
  # Don't push unless user requests
```

---

## HOURLY SESSION LOG

When auto-triggered hourly:

```yaml
Append to memory/session-log.md:
  ### [Time] - Hourly Update
  - Tasks completed: [list]
  - Currently working on: [task]
  - Files touched: [list]
  - Build status: [pass/fail]
```

---

## PLAN AUTO-UPDATE

When plans are created or modified:

```yaml
1. If new plan created:
   - Note plan location in handoff.md
   - Add plan reference to session log

2. If plan updated:
   - Mark completed tasks
   - Update progress indicators
   - Log changes to session-log.md
```

---

## FILES TO UPDATE

| File | Purpose | When to Update |
|------|---------|----------------|
| `memory/handoff.md` | Quick state for next AI | EVERY handoff |
| `memory/state.md` | Current project state | EVERY handoff |
| `memory/changelog.md` | History of changes | When changes made |
| `memory/decisions.md` | Design decisions | When decisions made |
| `memory/session-log.md` | Detailed session log | Hourly + end of session |
| `CLAUDE.md` | Claude context | When phases change |
| `GEMINI.md` | Gemini context | When phases change |
| `~/.claude/plans/*` | Plan files | When progress made |

---

## HANDOFF CHECKLIST

Before ending session:
- [ ] memory/handoff.md has complete context
- [ ] memory/state.md reflects current state
- [ ] memory/changelog.md updated (if changes made)
- [ ] Plan file progress updated
- [ ] CLAUDE.md and GEMINI.md in sync
- [ ] Build status noted
- [ ] Next priorities clear

---

## SESSION SUMMARY FORMAT

Display to user after handoff:

```
═══════════════════════════════════════════════════
SESSION SAVED
═══════════════════════════════════════════════════

Date: [Date]
AI: [Claude/Gemini]
Duration: ~[X] hours

ACCOMPLISHED:
  ✅ [Task 1]
  ✅ [Task 2]
  ✅ [Task 3]

IN PROGRESS:
  🔄 [Unfinished task]

NEXT SESSION:
  1. [First priority]
  2. [Second priority]

FILES UPDATED:
  • memory/handoff.md
  • memory/state.md
  • memory/session-log.md
  [• CLAUDE.md/GEMINI.md if updated]
  [• GitHub commit if requested]

Ready for handoff to any AI! 🤝
═══════════════════════════════════════════════════
```

---

## IMPORTANT NOTES

### For Claude
- Claude has full tool access, can update all files directly
- Use TodoWrite to track progress during session
- Read this skill's checklist before handoff

### For Gemini
- Gemini may have limited file access
- Focus on memory/handoff.md as primary state
- Keep updates concise and clear

### Cross-AI Compatibility
- Both AIs read the same memory files
- handoff.md is the SINGLE SOURCE OF TRUTH
- Keep language simple and unambiguous
- Avoid AI-specific references

---

## RECOVERY

If session starts and state is unclear:
1. Read memory/handoff.md first
2. Read memory/state.md for context
3. Check memory/session-log.md for recent history
4. Load plan file if referenced
5. Announce current understanding before proceeding

---

*This skill ensures ZERO context loss between sessions*
*Works for Claude Code, Gemini, or any future AI*
