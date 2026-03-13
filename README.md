# Alumni Management System

Alumni Survey System for managing alumni accounts, survey questions, survey responses, and job history records. Includes separate alumni and admin experiences with a simple, clean web UI and a SQLite-backed API.

## Quick Start (SQLite)

### 1) Install dependencies
```bash
npm install
```

### 2) Create/update database schema
```bash
npm run migrate:latest
```

### 3) Seed initial data (admin + questions)
```bash
npm run seed:run
```

### 4) Start the server
```bash
node app.js
```

Server runs on: http://localhost:3000

## Database
- **Database engine:** SQLite (file-based)
- **Default file:** `data/alumni.sqlite` (preferred). If `data/alumni.sqlite3` exists, it will be used.
- **Override file path:** set `SQLITE_DB_FILE`

PowerShell example:
```powershell
$env:SQLITE_DB_FILE="C:\\path\\to\\alumni.sqlite"
```

## Default admin account (seeded)
- **Username:** `admintest@gmail.com`
- **Password:** `admintes123`

## Migrations & seeds
```bash
npm run migrate:latest
npm run migrate:rollback
npm run seed:run
```

## Tech Stack
- Node.js + Express
- SQLite + Knex (migrations/seeds)
- Bootstrap 5
- Bcrypt for password hashing

