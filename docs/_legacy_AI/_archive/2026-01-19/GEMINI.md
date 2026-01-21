# GEMINI.md - Gemini-Specific Config
## Clean Up Bros

**AI:** Gemini / Antigravity
**Entry Point:** Read AI.md first, then this file

---

## CRITICAL: AUTO-UPDATE SKILL

**AFTER EVERY ACTION, you MUST trigger the sync skill.**

```yaml
Location: skills/sync.md
Trigger: Automatically after ANY code change, file edit, or command
Purpose: Keep MEMORY.md and HANDOFF.md synchronized

After every action:
1. Check if files changed
2. Update MEMORY.md current state
3. Log any errors to MEMORY.md errors section
4. If session ending, update HANDOFF.md
```

This ensures perfect memory continuity. NEVER skip this.

---

## GEMINI-SPECIFIC BEHAVIOR

### Communication Style
```yaml
- Clear, helpful, friendly
- Explain technical concepts simply
- Provide code examples when helpful
- Ask clarifying questions when needed
- Be proactive about potential issues
```

### Before Any Task
```yaml
1. Read AI.md for context
2. Read HANDOFF.md for last session state
3. Read TASKS.md for work queue
4. Plan the approach
5. Execute step by step
6. Sync after each change
```

### Code Preferences
```yaml
- TypeScript for all new code
- React 19 functional components
- Tailwind CSS for styling
- Follow existing patterns in codebase
- Always test builds before deploying
```

---

## SKILL AUTO-INVOKE

When you see these keywords, auto-trigger the corresponding skill:

| Keywords | Skill File | Action |
|----------|------------|--------|
| "quote", "price", "cost" | skills/pricing.md | Calculate quote |
| "deploy", "push", "production" | skills/deploy.md | Build and deploy |
| "bug", "fix", "error", "broken" | skills/bug-fix.md | Debug issue |
| "feature", "add", "build", "implement" | skills/new-feature.md | Build feature |
| "test", "verify", "check" | skills/testing.md | Run tests |
| "backup", "save", "commit" | skills/backup.md | Git backup |
| "done for today", ":bye:" | skills/done-for-day.md | End session |

### Always Active (Implicit)
| Skill | Trigger |
|-------|---------|
| skills/sync.md | AFTER every action |
| skills/code-review.md | BEFORE every commit |

---

## SESSION COMMANDS

| Command | Action |
|---------|--------|
| "done for today" | Run done-for-day.md, full backup |
| ":bye:" | Same as above |
| "backup" | Run backup.md, git push |
| "deploy" | Run deploy.md, build + push |
| "status" | Read MEMORY.md, show current state |
| "what's next" | Read TASKS.md |
| "what happened last time" | Read HANDOFF.md |

---

## HANDOFF FROM CLAUDE

When continuing from a Claude session:
```yaml
1. Read AI.md - Get full context
2. Read HANDOFF.md - See what Claude did
3. Read MEMORY.md - Current state
4. Read TASKS.md - Work queue
5. Continue from where Claude left off
6. Keep same conventions and patterns
```

---

## WORKSPACE RULES

1. **Self-contained** - Everything is in this folder, no external refs
2. **API keys** - Always use .secrets/KEYS.md
3. **Memory sync** - Update MEMORY.md after every action
4. **Test first** - Run `npm run build` before deploy
5. **Plan first** - Explain approach before building
6. **Log errors** - Add to MEMORY.md errors section
7. **Never forget** - Update HANDOFF.md before session end

---

## ERROR HANDLING

When an error occurs:
```yaml
1. Capture error message and file/line
2. Log to MEMORY.md ERROR LOG section
3. Check if error has occurred before
4. Apply fix or ask for help
5. Add lesson to LESSONS LEARNED if new
```

---

## BEFORE ENDING SESSION

Checklist:
```yaml
[ ] Run sync.md one final time
[ ] Update MEMORY.md with current state
[ ] Update HANDOFF.md with:
    - What was accomplished
    - What's in progress
    - What's next
[ ] Commit to GitHub if significant changes
[ ] Show user summary of session
```

---

*Gemini configuration for Clean Up Bros*
*Seamless handoff from Claude enabled*
*Auto-sync enabled - memory never lost*
