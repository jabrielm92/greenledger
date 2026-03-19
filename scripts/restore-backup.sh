#!/bin/bash
# Restore database from backup
# Usage: ./scripts/restore-backup.sh [backup-file.sql.gz]

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <backup-file.sql.gz>"
  echo ""
  echo "Available backups:"
  ls -lh ./backups/*.sql.gz 2>/dev/null || echo "No backups found"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "WARNING: This will REPLACE the current database"
echo "Backup file: $BACKUP_FILE"
echo ""
read -p "Are you sure? (type 'yes' to continue): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Cancelled"
  exit 0
fi

echo "Stopping application..."
docker-compose stop app

echo "Dropping existing database..."
docker-compose exec db psql -U greenledger -d postgres -c "DROP DATABASE IF EXISTS greenledger;"

echo "Creating fresh database..."
docker-compose exec db psql -U greenledger -d postgres -c "CREATE DATABASE greenledger;"

echo "Restoring from backup..."
gunzip -c "$BACKUP_FILE" | docker-compose exec -T db psql -U greenledger -d greenledger

echo "Running migrations (if needed)..."
docker-compose exec app npx prisma migrate deploy

echo "Starting application..."
docker-compose start app

echo "Restore complete"
