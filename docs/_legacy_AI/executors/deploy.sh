#!/bin/bash
# deploy.sh - Deploy to production
# Clean Up Bros

echo "=== DEPLOY SCRIPT ==="

# Step 1: Build
echo "Building..."
npm run build

if [ $? -ne 0 ]; then
  echo "ERROR: Build failed!"
  exit 1
fi

echo "Build successful!"

# Step 2: Commit
echo "Committing changes..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M')"

# Step 3: Push
echo "Pushing to main..."
git push origin main

if [ $? -ne 0 ]; then
  echo "ERROR: Push failed!"
  exit 1
fi

echo ""
echo "=== DEPLOYED SUCCESSFULLY ==="
echo "Vercel will auto-deploy in 1-2 minutes."
echo "Check: https://cleanupbros.com.au"
