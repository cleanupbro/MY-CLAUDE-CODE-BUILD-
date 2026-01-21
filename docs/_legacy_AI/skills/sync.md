# sync.md - Auto-Sync Skill
## Clean Up Bros

**Trigger:** AUTOMATICALLY after EVERY action (code change, file edit, command)
**Purpose:** Keep MEMORY.md synchronized, never lose context

---

## CRITICAL IMPORTANCE

This skill is the foundation of the Boris Standard.
It ensures ANY AI can pick up exactly where the previous AI left off.

**NEVER SKIP THIS SKILL.**

---

## WHEN IT RUNS

After ANY of these actions:
- Code change
- File edit
- File creation
- File deletion
- Command execution
- Bug fix
- Feature implementation
- Any modification to the workspace

---

## WORKFLOW

### Step 1: Detect Changes
```yaml
What changed:
- [ ] File created
- [ ] File modified
- [ ] File deleted
- [ ] Command executed
- [ ] Error occurred
```

### Step 2: Update MEMORY.md
```yaml
Update these sections:
- CURRENT STATE: Build status, last action
- ERROR LOG: If error occurred
- LESSONS LEARNED: If new pattern discovered
- VERSION HISTORY: If significant change
```

### Step 3: Update TASKS.md (if applicable)
```yaml
If a task was completed:
- Move from ACTIVE to COMPLETED
- Update status
```

### Step 4: Update HANDOFF.md (if session ending)
```yaml
Only if user says "done for today" or ":bye:":
- What was accomplished
- What's in progress
- What's next
```

---

## MEMORY.md UPDATE TEMPLATE

After action, add/update:

```markdown
## CURRENT STATE

Last Action: [What was just done]
Last Updated: [Current timestamp]
Build Status: [PASSING/FAILING]
```

---

## ERROR LOGGING

If an error occurred during the action:

```markdown
## ERROR LOG

| Date | Error | File | Fix Applied | Status |
|------|-------|------|-------------|--------|
| [Now] | [Error message] | [File] | [Fix or PENDING] | [RESOLVED/OPEN] |
```

Then add to LESSONS LEARNED:

```markdown
| [Date] | [Issue] | [Solution] | [Prevention] |
```

---

## CHECKLIST

After every action, verify:
- [ ] MEMORY.md current state is accurate
- [ ] Any errors are logged
- [ ] TASKS.md reflects completed work
- [ ] No context will be lost if session ends

---

## SYNC FREQUENCY

This skill should run:
- **Minimum:** After every 3-5 actions
- **Ideal:** After every single action
- **Required:** Before session ends

If you forget to sync, context WILL be lost.

---

## AUTO-INVOKE REMINDER

You don't need to manually call this skill.
It triggers automatically.

But if you're ever unsure, you can manually run:
```
"sync"
"update memory"
"save state"
```

---

*The foundation of perfect memory*
*Never lose context again*
