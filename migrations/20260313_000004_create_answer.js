exports.up = async (knex) => {
  await knex.schema.createTable("answer", (t) => {
    t.increments("answer_id").primary();
    t.integer("alumni_id").notNullable();
    t.integer("survey_question_id").notNullable();
    t.text("answer").notNullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    t.foreign("alumni_id").references("alumni.alumni_id").onDelete("CASCADE");
    t.foreign("survey_question_id")
      .references("survey_question.survey_question_id")
      .onDelete("CASCADE");

    t.index(["alumni_id"]);
    t.index(["survey_question_id"]);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("answer");
};

