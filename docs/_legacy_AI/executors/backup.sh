#!/bin/bash
# backup.sh - Git backup script
# Clean Up Bros

echo "=== BACKUP SCRIPT ==="

# Show status
echo "Changes to backup:"
git status --short

# Stage all
echo ""
echo "Staging changes..."
git add .

# Commit
echo "Committing..."
git commit -m "Backup: $(date '+%Y-%m-%d %H:%M')"

# Push
echo "Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "=== BACKUP COMPLETE ==="
  echo "Repo: https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD-"
else
  echo ""
  echo "ERROR: Backup failed!"
  exit 1
fi
