# Code Review Directive
## Clean Up Bros - Standard Operating Procedure

**Purpose:** Ensure code quality before commits

---

## Checklist

### TypeScript
- [ ] No TypeScript errors
- [ ] Types properly defined
- [ ] No `any` types

### React
- [ ] Functional components
- [ ] Hooks used correctly
- [ ] Keys on list items

### Styling
- [ ] Tailwind classes used
- [ ] Brand colors followed
- [ ] Responsive design

### Security
- [ ] No hardcoded secrets
- [ ] Input validation
- [ ] XSS prevention

### Quality
- [ ] Clear variable names
- [ ] No duplicate code
- [ ] Comments where needed

---

## Quick Commands

```bash
# Check build
npm run build

# Check changes
git diff

# Format code
npx prettier --write .
```

---

*Quality code. Every commit.*
