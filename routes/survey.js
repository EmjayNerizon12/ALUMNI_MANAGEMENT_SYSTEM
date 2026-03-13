const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/api-store-survey', (req, res) => {
  (async () => {
    try {
      const { survey_question } = req.body;
      await db('survey_question').insert({ survey_question });
      return res.status(201).send({ message: 'Survey Question Created Successfully' });
    } catch (err) {
      return res
        .status(500)
        .send({ message: 'Failed to create survey question', error: String(err?.message || err) });
    }
  })();
});

router.put('/api-update-survey', (req, res) => {
  (async () => {
    try {
      const { survey_question, survey_id } = req.body;
      await db('survey_question')
        .where({ survey_question_id: survey_id })
        .update({ survey_question, updated_at: db.fn.now() });
      return res.status(200).send({ message: 'Survey Question Updated Successfully' });
    } catch (err) {
      return res
        .status(500)
        .send({ message: 'Failed to update survey question', error: String(err?.message || err) });
    }
  })();
});

router.get('/api-get-survey-question', (req, res) => {
  (async () => {
    try {
      const result = await db('survey_question').select('*');
      return res.json(result);
    } catch (err) {
      return res
        .status(500)
        .send({ message: 'Failed to fetch survey questions', error: String(err?.message || err) });
    }
  })();
});

router.get('/api-get-all-question', (req, res) => {
  (async () => {
    try {
      const result = await db('survey_question').select('*');
      return res.json(result);
    } catch (err) {
      return res
        .status(500)
        .send({ message: 'Failed to fetch questions', error: String(err?.message || err) });
    }
  })();
});

router.post('/api-submit-survey', (req, res) => {
  (async () => {
    try {
      const { alumni_id, answers } = req.body;

      if (!alumni_id || !answers || answers.length === 0) {
        return res.status(400).json({ message: 'Missing data' });
      }

      await db.transaction(async (trx) => {
        for (const a of answers) {
          await trx('answer').insert({
            alumni_id,
            survey_question_id: a.survey_question_id,
            answer: a.answer,
          });
        }
      });

      return res.json({ message: 'Survey submitted successfully!' });
    } catch (err) {
      return res.status(500).json({ message: 'Error saving answers', error: String(err?.message || err) });
    }
  })();
});

router.get('/api-get-all-survey_answers', (req, res) => {
  (async () => {
    try {
      const results = await db('answer as ans')
        .join('alumni as a', 'ans.alumni_id', 'a.alumni_id')
        .join('survey_question as s', 's.survey_question_id', 'ans.survey_question_id')
        .select(
          'a.alumni_id as alumni_id',
          db.raw(
            `TRIM(COALESCE(a.fname,'') || ' ' || COALESCE(a.mname,'') || ' ' || COALESCE(a.lname,'')) as alumni_name`
          ),
          's.survey_question as survey_question',
          'ans.answer as answer'
        );
      return res.json(results);
    } catch (err) {
      return res
        .status(500)
        .send({ message: 'Failed to fetch survey answers', error: String(err?.message || err) });
    }
  })();
});

router.get('/api-get-all-survey_answers_by_alumni/:alumni_id', (req, res) => {
  (async () => {
    try {
      const alumni_id = req.params.alumni_id;
      const results = await db('answer as ans')
        .join('alumni as a', 'ans.alumni_id', 'a.alumni_id')
        .join('survey_question as s', 's.survey_question_id', 'ans.survey_question_id')
        .where('a.alumni_id', alumni_id)
        .orderBy('s.survey_question_id', 'asc')
        .select(
          'ans.created_at as created_at',
          's.survey_question_id as survey_question_id',
          's.survey_question as survey_question',
          'ans.answer as answer'
        );
      return res.json(results);
    } catch (err) {
      return res
        .status(500)
        .send({ message: 'Failed to fetch alumni answers', error: String(err?.message || err) });
    }
  })();
});

router.get('/api-check-submission/:alumni_id', (req, res) => {
  (async () => {
    try {
      const alumni_id = req.params.alumni_id;
      const row = await db('answer').where({ alumni_id }).first('answer_id');
      if (row) return res.json({ message: 'You have already submitted the survey', submitted: true });
      return res.json({ message: 'You have not submitted the survey', submitted: false });
    } catch (err) {
      return res.status(500).send({ message: 'Failed to check submission', error: String(err?.message || err) });
    }
  })();
});

module.exports = router;
