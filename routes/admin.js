const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/api-admin-stats', (req, res) => {
  (async () => {
    try {
      const [alumniRow] = await db('alumni').count({ total: 'alumni_id' });
      const [questionRow] = await db('survey_question').count({ total: 'survey_question_id' });
      const [responseRow] = await db('answer').countDistinct({ total: 'alumni_id' });

      return res.json({
        alumni_total: Number(alumniRow?.total || 0),
        survey_question_total: Number(questionRow?.total || 0),
        survey_response_total: Number(responseRow?.total || 0),
      });
    } catch (err) {
      return res.status(500).send({ message: 'Failed to fetch admin stats', error: String(err?.message || err) });
    }
  })();
});

module.exports = router;
