const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

router.post('/api-register', async (req, res) => {
  const { fname, mname, lname, contact_no, username, password } = req.body;
  try {
    const normalizedUsername = String(username || '').trim();
    if (!normalizedUsername) return res.status(400).send({ message: 'Username is required' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userId] = await db('alumni').insert({
      fname,
      mname: mname || null,
      lname,
      contact_no: contact_no || null,
      username: normalizedUsername,
      password: hashedPassword,
    });
    return res.status(201).send({ message: 'User registered!', userId });
  } catch (err) {
    return res.status(500).send({ message: 'Registration failed', error: String(err?.message || err) });
  }
});

router.post('/api-login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const normalizedUsername = String(username || '').trim();
    if (!normalizedUsername) return res.status(400).send({ message: 'Username is required' });

    const adminUser = await db('admin_user').where({ username: normalizedUsername }).first();
    if (adminUser) {
      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (!isMatch) return res.status(401).send({ message: 'Invalid username or password' });
      return res.status(200).send([{ message: 'Login successful!', adminUser }, { role: 'admin' }]);
    }

    const user = await db('alumni').where({ username: normalizedUsername }).first();
    if (!user) return res.status(401).send({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ message: 'Invalid username or password' });

    return res.status(200).send([
      { message: 'Login successful!', user },
      { role: 'alumni' },
      { alumni_id: user.alumni_id },
      { FullName: user.fname + ' ' + user.lname },
      { username: normalizedUsername },
    ]);
  } catch (err) {
    return res.status(500).send({ message: 'Login failed', error: String(err?.message || err) });
  }
});

module.exports = router;
