const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/api-store-job-history', (req, res) => {
  (async () => {
    try {
      const { alumni_id, company_name, position, start_date, end_date } = req.body;
      await db('job_history').insert({
        alumni_id,
        company_name,
        position,
        start_date: start_date || null,
        end_date: end_date || null,
      });
      return res.status(201).send({ message: 'Job History Created Successfully' });
    } catch (err) {
      return res.status(500).send({ message: 'Failed to create job history', error: String(err?.message || err) });
    }
  })();
});

router.get('/api-get-all-job-history/:alumni_id', (req, res) => {
  (async () => {
    try {
      const alumni_id = req.params.alumni_id;
      const result = await db('job_history').where({ alumni_id }).select('*');
      return res.json(result);
    } catch (err) {
      return res.status(500).send({ message: 'Failed to fetch job history', error: String(err?.message || err) });
    }
  })();
});

router.put('/api-update-job-history', (req, res) => {
  (async () => {
    try {
      const { job_history_id, company_name, position, start_date, end_date } = req.body;
      await db('job_history')
        .where({ job_history_id })
        .update({
          company_name,
          position,
          start_date: start_date || null,
          end_date: end_date || null,
          updated_at: db.fn.now(),
        });
      return res.status(200).send({ message: 'Job History Updated Successfully' });
    } catch (err) {
      return res.status(500).send({ message: 'Failed to update job history', error: String(err?.message || err) });
    }
  })();
});

router.delete('/api-delete-job-history', (req, res) => {
  (async () => {
    try {
      const { job_history_id } = req.body;
      await db('job_history').where({ job_history_id }).del();
      return res.status(200).send({ message: 'Job History Deleted Successfully' });
    } catch (err) {
      return res.status(500).send({ message: 'Failed to delete job history', error: String(err?.message || err) });
    }
  })();
});

module.exports = router;
