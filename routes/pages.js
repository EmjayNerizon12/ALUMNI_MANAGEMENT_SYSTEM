const express = require('express');
const path = require('path');

const router = express.Router();

function sendPublicFile(res, filename) {
  return res.sendFile(path.join(__dirname, '..', 'public', filename));
}

router.get('/', (req, res) => sendPublicFile(res, 'login.html'));
router.get('/login', (req, res) => sendPublicFile(res, 'login.html'));

router.get('/alumni-home', (req, res) => sendPublicFile(res, 'alumni_home.html'));
router.get('/alumni-account', (req, res) => sendPublicFile(res, 'alumni-account.html'));

// Backwards-compatible alumni routes
router.get('/alumni-profile', (req, res) => res.redirect(302, '/alumni-account'));
router.get('/alumni-job-history', (req, res) => res.redirect(302, '/alumni-account#job'));
router.get('/alumni-answer-survey', (req, res) => res.redirect(302, '/alumni-account#survey'));

// Short / legacy admin routes
router.get('/admin', (req, res) => res.redirect(302, '/admin-dashboard'));
router.get('/admin_dashboard', (req, res) => res.redirect(302, '/admin-dashboard'));
router.get('/admin_account', (req, res) => res.redirect(302, '/admin-account'));

router.get('/admin-dashboard', (req, res) => sendPublicFile(res, 'admin_dashboard.html'));
router.get('/admin-account', (req, res) => sendPublicFile(res, 'admin-account.html'));

// Backwards-compatible admin routes
router.get('/admin-survey-answer', (req, res) => res.redirect(302, '/admin-account#survey-results'));
router.get('/admin-survey', (req, res) => res.redirect(302, '/admin-account#survey-questions'));
router.get('/admin-alumni', (req, res) => res.redirect(302, '/admin-account#alumni'));

module.exports = router;
