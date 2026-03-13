const QUESTIONS = [
  "What is your current employment status?",
  "If employed, what is your current job title/position?",
  "What is the name of your current company/organization?",
  "How relevant is your degree/program to your current job?",
  "How satisfied are you with the education/training you received?",
];

exports.seed = async (knex) => {
  const existingRows = await knex("survey_question").select("survey_question");
  const existing = new Set(existingRows.map((r) => r.survey_question));

  const toInsert = QUESTIONS.filter((q) => !existing.has(q)).map((q) => ({
    survey_question: q,
  }));

  if (toInsert.length) await knex("survey_question").insert(toInsert);
};

