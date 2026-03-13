exports.up = async (knex) => {
  await knex.schema.createTable("survey_question", (t) => {
    t.increments("survey_question_id").primary();
    t.text("survey_question").notNullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").nullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("survey_question");
};

