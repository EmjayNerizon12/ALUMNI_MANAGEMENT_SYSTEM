npm i -D knex
npm i sqlite3
npx knex init

// knexfile.js (SQLite)
module.exports = {
  development: {
    client: "sqlite3",
    connection: { filename: "./data/alumni.sqlite" },
    useNullAsDefault: true,
    migrations: { directory: "./migrations" },
    seeds: { directory: "./seeds" },
  },
};

npm run migrate:latest
npm run seed:run
