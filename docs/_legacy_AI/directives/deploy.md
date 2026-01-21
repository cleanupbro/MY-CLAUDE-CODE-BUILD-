# Deploy Directive
## Clean Up Bros - Standard Operating Procedure

**Purpose:** Deploy changes to production (cleanupbros.com.au)

---

## Prerequisites

- [ ] All changes committed
- [ ] `npm run build` passes
- [ ] No TypeScript errors
- [ ] Tested locally

---

## Steps

1. **Verify Build**
   ```bash
   npm run build
   ```

2. **Review Changes**
   ```bash
   git diff --staged
   ```

3. **Commit**
   ```bash
   git add .
   git commit -m "Deploy: [description]"
   ```

4. **Push**
   ```bash
   git push origin main
   ```

5. **Verify Deployment**
   - Wait 1-2 minutes
   - Check https://cleanupbros.com.au
   - Verify changes are live

---

## Rollback

If issues occur:
```bash
git revert HEAD
git push origin main
```

Or via Vercel dashboard: Promote previous deployment.

---

*Deploy responsibly. Always test first.*
