#!/usr/bin/env bash
set -e
ROOT="/workspaces/ai-troubleshooter-mvp"

# Backend
cd "$ROOT/server" || exit 0

# install if missing
if [ ! -d "node_modules" ]; then
  echo "Installing server dependencies..."
  npm ci
fi

# create .env from Codespaces secret if available and .env missing
if [ ! -f ".env" ]; then
  if [ -n "${OPENAI_API_KEY:-}" ]; then
    cat > .env <<EOF
OPENAI_API_KEY=${OPENAI_API_KEY}
PORT=8787
CLIENT_ORIGIN=http://localhost:5173
EOF
    echo "Created server/.env from OPENAI_API_KEY env var"
  elif [ -f ".env.example" ]; then
    cp .env.example .env
    echo "Copied .env.example -> .env (please edit .env to add secrets if needed)"
  else
    echo "No .env or .env.example found. Create server/.env with OPENAI_API_KEY."
  fi
fi

# start backend
echo "Starting backend (npm run dev) ..."
npm run dev &

# Frontend (optional)
cd "$ROOT/client" || exit 0

if [ -f "package.json" ]; then
  if [ ! -d "node_modules" ]; then
    echo "Installing client dependencies..."
    npm ci
  fi
  echo "Starting frontend (npm run dev) ..."
  npm run dev &
fi

echo "post-start finished"
