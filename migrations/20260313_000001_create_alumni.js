exports.up = async (knex) => {
  await knex.schema.createTable("alumni", (t) => {
    t.increments("alumni_id").primary();
    t.string("fname").notNullable();
    t.string("mname").nullable();
    t.string("lname").notNullable();
    t.string("contact_no").nullable();
    t.string("username").notNullable().unique();
    t.string("password").notNullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").nullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("alumni");
};

