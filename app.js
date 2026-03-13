const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const pagesRoutes = require('./routes/pages');
const authRoutes = require('./routes/auth');
const surveyRoutes = require('./routes/survey');
const alumniRoutes = require('./routes/alumni');
const jobHistoryRoutes = require('./routes/jobHistory');
const adminRoutes = require('./routes/admin');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(pagesRoutes);
app.use(authRoutes);
app.use(surveyRoutes);
app.use(alumniRoutes);
app.use(jobHistoryRoutes);
app.use(adminRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
