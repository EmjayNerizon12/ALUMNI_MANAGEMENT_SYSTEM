const fs = require("fs");
const path = require("path");

const knex = require("knex");
const knexfile = require("./knexfile");

function resolveDbFile() {
  if (process.env.SQLITE_DB_FILE) return process.env.SQLITE_DB_FILE;

  const dir = path.join(__dirname, "data");
  const preferred = path.join(dir, "alumni.sqlite");
  const legacy = path.join(dir, "alumni.sqlite3");

  if (fs.existsSync(preferred)) return preferred;
  if (fs.existsSync(legacy)) return legacy;
  return preferred;
}

const dbFile = resolveDbFile();

fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const db = knex({
  ...knexfile.development,
  connection: { filename: dbFile },
});

module.exports = db;
