@echo off
echo Starting backend:
start cmd /k "cd backend && npm run dev"

echo Starting frontend:
start cmd /k "cd frontend && npm start"
