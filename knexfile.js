const path = require("path");
const fs = require("fs");

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

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: dbFile,
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "seeds"),
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done);
      },
    },
  },
};
