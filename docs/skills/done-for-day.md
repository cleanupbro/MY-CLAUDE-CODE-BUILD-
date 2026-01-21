# Done For The Day Skill

> End-of-session protocol for Sealed Universe - updates STATUS.md, LOG.md, commits to GitHub
> Priority: CRITICAL

---

## Triggers

Say any of these to run the full backup routine:
- "done for the day"
- "done for today"
- "done"
- "save everything"
- "end session"

---

## What Happens Automatically

```
1. DISPLAY SESSION SUMMARY
   └── Visual summary box (before anything else)

2. UPDATE PROTOCOL FILES
   ├── STATUS.md → New Active Focus for next session
   ├── LOG.md → Append session completion entry
   └── PLAN.md → Update completed phases if any

3. STAGE ALL CHANGES
   └── git add -A

4. COMMIT WITH SESSION SUMMARY
   └── git commit -m "session(YYYY-MM-DD): [summary]"

5. PUSH TO GITHUB
   └── git push origin main

6. CONFIRM BACKUP
   └── "Session saved. Commit: [hash]"
```

---

## Visual Session Summary

**Display this FIRST before any git operations:**

```
╔══════════════════════════════════════════════════════════════╗
║                    SESSION COMPLETE                          ║
╠══════════════════════════════════════════════════════════════╣
║ Project: Clean Up Bros                                       ║
║ Date: [YYYY-MM-DD]                                          ║
╠══════════════════════════════════════════════════════════════╣
║ WHAT WE DID:                                                 ║
║ ├── 1. [action 1]                                           ║
║ ├── 2. [action 2]                                           ║
║ └── 3. [action n]                                           ║
╠══════════════════════════════════════════════════════════════╣
║ FILES CHANGED: [count]                                       ║
╠══════════════════════════════════════════════════════════════╣
║ NEXT SESSION:                                                ║
║ └── [what to pick up next]                                  ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Step-by-Step Protocol

### 1. Update STATUS.md

Replace contents with:

```markdown
# STATUS: Clean Up Bros
*Last Sync: [TODAY'S DATE]*

## ACTIVE FOCUS
- **Current Task**: [What to do next session]
- **Working In**: [Last folder/file worked on]
- **Blockers**: [Any blockers or "None"]

## SESSION CONTEXT
- **Phase**: [Current phase from PLAN.md]
- **Tech Stack**: React 19 + TypeScript + Vite + Supabase + Stripe
- **Recent Change**: [Summary of this session's work]

## CRITICAL RULES
1. **Boundaries**: This folder is a sealed universe. No outside dependencies.
2. **Structure**: Product code lives in `src/`. Documentation in `docs/`.
3. **Memory**: Never trust chat history. Read this file first.

## QUICK COMMANDS
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Production build |

## LIVE SITE
- **URL**: https://cleanupbros.com.au
- **Backend**: N8N at nioctibinu.online
```

### 2. Append to LOG.md

Add this entry:

```
[DATE] | SESSION END | [Session summary - what was accomplished]
[DATE] | FILES | [List key files changed]
[DATE] | NEXT | [What to do next session]
```

### 3. Update PLAN.md (if phases completed)

Check off any completed roadmap items:
```markdown
- [x] Phase X: [Description] (Completed [DATE])
```

### 4. Git Operations

```bash
# Check status
git status

# Stage all
git add -A

# Commit with session summary
git commit -m "$(cat <<'EOF'
session(YYYY-MM-DD): [Session summary]

Changes:
- [bullet points of main changes]

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Push to GitHub
git push origin main
```

### 5. Confirm Success

Report:
```
✅ Session saved to GitHub
   Commit: [hash]
   Files: [count] changed
   Status: Synced

   Next session: Read STATUS.md first
```

---

## Example

**User says:** "done for the day"

**Claude displays:**

```
╔══════════════════════════════════════════════════════════════╗
║                    SESSION COMPLETE                          ║
╠══════════════════════════════════════════════════════════════╣
║ Project: Clean Up Bros                                       ║
║ Date: 2026-01-21                                            ║
╠══════════════════════════════════════════════════════════════╣
║ WHAT WE DID:                                                 ║
║ ├── 1. Implemented Sealed Universe Protocol                 ║
║ ├── 2. Consolidated business assets to docs/media/          ║
║ ├── 3. Created skills folder with done-for-day.md           ║
║ └── 4. Cleaned root directory to 14 items                   ║
╠══════════════════════════════════════════════════════════════╣
║ FILES CHANGED: 12                                            ║
╠══════════════════════════════════════════════════════════════╣
║ NEXT SESSION:                                                ║
║ └── Phase 2: Supabase database integration                  ║
╚══════════════════════════════════════════════════════════════╝

Saving to GitHub...
```

**Then:**
1. Updates STATUS.md with "Phase 2: Supabase" as next focus
2. Appends session entry to LOG.md
3. Commits: `session(2026-01-21): Sealed Universe Protocol + workspace cleanup`
4. Pushes to main
5. Reports: "Session saved. Commit abc1234. 12 files backed up."

---

## Why This Matters

| Problem | Solution |
|---------|----------|
| Context lost between sessions | STATUS.md tells next AI exactly what's happening |
| No record of work | LOG.md has chronological history |
| Forgot to commit | Auto-commits on "done for the day" |
| Work not backed up | Auto-pushes to GitHub |
| Different AI next time | Same protocol works for Claude or Gemini |

---

## Related Files

- `STATUS.md` - Current state (update this)
- `LOG.md` - History (append to this)
- `PLAN.md` - Roadmap (check off completed items)
- `CLAUDE.md` - Protocol for Claude
- `GEMINI.md` - Protocol for Gemini
