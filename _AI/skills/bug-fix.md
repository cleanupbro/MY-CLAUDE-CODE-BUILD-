# bug-fix.md - Bug Fix Skill
## Clean Up Bros

**Trigger:** "bug", "fix", "error", "broken", "issue", "not working"
**Purpose:** Systematic debugging and issue resolution

---

## WORKFLOW

### Step 1: Understand the Bug
```yaml
Gather information:
- What is the expected behavior?
- What is the actual behavior?
- When did it start?
- What changed recently?
- Can it be reproduced?
```

### Step 2: Check Error Logs
```yaml
Look at:
- Browser console
- Terminal output
- Build errors
- MEMORY.md ERROR LOG
```

### Step 3: Check if Known Issue
```yaml
Search MEMORY.md LESSONS LEARNED:
- Has this happened before?
- What was the fix?
```

### Step 4: Reproduce the Bug
```yaml
Steps:
1. Run npm run dev
2. Navigate to affected page
3. Perform action that triggers bug
4. Capture error message
```

### Step 5: Isolate the Cause
```yaml
Debugging steps:
1. Check recent changes (git diff)
2. Add console.logs
3. Check network requests
4. Check component props/state
5. Check dependencies
```

### Step 6: Fix the Bug
```yaml
Apply fix:
1. Make minimal change to fix issue
2. Don't introduce new features
3. Don't refactor unrelated code
```

### Step 7: Verify Fix
```yaml
Test:
1. npm run build (must pass)
2. npm run dev
3. Test the affected functionality
4. Test related functionality
5. Confirm bug is fixed
```

### Step 8: Document
```yaml
Add to MEMORY.md:

ERROR LOG:
| [Date] | [Error] | [File] | [Fix] | RESOLVED |

LESSONS LEARNED:
| [Date] | [Issue] | [Solution] | [Prevention] |
```

---

## COMMON BUGS & FIXES

| Bug | Likely Cause | Fix |
|-----|--------------|-----|
| TypeScript error | Type mismatch | Define proper types |
| Module not found | Missing import | Add import statement |
| Undefined is not a function | Calling non-existent method | Check method name/existence |
| CORS error | API not allowing origin | Check N8N webhook settings |
| 404 webhook | N8N workflow inactive | Activate workflow |
| White screen | Component crash | Check for null/undefined access |
| Hydration error | Server/client mismatch | Check for browser-only code |

---

## DEBUGGING COMMANDS

```bash
# Check build errors
npm run build

# Run dev with verbose
npm run dev

# Check git changes
git diff

# Check recent commits
git log --oneline -10
```

---

## CHECKLIST

- [ ] Bug understood and reproducible
- [ ] Error message captured
- [ ] Cause isolated
- [ ] Fix applied
- [ ] Build passes
- [ ] Bug verified fixed
- [ ] Documented in MEMORY.md
- [ ] sync.md run

---

*Fix bugs systematically. Document everything.*
