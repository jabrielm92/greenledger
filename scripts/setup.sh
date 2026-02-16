#!/bin/bash
echo "Setting up GreenLedger..."

# Copy env file
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local — please fill in your API keys"
fi

# Start database
docker-compose up -d db
sleep 3

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

echo "Setup complete! Run 'npm run dev' to start."
