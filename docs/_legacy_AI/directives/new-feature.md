# New Feature Directive
## Clean Up Bros - Standard Operating Procedure

**Purpose:** Implement new features systematically

---

## Steps

1. **Understand Requirements**
   - What does it do?
   - Who uses it?
   - Where does it fit?

2. **Plan Implementation**
   - Files to create/modify
   - Components needed
   - Get user approval

3. **Check Patterns**
   - Review similar features
   - Use existing components
   - Follow conventions

4. **Implement**
   - Types → Components → Views → Services

5. **Test**
   - Build passes
   - Feature works
   - Nothing broken

6. **Document**
   - Update MEMORY.md
   - Update TASKS.md

---

## Adding a View

```typescript
// 1. Create src/views/NewView.tsx
// 2. Add to src/types.ts ViewType
// 3. Add lazy import in src/App.tsx
// 4. Add case in renderView()
```

---

*Plan. Build. Test. Document.*
