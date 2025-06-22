# FantasyFBDynasty

# Project Setup & Running
1. Install Dependencies
In both frontend/ and backend/ directories, you’ll need to install the necessary Node modules.

From the root directory of the project

cd backend
npm install

cd ../frontend
npm install

2. Build and Run the Backend

cd backend
npm run build    # Compile the TypeScript files
npm run start    # Start the backend server
The backend will connect to the fantasy_db.db SQLite database file (make sure it exists in backend/database).

3. Start the Frontend
In a new terminal window or tab:

cd frontend
npm start
This will start the React development server, usually on http://localhost:3000.

# Folder Structure (not complete)
project-root/
│
├── backend/       # Node.js + SQLite backend
│   ├── server.ts
│   ├── db.ts
│   └── fantasy_db.db
│
├── frontend/      # React + TypeScript frontend
│   └── ...
│
└── README.md      # This file
