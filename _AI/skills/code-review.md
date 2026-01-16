# code-review.md - Code Review Skill
## Clean Up Bros

**Trigger:** AUTOMATICALLY before every commit (implicit)
**Also:** "review code", "check my code", "code review"
**Purpose:** Ensure code quality before committing

---

## WHEN IT RUNS

- Before every `git commit`
- Before every `deploy`
- When user asks for code review

---

## REVIEW CHECKLIST

### 1. TypeScript
- [ ] No TypeScript errors (`npm run build`)
- [ ] Types properly defined
- [ ] No `any` types (unless necessary)
- [ ] Props interfaces defined for components

### 2. React Best Practices
- [ ] Functional components
- [ ] Hooks used correctly
- [ ] useEffect dependencies correct
- [ ] No memory leaks (cleanup functions)
- [ ] Keys on list items

### 3. Styling
- [ ] Tailwind classes used
- [ ] Responsive design considered
- [ ] Brand colors used (--brand-teal, --brand-gold, etc.)
- [ ] Consistent spacing

### 4. Security
- [ ] No hardcoded secrets
- [ ] No exposed API keys
- [ ] Input validation on forms
- [ ] XSS prevention

### 5. Performance
- [ ] Lazy loading for routes
- [ ] Images optimized
- [ ] No unnecessary re-renders
- [ ] Bundle size reasonable

### 6. Code Quality
- [ ] Clear variable names
- [ ] Functions do one thing
- [ ] No duplicate code
- [ ] Comments for complex logic

---

## WORKFLOW

### Step 1: Run Build
```bash
npm run build
```
Must pass with 0 errors.

### Step 2: Check for Issues
```yaml
Look for:
- TypeScript errors
- Console warnings
- Unused imports
- Dead code
```

### Step 3: Review Changed Files
```bash
git diff --staged
```

Review each changed file against checklist.

### Step 4: Fix Issues
If issues found:
1. Fix the issue
2. Re-run build
3. Re-review

### Step 5: Approve or Request Changes
```yaml
If all checks pass:
- Proceed with commit
- Log "Code review passed" in MEMORY.md

If issues found:
- List issues
- Fix before committing
```

---

## COMMON ISSUES TO CATCH

| Issue | Fix |
|-------|-----|
| TypeScript `any` | Define proper type |
| Missing key prop | Add unique key to list items |
| Hardcoded string | Move to constants.ts |
| Console.log | Remove before commit |
| Unused import | Remove it |
| Duplicate code | Extract to function |

---

## AUTO-FIX COMMANDS

```bash
# Fix lint issues
npm run lint --fix

# Format code
npx prettier --write .
```

---

*Quality code. Every commit.*
