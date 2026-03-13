# Alumni Management System - Database Setup

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Migration
```bash
node migrate.js
```

This will:
- Create the `alumni_db` database
- Create all required tables (admin_user, alumni, survey_question, answer, job_history)
- Add indexes for performance
- Insert default admin user
- Add sample survey questions

### 3. Start the Server
```bash
node app.js
```

Server will run on: http://localhost:3000

## Default Admin Credentials
- **Username:** admin
- **Password:** admin123

⚠️ **Important:** Change the default admin password after first login!

## Database Structure

### Tables:
1. **admin_user** - Admin accounts
2. **alumni** - Alumni user accounts
3. **survey_question** - Survey questions
4. **answer** - Alumni survey responses
5. **job_history** - Alumni employment history

## Manual Migration (Alternative)

If you prefer to run the migration manually:

1. Open MySQL/phpMyAdmin
2. Import the file: `migrations/001_initial_schema.sql`

## Environment Variables (Optional)

Create a `.env` file for custom database configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=alumni_db
PORT=3000
```

## Troubleshooting

**Error: Cannot connect to database**
- Make sure MySQL is running
- Check your database credentials in `app.js`

**Error: Table already exists**
- The migration uses `IF NOT EXISTS` so it's safe to run multiple times
- To reset, drop the database and run migration again

## Tech Stack
- Node.js + Express
- MySQL
- Bootstrap 5
- Bcrypt for password hashing
