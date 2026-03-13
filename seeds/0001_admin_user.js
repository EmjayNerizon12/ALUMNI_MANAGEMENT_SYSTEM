const bcrypt = require("bcrypt");

const ADMIN_USERNAME = "admintest@gmail.com";
const ADMIN_PASSWORD = "admintest123";

exports.seed = async (knex) => {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await knex("admin_user")
    .insert({
      username: ADMIN_USERNAME,
      password: passwordHash,
    })
    .onConflict("username")
    .merge({ password: passwordHash });
};

