const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/api-get-all-alumni', (req, res) => {
  (async () => {
    try {
      const results = await db('alumni').select('*');
      return res.json(results);
    } catch (err) {
      return res.status(500).send({ message: 'Failed to fetch alumni', error: String(err?.message || err) });
    }
  })();
});

router.get('/api-get-alumni-info/:alumni_id', (req, res) => {
  (async () => {
    try {
      const alumni_id = req.params.alumni_id;
      const result = await db('alumni').where({ alumni_id }).select('*');
      return res.status(200).send(result);
    } catch (err) {
      return res.status(500).send({ message: 'Failed to fetch alumni info', error: String(err?.message || err) });
    }
  })();
});

router.put('/api-update-alumni-info', (req, res) => {
  (async () => {
    try {
      const { alumni_id, fname, mname, lname, contact_no } = req.body;
      await db('alumni')
        .where({ alumni_id })
        .update({
          fname,
          mname: mname || null,
          lname,
          contact_no: contact_no || null,
          updated_at: db.fn.now(),
        });
      return res.status(200).send({ message: 'Alumni Info Updated Successfully' });
    } catch (err) {
      return res.status(500).send({ message: 'Failed to update alumni info', error: String(err?.message || err) });
    }
  })();
});

module.exports = router;
