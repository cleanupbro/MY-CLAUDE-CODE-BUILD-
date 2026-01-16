# backup.md - GitHub Backup Skill
## Clean Up Bros

**Trigger:** "backup", "save", "commit", "git push"
**Purpose:** Commit and push changes to GitHub

---

## WHEN TO USE

- After significant changes
- Before ending session
- After bug fixes
- After feature completion

---

## WORKFLOW

### Step 1: Check Status
```bash
git status
```
Review what files changed.

### Step 2: Review Changes
```bash
git diff
```
Make sure all changes are intentional.

### Step 3: Run Code Review
```yaml
Run code-review.md checklist:
- Build passes
- No TypeScript errors
- No hardcoded secrets
```

### Step 4: Stage Changes
```bash
git add .
```
Or stage specific files:
```bash
git add src/views/NewView.tsx
```

### Step 5: Commit
```bash
git commit -m "Type: Brief description"
```

Commit message types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructure
- `test:` Adding tests
- `chore:` Maintenance

### Step 6: Push
```bash
git push origin main
```

### Step 7: Verify
```yaml
Confirm:
- Push succeeded
- No merge conflicts
- Vercel auto-deploy started (if applicable)
```

---

## REPOSITORY INFO

```yaml
Remote: https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD-.git
Branch: main
Auto-deploy: Yes (Vercel)
```

---

## GITIGNORE CHECK

Before committing, verify these are ignored:
```
.secrets/
.env
.env.local
node_modules/
dist/
```

Never commit API keys or secrets!

---

## ROLLBACK

If you need to undo:
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a specific commit
git revert [commit-hash]
```

---

## CHECKLIST

- [ ] git status reviewed
- [ ] Changes are intentional
- [ ] Build passes
- [ ] No secrets in commit
- [ ] Commit message is clear
- [ ] Push succeeded
- [ ] MEMORY.md updated

---

*Backup early. Backup often.*
