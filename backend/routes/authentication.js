const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const { DEFAULT_CLASSROOM_ID } = require('../constants');

// Registration
router.post('/register', async (req, res) => {
    try {
        const {
            username,
            password,
            nickname,
            email,
            ages,
            zip
        } = req.body;

        /* Ensure student does not already exist with username */

        let student = await pool.query(
            `SELECT username FROM student WHERE username = $1`,
            [username]
        );

        if (student.rows.length > 0) {
            return res.status(401).send('User already exists.');
        }

        /* Bcrypt the user password */

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, salt);

        /* Create the student */
        
        // If student is younger than 13, don't store email and zip
        if (['less-than-8', '8', '9', '10', '11', '12'].includes(ages)) {
            student = await pool.query(
                'INSERT INTO student (username, password, nickname, age) VALUES ($1, $2, $3, $4) RETURNING id',
                [username, bcryptPassword, nickname, ages]
            );
        }
        // Else, can store email and zip 
        else {
            student = await pool.query(
                'INSERT INTO student (username, password, nickname, age, email, zip) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                [username, bcryptPassword, nickname, ages, email, zip]
            );
        }

        /* Enroll student into the default classroom */

        const enrollment = await pool.query(
            'INSERT INTO enrollment (classroom_id, student_id, status) VALUES ($1, $2, $3) RETURNING id',
            [DEFAULT_CLASSROOM_ID, student.rows[0].id, 0]
        );

        /* Create the sessions for the enrollment */

        const now = Date.now();

        for (let attempt = 1; attempt <= 5; attempt++) {
            // Spread expected dates four weeks apart
            const date = now + 1000 * 60 * 60 * 24 * 7 * 4 * (attempt - 1);

            await pool.query(
                'INSERT INTO session (enrollment_id, attempt, total_questions, expected_start) VALUES ($1, $2, $3, $4)',
                [enrollment.rows[0].id, attempt, 10, new Date(date)]
            );
        }
        
        res.json({ token: jwtGenerator(student.rows[0].id) });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        /* Ensure student with username exists */

        const student = await pool.query(
            `SELECT id, username, password FROM student WHERE username = $1`,
            [username]
        );

        if (student.rows.length === 0) {
            return res.status(401).json('Username or password is incorrect');
        }
        
        /* Compare incoming password to the database password */

        const isValidPassword = await bcrypt.compare(password, student.rows[0].password);

        if (!isValidPassword) {
            return res.status(401).json('Username or password is incorrect');
        }

        res.json({ token: jwtGenerator(student.rows[0].id) });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;