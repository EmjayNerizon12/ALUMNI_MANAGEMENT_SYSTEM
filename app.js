const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const bcrypt = require('bcrypt');
const db = require("./db");
app.use(bodyParser.json());

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
        const normalizedUsername = String(username || "").trim();
        if (!normalizedUsername) return res.status(400).send({ message: "Username is required" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const [userId] = await db("alumni").insert({
            fname,
            mname: mname || null,
            lname,
            contact_no: contact_no || null,
            username: normalizedUsername,
            password: hashedPassword,
        });
        res.status(201).send({ message: 'User registered!', userId });
    } catch (err) {
        res.status(500).send({ message: "Registration failed", error: String(err?.message || err) });
    }

});
app.post('/api-login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const normalizedUsername = String(username || "").trim();
        if (!normalizedUsername) return res.status(400).send({ message: "Username is required" });

        const adminUser = await db("admin_user").where({ username: normalizedUsername }).first();
        if (adminUser) {
            const isMatch = await bcrypt.compare(password, adminUser.password);
            if (!isMatch) return res.status(401).send({ message: 'Invalid username or password' });
            return res.status(200).send([{ message: 'Login successful!', adminUser }, { role: 'admin' }]);
        }

        const user = await db("alumni").where({ username: normalizedUsername }).first();
        if (!user) return res.status(401).send({ message: 'Invalid username or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send({ message: 'Invalid username or password' });

        return res
            .status(200)
            .send([
                { message: 'Login successful!', user },
                { role: 'alumni' },
                { alumni_id: user.alumni_id },
                { FullName: user.fname + " " + user.lname },
                { username: normalizedUsername },
            ]);
    } catch (err) {
        res.status(500).send({ message: "Login failed", error: String(err?.message || err) });
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
    (async () => {
        try {
            const { survey_question } = req.body;
            await db("survey_question").insert({ survey_question });
            return res.status(201).send({ message: 'Survey Question Created Successfully' });
        } catch (err) {
            return res.status(500).send({ message: "Failed to create survey question", error: String(err?.message || err) });
        }
    })();
});

app.put('/api-update-survey', (req, res) => {
    (async () => {
        try {
            const { survey_question, survey_id } = req.body;
            await db("survey_question")
                .where({ survey_question_id: survey_id })
                .update({ survey_question, updated_at: db.fn.now() });
            return res.status(200).send({ message: 'Survey Question Updated Successfully' });
        } catch (err) {
            return res.status(500).send({ message: "Failed to update survey question", error: String(err?.message || err) });
        }
    })();
});
app.get('/api-get-survey-question', (req, res) => {
    (async () => {
        try {
            const result = await db("survey_question").select("*");
            return res.json(result);
        } catch (err) {
            return res.status(500).send({ message: "Failed to fetch survey questions", error: String(err?.message || err) });
        }
    })();
});
app.get('/api-get-all-alumni', function (req, res) {
    (async () => {
        try {
            const results = await db("alumni").select("*");
            return res.json(results);
        } catch (err) {
            return res.status(500).send({ message: "Failed to fetch alumni", error: String(err?.message || err) });
        }
    })();
});
app.get('/api-get-all-survey_answers', function (req, res) {
    (async () => {
        try {
            const results = await db("answer as ans")
                .join("alumni as a", "ans.alumni_id", "a.alumni_id")
                .join("survey_question as s", "s.survey_question_id", "ans.survey_question_id")
                .select(
                    "a.alumni_id as alumni_id",
                    db.raw(
                        `TRIM(COALESCE(a.fname,'') || ' ' || COALESCE(a.mname,'') || ' ' || COALESCE(a.lname,'')) as alumni_name`
                    ),
                    "s.survey_question as survey_question",
                    "ans.answer as answer"
                );
            return res.json(results);
        } catch (err) {
            return res.status(500).send({ message: "Failed to fetch survey answers", error: String(err?.message || err) });
        }
    })();
});
app.get('/api-get-all-survey_answers_by_alumni/:alumni_id', function (req, res) {
    (async () => {
        try {
            const alumni_id = req.params.alumni_id;
            const results = await db("answer as ans")
                .join("alumni as a", "ans.alumni_id", "a.alumni_id")
                .join("survey_question as s", "s.survey_question_id", "ans.survey_question_id")
                .where("a.alumni_id", alumni_id)
                .orderBy("s.survey_question_id", "asc")
                .select(
                    "ans.created_at as created_at",
                    "s.survey_question_id as survey_question_id",
                    "s.survey_question as survey_question",
                    "ans.answer as answer"
                );
            return res.json(results);
        } catch (err) {
            return res.status(500).send({ message: "Failed to fetch alumni answers", error: String(err?.message || err) });
        }
    })();
});
app.get('/api-check-submission/:alumni_id', function (req, res) {
    (async () => {
        try {
            const alumni_id = req.params.alumni_id;
            const row = await db("answer").where({ alumni_id }).first("answer_id");
            if (row) return res.json({ message: "You have already submitted the survey", submitted: true });
            return res.json({ message: "You have not submitted the survey", submitted: false });
        } catch (err) {
            return res.status(500).send({ message: "Failed to check submission", error: String(err?.message || err) });
        }
    })();
});
app.get('/api-get-all-question', function (req, res) {
    (async () => {
        try {
            const result = await db("survey_question").select("*");
            return res.json(result);
        } catch (err) {
            return res.status(500).send({ message: "Failed to fetch questions", error: String(err?.message || err) });
        }
    })();
});
app.post('/api-submit-survey', (req, res) => {
    (async () => {
        try {
            const { alumni_id, answers } = req.body;

            if (!alumni_id || !answers || answers.length === 0) {
                return res.status(400).json({ message: "Missing data" });
            }

            await db.transaction(async (trx) => {
                for (const a of answers) {
                    await trx("answer").insert({
                        alumni_id,
                        survey_question_id: a.survey_question_id,
                        answer: a.answer,
                    });
                }
            });

            return res.json({ message: "Survey submitted successfully!" });
        } catch (err) {
            return res.status(500).json({ message: "Error saving answers", error: String(err?.message || err) });
        }
    })();
});
app.post('/api-store-job-history', (req, res) => {
    (async () => {
        try {
            const { alumni_id, company_name, position, start_date, end_date } = req.body;
            await db("job_history").insert({
                alumni_id,
                company_name,
                position,
                start_date: start_date || null,
                end_date: end_date || null,
            });
            return res.status(201).send({ message: "Job History Created Successfully" });
        } catch (err) {
            return res.status(500).send({ message: "Failed to create job history", error: String(err?.message || err) });
        }
    })();
});
app.get('/api-get-all-job-history/:alumni_id', (req, res) => {
    (async () => {
        try {
            const alumni_id = req.params.alumni_id;
            const result = await db("job_history").where({ alumni_id }).select("*");
            return res.json(result);
        } catch (err) {
            return res.status(500).send({ message: "Failed to fetch job history", error: String(err?.message || err) });
        }
    })();
});
app.put('/api-update-job-history', (req, res) => {
    (async () => {
        try {
            const { job_history_id, company_name, position, start_date, end_date } = req.body;
            await db("job_history")
                .where({ job_history_id })
                .update({
                    company_name,
                    position,
                    start_date: start_date || null,
                    end_date: end_date || null,
                    updated_at: db.fn.now(),
                });
            return res.status(200).send({ message: "Job History Updated Successfully" });
        } catch (err) {
            return res.status(500).send({ message: "Failed to update job history", error: String(err?.message || err) });
        }
    })();
});
app.delete('/api-delete-job-history', (req, res) => {
    (async () => {
        try {
            const { job_history_id } = req.body;
            await db("job_history").where({ job_history_id }).del();
            return res.status(200).send({ message: "Job History Deleted Successfully" });
        } catch (err) {
            return res.status(500).send({ message: "Failed to delete job history", error: String(err?.message || err) });
        }
    })();
})
app.get('/api-get-alumni-info/:alumni_id', (req, res) => {
    (async () => {
        try {
            const alumni_id = req.params.alumni_id;
            const result = await db("alumni").where({ alumni_id }).select("*");
            return res.status(200).send(result);
        } catch (err) {
            return res.status(500).send({ message: "Failed to fetch alumni info", error: String(err?.message || err) });
        }
    })();
});
app.put('/api-update-alumni-info', (req, res) => {
    (async () => {
        try {
            const { alumni_id, fname, mname, lname, contact_no } = req.body;
            await db("alumni")
                .where({ alumni_id })
                .update({
                    fname,
                    mname: mname || null,
                    lname,
                    contact_no: contact_no || null,
                    updated_at: db.fn.now(),
                });
            return res.status(200).send({ message: "Alumni Info Updated Successfully" });
        } catch (err) {
            return res.status(500).send({ message: "Failed to update alumni info", error: String(err?.message || err) });
        }
    })();
})
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
