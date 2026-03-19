#!/bin/bash
# Verify latest backup is restorable

set -e

BACKUP_DIR="./backups"
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/*.sql.gz 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "No backups found"
  exit 1
fi

echo "Verifying backup: $LATEST_BACKUP"

# Check file is not empty
SIZE=$(stat -c%s "$LATEST_BACKUP" 2>/dev/null || stat -f%z "$LATEST_BACKUP")
if [ "$SIZE" -lt 1024 ]; then
  echo "Backup file too small ($SIZE bytes)"
  exit 1
fi

# Check gzip integrity
if ! gunzip -t "$LATEST_BACKUP"; then
  echo "Backup file corrupted"
  exit 1
fi

# Check age
BACKUP_AGE=$(( ( $(date +%s) - $(stat -c%Y "$LATEST_BACKUP" 2>/dev/null || stat -f%m "$LATEST_BACKUP") ) / 3600 ))
if [ "$BACKUP_AGE" -gt 26 ]; then
  echo "Backup is $BACKUP_AGE hours old (expected <26)"
  exit 1
fi

echo "Backup verified: $(basename "$LATEST_BACKUP") ($SIZE bytes, ${BACKUP_AGE}h old)"
