# Bug Fix Skill

> Debug and fix issues in the Clean Up Bros application
> Priority: HIGH

---

## Triggers

- "error"
- "bug"
- "not working"
- "broken"
- "fix"
- "crash"

---

## Pre-Flight Checks

1. [ ] Reproduce the issue
2. [ ] Identify error message or behavior
3. [ ] Check if issue is in production or development only
4. [ ] Review recent changes that might have caused it

---

## Steps

### 1. Gather Information

- What is the expected behavior?
- What is the actual behavior?
- When did it start happening?
- What was the last change made?

### 2. Reproduce the Issue

```bash
npm run dev
```
Try to trigger the bug in development at localhost:3000.

### 3. Check Build for Errors

```bash
npm run build
```
Review any TypeScript or compilation errors.

### 4. Identify Root Cause

Common areas to check:
- Recent git commits: `git log --oneline -10`
- Changed files: `git diff HEAD~5`
- TypeScript errors
- Import/export issues
- Missing dependencies

### 5. Implement Fix

- Make minimal changes to fix the issue
- Don't refactor unrelated code
- Test fix locally

### 6. Verify Fix

```bash
npm run build  # Must pass
npm run dev    # Test the feature
```

### 7. Document Fix

Append to LOG.md:
```
[DATE] | BUGFIX | [Issue description] - Fixed in [file]
```

---

## Key Files to Check

| Area | Files |
|------|-------|
| Landing Page | `src/views/LandingViewNew.tsx` |
| All Views | `src/views/*View.tsx` |
| Components | `src/components/` |
| Services | `src/services/` |
| Styles | `tailwind.config.js` |

---

## Common Issues

| Error | Likely Cause | Fix |
|-------|--------------|-----|
| Module not found | Wrong import path | Check relative paths |
| Type error | TypeScript mismatch | Check types/interfaces |
| Build failed | Syntax error | Check console output |
| 404 on route | Wrong route config | Check React Router |
| Style not applied | Tailwind class typo | Check class names |

---

## Verification Checklist

- [ ] Issue is resolved
- [ ] Build passes
- [ ] No new errors introduced
- [ ] Related features still work
- [ ] LOG.md updated

---

## If Failed

1. Revert changes: `git checkout -- [file]`
2. Check git history for when issue started
3. Consider reverting recent commits
4. Ask for more context about the issue

---

## Emergency Rollback

If fix causes more issues:
```bash
git revert HEAD
git push origin main
```

---

## Success Message

```
✅ Bug fixed: [Description]
   Build: Passes
   Files changed: [list]
   Ready for deploy
```

---

*After fixing, consider using deploy.md skill to push to production.*
