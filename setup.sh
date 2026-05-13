#!/usr/bin/env bash
set -e

echo "=== SpendLens Setup ==="

# 1. Backend dependencies
echo "[1/4] Installing backend dependencies..."
cd backend
npm install
cd ..

# 2. Frontend dependencies
echo "[2/4] Installing frontend dependencies..."
cd frontend
npm install
cd ..

# 3. .env file check
if [ ! -f backend/.env ]; then
  echo "[3/4] Creating backend/.env from example..."
  cp backend/.env.example backend/.env
  echo "      IMPORTANT: Edit backend/.env and fill in your credentials."
else
  echo "[3/4] backend/.env already exists — skipping."
fi

# 4. MySQL migration
echo "[4/4] Running MySQL migrations..."
echo "      Make sure MySQL is running and DB_* credentials in backend/.env are correct."
cd backend
node src/db/migrate.js
cd ..

echo ""
echo "=== Setup complete ==="
echo ""
echo "Start the backend:   cd backend && npm run dev"
echo "Start the frontend:  cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
