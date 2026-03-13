exports.up = async (knex) => {
  await knex.schema.createTable("job_history", (t) => {
    t.increments("job_history_id").primary();
    t.integer("alumni_id").notNullable();
    t.string("company_name").notNullable();
    t.string("position").notNullable();
    t.string("start_date").nullable();
    t.string("end_date").nullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").nullable();

    t.foreign("alumni_id").references("alumni.alumni_id").onDelete("CASCADE");
    t.index(["alumni_id"]);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("job_history");
};

