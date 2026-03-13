exports.up = async (knex) => {
  await knex.schema.createTable("admin_user", (t) => {
    t.increments("admin_user_id").primary();
    t.string("username").notNullable().unique();
    t.string("password").notNullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").nullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("admin_user");
};

