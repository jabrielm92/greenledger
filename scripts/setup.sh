#!/bin/bash
echo "Setting up GreenLedger..."

# Copy env file
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local — please fill in your API keys"
fi

# Start database and redis
docker-compose up -d db redis
sleep 3

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Create backups directory
mkdir -p backups
chmod 700 backups

# Validate S3 configuration (warn only — local fallback works for dev)
if [ -z "$S3_BUCKET" ] || [ -z "$S3_ACCESS_KEY_ID" ] || [ -z "$S3_SECRET_ACCESS_KEY" ]; then
  echo ""
  echo "NOTE: S3 storage not configured — using local file storage."
  echo "For production, set the following in .env.local:"
  echo "  S3_BUCKET=your-bucket-name"
  echo "  S3_REGION=auto (for R2) or eu-west-1 (for AWS)"
  echo "  S3_ACCESS_KEY_ID=your-access-key"
  echo "  S3_SECRET_ACCESS_KEY=your-secret-key"
  echo "  S3_ENDPOINT=https://...cloudflarestorage.com (R2 only)"
  echo ""
else
  echo "S3 storage configured: $S3_BUCKET"
fi

echo "Setup complete! Run 'npm run dev' to start."
