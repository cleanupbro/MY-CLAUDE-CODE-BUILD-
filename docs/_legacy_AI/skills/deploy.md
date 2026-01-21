# deploy.md - Deploy Skill
## Clean Up Bros

**Trigger:** "deploy", "push to production", "go live", "ship it"
**Purpose:** Build and deploy to Vercel production

---

## WHEN TO USE

When user wants to:
- Deploy changes to production
- Push to live site
- Update cleanupbros.com.au

---

## PRE-DEPLOY CHECKLIST

Before deploying, verify:
- [ ] `npm run build` passes with 0 errors
- [ ] No TypeScript errors
- [ ] No console errors in dev mode
- [ ] Changes tested locally
- [ ] code-review.md has been run

---

## WORKFLOW

### Step 1: Run Build
```bash
npm run build
```

Expected output:
- 710+ modules transformed
- Build time ~3-4 seconds
- No errors

### Step 2: Review Build Output
```yaml
Check for:
- No errors
- Bundle sizes reasonable
- All assets generated
```

### Step 3: Git Commit
```bash
git add .
git commit -m "Deploy: [brief description of changes]"
```

### Step 4: Push to Production
```bash
git push origin main
```

Vercel auto-deploys on push to main.

### Step 5: Verify Deployment
```yaml
After push:
1. Check Vercel dashboard for build status
2. Wait for deployment to complete (~1-2 min)
3. Visit https://cleanupbros.com.au
4. Verify changes are live
```

### Step 6: Update MEMORY.md
```yaml
Update:
- Build Status: PASSING
- Last Deploy: [current date]
- Version: Increment if significant
```

---

## DEPLOYMENT INFO

```yaml
GitHub: https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD-.git
Vercel Project: my-claude-code-build
Live URL: https://cleanupbros.com.au
Auto-Deploy: Yes (on push to main)
```

---

## ROLLBACK

If deployment breaks production:
```bash
# Revert to last commit
git revert HEAD
git push origin main

# Or via Vercel dashboard
# Go to Deployments → Previous deployment → Promote to Production
```

---

## CHECKLIST

- [ ] Build passes locally
- [ ] Changes tested
- [ ] Code reviewed
- [ ] Committed with clear message
- [ ] Pushed to main
- [ ] Verified live
- [ ] MEMORY.md updated

---

*Deploy with confidence. Always test first.*
