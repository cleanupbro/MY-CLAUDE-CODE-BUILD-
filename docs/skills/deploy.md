# Deploy Skill

> Deploy changes to production (cleanupbros.com.au via Vercel)
> Priority: HIGH

---

## Triggers

- "deploy"
- "push to production"
- "go live"
- "ship it"

---

## Pre-Flight Checks

1. [ ] Run `npm run build` — must pass with 0 errors
2. [ ] Check for uncommitted changes
3. [ ] Verify on correct branch (main)
4. [ ] Review changes with `git diff`

---

## Steps

### 1. Build Verification

```bash
npm run build
```
Must complete with 0 errors.

### 2. Stage Changes

```bash
git add -A
```

### 3. Commit

```bash
git commit -m "$(cat <<'EOF'
deploy: [description of changes]

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 4. Push

```bash
git push origin main
```

### 5. Verify Deployment

- Wait 1-3 minutes for Vercel auto-build
- Check https://cleanupbros.com.au
- Verify changes are live

---

## Post-Deploy Updates

Update STATUS.md:
```markdown
## SESSION CONTEXT
- **Recent Change**: Deployed [description] to production
```

Append to LOG.md:
```
[DATE] | DEPLOY | [Description] deployed to cleanupbros.com.au
```

---

## Verification Checklist

- [ ] Build passed locally
- [ ] Changes pushed to GitHub
- [ ] Vercel deployment READY
- [ ] Website shows changes
- [ ] STATUS.md updated
- [ ] LOG.md updated

---

## If Failed

1. Check build errors: `npm run build`
2. Check git status: `git status`
3. Check Vercel dashboard for deployment errors
4. If needed, rollback: `git revert HEAD`

---

## Success Message

```
✅ Deployed to production
   Site: cleanupbros.com.au
   Commit: [hash]
   Time: ~[X] minutes
```

---

*For deployment issues, check Vercel dashboard.*
