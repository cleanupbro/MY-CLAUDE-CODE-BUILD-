#!/bin/bash
# CHECKPOINT SCRIPT - Clean Up Bros
# USAGE: ./ops/checkpoint.sh "Commit message"
#
# This script:
# 1. Logs the checkpoint to LOG.md
# 2. Stages all changes
# 3. Commits with your message
# 4. Confirms success

set -e

# Check for commit message
if [ -z "$1" ]; then
    echo "Error: Commit message required"
    echo "Usage: ./ops/checkpoint.sh \"Your commit message\""
    exit 1
fi

# Generate timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')

# Log to LOG.md
echo "$TIMESTAMP | CHECKPOINT | $1" >> LOG.md

# Stage all changes
git add .

# Commit with message
git commit -m "$1"

# Success message
echo ""
echo "============================================"
echo "  CHECKPOINT SAVED"
echo "============================================"
echo "  Time: $TIMESTAMP"
echo "  Message: $1"
echo "  Logged to: LOG.md"
echo "============================================"
