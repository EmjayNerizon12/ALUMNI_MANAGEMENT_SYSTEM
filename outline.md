# Project Outline (Alumni Management System)

## 1) What this project is
- A Node.js + Express web app that serves static HTML pages from `public/` and exposes JSON APIs under `/api-*`.
- Frontend uses Bootstrap (via CDN) + a shared theme file `public/assets/theme.css`.

## 2) Main technologies used
- **Runtime:** Node.js
- **Server:** Express (`app.js`)
- **Password hashing:** `bcrypt`
- **Database:** SQLite (file-based)
- **DB access & queries:** Knex (`db.js`)
- **Schema versioning:** Knex migrations (`migrations/`)

## 3) Database & migrations (SQLite + Knex)
### Database file
- The SQLite database is stored as a file:
  - Default: `data/alumni.sqlite` (preferred)
  - Legacy supported: `data/alumni.sqlite3`
  - Override with environment variable: `SQLITE_DB_FILE`

Example (PowerShell):
```powershell
$env:SQLITE_DB_FILE="C:\\path\\to\\alumni.sqlite3"
```

### Knex configuration
- Knex is configured in `knexfile.js`.
- The Knex instance used by the server is created in `db.js` and imported by `app.js`.
- Foreign keys are enabled with: `PRAGMA foreign_keys = ON`.

### Tables created by migrations
Migrations live in `migrations/` and create these tables:
- `alumni`
- `admin_user`
- `survey_question`
- `answer` (links `alumni` + `survey_question`)
- `job_history` (links to `alumni`)

### Migration commands
These scripts are defined in `package.json`:
```powershell
npm run migrate:latest     # apply all pending migrations
npm run migrate:rollback   # rollback last batch
npm run migrate:make -- name_here   # create a new migration file
```

Notes:
- Run migrations before starting the server the first time.
- If you change the schema, create a new migration (don’t edit old migrations after they’ve been applied in production).

## 4) How to run the project
### Install dependencies
```powershell
npm install
```

### Create/update the database schema
```powershell
npm run migrate:latest
```

### Start the server
```powershell
node app.js
```

Server will run at:
- `http://localhost:3000`

## 5) Important routes (pages)
These routes are served by Express and return static HTML files from `public/`:
- `/` or `/login` → `public/login.html`
- `/alumni-home` → `public/alumni_home.html`
- `/alumni-account` → `public/alumni-account.html`
- `/admin-dashboard` → `public/admin_dashboard.html`
- `/admin-account` → `public/admin-account.html`

Legacy/short redirects:
- `/admin` → `/admin-dashboard`
- `/admin_dashboard` → `/admin-dashboard`
- `/admin_account` → `/admin-account`

## 6) API endpoints (server)
The server defines multiple JSON endpoints in `app.js`, such as:
- Authentication: `/api-register`, `/api-login`
- Survey: `/api-store-survey`, `/api-update-survey`, `/api-get-survey-question`, `/api-submit-survey`
- Alumni/job history: `/api-get-all-alumni`, `/api-get-alumni-info/:alumni_id`, `/api-update-alumni-info`,
  `/api-store-job-history`, `/api-get-all-job-history/:alumni_id`, `/api-update-job-history`, `/api-delete-job-history`

## 7) Frontend theme & UI
- Shared theme styles: `public/assets/theme.css`
  - Uses Segoe UI font stack
  - Adds a “concave/pressed” button style for `.btn`
  - Header/navbar buttons are excluded from the concave style
- Theme toggling (light/dark): `public/assets/theme.js`

## 8) Common workflow
1. `npm install`
2. `npm run migrate:latest`
3. `node app.js`
4. Open `http://localhost:3000`
