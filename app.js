const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const bcrypt = require('bcrypt');
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alumni_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function sendPublicFile(res, filename) {
    return res.sendFile(path.join(__dirname, 'public', filename));
}


app.get('/', (req, res) => {
    return sendPublicFile(res, 'login.html');
});
app.get('/login', (req, res) => {
    return sendPublicFile(res, 'login.html');
});

app.get('/alumni-home', (req, res) => {
    return sendPublicFile(res, 'alumni_home.html');
});

app.get('/alumni-account', (req, res) => {
    return sendPublicFile(res, 'alumni-account.html');
});

// Backwards-compatible alumni routes (older HTML links)
app.get('/alumni-profile', (req, res) => {
    return res.redirect(302, '/alumni-account');
});
app.get('/alumni-job-history', (req, res) => {
    return res.redirect(302, '/alumni-account#job');
});
app.get('/alumni-answer-survey', (req, res) => {
    return res.redirect(302, '/alumni-account#survey');
});

// Short / legacy admin routes
app.get('/admin', (req, res) => {
    return res.redirect(302, '/admin-dashboard');
});
app.get('/admin_dashboard', (req, res) => {
    return res.redirect(302, '/admin-dashboard');
});
app.get('/admin_account', (req, res) => {
    return res.redirect(302, '/admin-account');
});

app.get('/admin-dashboard', (req, res) => {
    return sendPublicFile(res, 'admin_dashboard.html');
});

app.get('/admin-account', (req, res) => {
    return sendPublicFile(res, 'admin-account.html');
});

// Backwards-compatible admin routes (older HTML links)
app.get('/admin-survey-answer', (req, res) => {
    return res.redirect(302, '/admin-account#survey-results');
});
app.get('/admin-survey', (req, res) => {
    return res.redirect(302, '/admin-account#survey-questions');
});
app.get('/admin-alumni', (req, res) => {
    return res.redirect(302, '/admin-account#alumni');
});
app.post('/api-register', async (req, res) => {
    const { fname, mname, lname, contact_no, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO alumni (fname,mname, lname, contact_no, username, password) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [fname, mname, lname, contact_no, username, hashedPassword], (err, result) => {
            if (err) {
                res.status(500).send(err);

            } else {
                res.status(201).send({ message: 'User registered!', userId: result.insertId });
            }
        });
    } catch (err) {
        console.log(err);
    }

});
app.post('/api-login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const checkAdminQuery = 'SELECT * FROM admin_user WHERE username = ?';
        db.query(checkAdminQuery, [username], (err, adminResults) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if (adminResults.length > 0) {
                    const adminUser = adminResults[0];
                    bcrypt.compare(password, adminUser.password, (err, isMatch) => {
                        if (err) {
                            res.status(500).send(err);
                        } else if (!isMatch) {
                            res.status(401).send({ message: 'Invalid username or password' });
                        } else {
                            res.status(200).send([{ message: 'Login successful!', adminUser }, { role: 'admin' }]);
                        }
                    });
                }
                else {
                    const query = 'SELECT * FROM alumni WHERE username = ?';
                    db.query(query, [username], (err, results) => {
                        if (err) {
                            res.status(500).send(err);

                        } else {
                            if (results.length === 0) {
                                return res.status(401).send({ message: 'Invalid username or password' });
                            }

                            const user = results[0];
                            bcrypt.compare(password, user.password, (err, isMatch) => {
                                if (err) {
                                    res.status(500).send(err);
                                } else if (!isMatch) {
                                    res.status(401).send({ message: 'Invalid username or password' });
                                } else {
                                    res.status(200).send([{ message: 'Login successful!', user }, { role: 'alumni' }, { alumni_id: user.alumni_id }, { FullName: user.fname + " " + user.lname }, { username: username }]);
                                }
                            });
                        }
                    });
                }
            }
        });


    } catch (err) {
        console.log(err);
    }

});
// app.post('/users', (req, res) => {
//     const { name, email, age } = req.body;
//     const query = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
//     db.query(query, [name, email, age], (err, result) => {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             res.status(201).send({ message: 'User created!', userId: result.insertId });
//         }
//     });
// });

// app.get('/users', (req, res) => {
//     const query = 'SELECT * FROM users';
//     db.query(query, (err, results) => {
//         if (err) {
//             res.status(500).send('Error fetching users.');
//         } else {
//             res.json(results);
//         }
//     });
// });

// app.put('/users/:id', (req, res) => {
//     const { id } = req.params;
//     const { name, email, age } = req.body;
//     const query = 'UPDATE users SET name=?, email=?, age=? WHERE id=?';
//     db.query(query, [name, email, age, id], err => {
//         if (err) return res.status(500).send('Error updating user.');
//         res.send({ message: 'User updated successfully!' });
//     });
// });

// // ✅ Delete user
// app.delete('/users/:id', (req, res) => {
//     const { id } = req.params;
//     const query = 'DELETE FROM users WHERE id=?';
//     db.query(query, [id], err => {
//         if (err) return res.status(500).send('Error deleting user.');
//         res.send({ message: 'User deleted successfully!' });
//     });
// });

app.post('/api-store-survey', (req, res) => {
    const { survey_question } = req.body;
    const query = 'INSERT INTO survey_question (survey_question) VALUES (?)';
    db.query(query, [survey_question], (err, survey_result) => {
        if (err)
            return res.status(500).send(err);
        else
            return res.status(201).send({ message: 'Survey Question Created Successfully' });

    });
});

app.put('/api-update-survey', (req, res) => {
    const { survey_question, survey_id } = req.body;
    const query = 'UPDATE survey_question SET survey_question=? where survey_question_id=?';
    db.query(query, [survey_question, survey_id], (err, survey_result) => {
        if (err)
            return res.status(500).send(err);
        else
            return res.status(200).send({ message: 'Survey Question Updated Successfully' });

    });
});
app.get('/api-get-survey-question', (req, res) => {
    const query = 'SELECT * FROM survey_question';
    db.query(query, (err, result) => {
        if (err) return res.status(500)
        else return res.json(result);
    });
});
app.get('/api-get-all-alumni', function (req, res) {
    const query = 'SELECT * FROM alumni';
    db.query(query, function (err, results) {
        if (err) return res.status(500);
        else return res.json(results);
    });
});
app.get('/api-get-all-survey_answers', function (req, res) {
    const query = 'SELECT  a.alumni_id as alumni_id, CONCAT_WS(" ", a.fname, a.mname, a.lname) as alumni_name,s.survey_question as survey_question, ans.answer as answer  FROM answer ans  INNER JOIN alumni a ON ans.alumni_id = a.alumni_id INNER JOIN survey_question s ON s.survey_question_id = ans.survey_question_id ';
    db.query(query, function (err, results) {
        if (err) return res.status(500);
        else return res.json(results);
    });
});
app.get('/api-get-all-survey_answers_by_alumni/:alumni_id', function (req, res) {
    const alumni_id = req.params.alumni_id;
    const query = 'SELECT ans.created_at, s.survey_question_id as survey_question_id, s.survey_question as survey_question, ans.answer as answer  FROM answer ans  INNER JOIN alumni a ON ans.alumni_id = a.alumni_id INNER JOIN survey_question s ON s.survey_question_id = ans.survey_question_id WHERE a.alumni_id = ? ORDER BY s.survey_question_id ASC';
    db.query(query, [alumni_id], function (err, results) {
        if (err) return res.status(500);
        else return res.json(results);
    });
});
app.get('/api-check-submission/:alumni_id', function (req, res) {
    const alumni_id = req.params.alumni_id;
    const query = 'SELECT * FROM answer WHERE alumni_id = ?';
    db.query(query, [alumni_id], function (err, results) {
        if (err) {
            return res.status(500);
        }
        else {
            if (results.length > 0) return res.json({ message: "You have already submitted the survey", submitted: true });
            else return res.json({ message: "You have not submitted the survey", submitted: false });

        }
    });
});
app.get('/api-get-all-question', function (req, res) {
    const query = 'SELECT * FROM survey_question';
    db.query(query, function (err, result) {
        if (err) return res.status(500);
        else return res.json(result);
    });
});
app.post('/api-submit-survey', (req, res) => {
    const { alumni_id, answers } = req.body;

    if (!alumni_id || !answers || answers.length === 0) {
        return res.status(400).json({ message: "Missing data" });
    }

    const query = `
        INSERT INTO answer (alumni_id, survey_question_id, answer)
        VALUES ?
    `;

    // Convert to a 2D array for bulk insert
    const values = answers.map(a => [
        alumni_id,
        a.survey_question_id,
        a.answer
    ]);

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error saving answers" });
        }
        res.json({ message: "Survey submitted successfully!" });
    });
});
app.post('/api-store-job-history', (req, res) => {
    const { alumni_id, company_name, position, start_date, end_date } = req.body;
    const query = 'INSERT INTO job_history (alumni_id,company_name,position,start_date,end_date) VALUES (?,?,?,?,?)';
    db.query(query, [alumni_id, company_name, position, start_date, end_date], (err, result) => {
        if (err) return res.status(500).send(err);
        else return res.status(201).send({ message: "Job History Created Successfully" });

    });
});
app.get('/api-get-all-job-history/:alumni_id', (req, res) => {
    const query = 'SELECT * FROM job_history WHERE alumni_id=?';
    db.query(query, [req.params.alumni_id], (err, result) => {
        if (err) return res.status(500).send(err);
        else return res.json(result);
    });
});
app.put('/api-update-job-history', (req, res) => {
    const { job_history_id, company_name, position, start_date, end_date } = req.body;
    const query = 'UPDATE job_history SET company_name=?,position=?,start_date=?,end_date=? WHERE job_history_id=?';
    db.query(query, [company_name, position, start_date, end_date, job_history_id], (err, result) => {
        if (err) return res.status(500).send(err);
        else return res.status(200).send({ message: "Job History Updated Successfully" });
    });
});
app.delete('/api-delete-job-history', (req, res) => {
    const { job_history_id } = req.body;
    const query = 'DELETE FROM job_history WHERE job_history_id=?';
    db.query(query, [job_history_id], (err, result) => {
        if (err) return res.status(500).send(err);
        else return res.status(200).send({ message: "Job History Deleted Successfully" });
    });
})
app.get('/api-get-alumni-info/:alumni_id', (req, res) => {
    const query = 'SELECT * FROM alumni WHERE alumni_id=?';
    db.query(query, [req.params.alumni_id], (err, result) => {
        if (err) return res.status(500).send(err);
        else return res.status(200).send(result);
    });
});
app.put('/api-update-alumni-info', (req, res) => {
    const { alumni_id, fname, mname, lname, contact_no } = req.body;
    const query = 'UPDATE alumni SET fname=?,mname=?,lname=?,contact_no=? WHERE alumni_id=?';
    db.query(query, [fname, mname, lname, contact_no, alumni_id], (err, result) => {
        if (err) return res.status(500).send(err);
        else return res.status(200).send({ message: "Alumni Info Updated Successfully" });
    });
})
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
