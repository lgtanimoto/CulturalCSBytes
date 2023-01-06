const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');

async function findUsers(type, username) {
    const users = await pool.query(
        `SELECT id, username, password FROM ${type} WHERE username = $1`,
        [username]
    );
    return users.rows;
}

/* Registration */

router.post('/register', async (req, res) => {
    try {
        // Destructure the req.body
        const {
            username,
            password,
            nickname,
            email,
            age,
            zipCode,
            initialQuestionSet
        } = req.body;
        
        // Check if user (student or teacher) and question set exists
        async function findQuestionSets() {
            const questionSets = await pool.query(
                'SELECT * FROM question_set WHERE code = $1',
                [initialQuestionSet]
            );
            return questionSets.rows;
        }

        const [students, teachers, questionSets] = await Promise.all([
            findUsers('student', username),
            findUsers('teacher', username),
            findQuestionSets()
        ]);

        if (students.length !== 0 || teachers.length !== 0) {
            return res.status(401).send('User already exists.');
        }

        if (questionSets.length === 0) {
            return res.status(401).send('Question set does not exist.');
        }

        // Bcrypt the user password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // Enter the new student inside our database
        // Find or create an enrollment for a classroom with no teacher and the initial question set
        async function findOrCreateClassroom() {
            const classrooms = await pool.query(
                'SELECT id FROM classroom WHERE question_set_code = $1',
                [initialQuestionSet]
            );

            if (classrooms.rows.length > 0) {
                return classrooms.rows[0].id;
            }

            const classroom = await pool.query(
                'INSERT INTO classroom (question_set_code) VALUES ($1) RETURNING *',
                [initialQuestionSet]
            );
            return classroom.rows[0].id;
        }

        async function createStudent() {
            const student = await pool.query(
                'INSERT INTO student (username, password, nickname, email, age, zip) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [username, bcryptPassword, nickname, email, age, zipCode]
            );
            return student.rows[0].id;
        }

        const [classroomId, studentId] = await Promise.all([
            findOrCreateClassroom(),
            createStudent()
        ]);

        await pool.query(
            'INSERT INTO enrollment (classroom_id, student_id, status) VALUES ($1, $2, $3)',
            [classroomId, studentId, 0]
        );
        
        // Generate our JWT token and return it!
        res.json({ token: jwtGenerator(studentId) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/* Login */

router.post('/login', async (req, res) => {
    try {
        // Destructure the req.body
        const { username, password } = req.body;
        
        // Check if student doesn't exist (if not, then throw error)
        const students = await findUsers('student', username);

        if (students.length === 0) {
            return res.status(401).json('Username or password is incorrect');
        }
        
        // Check if incoming password is the same as the database password
        const isValidPassword = await bcrypt.compare(password, students[0].password);

        if (!isValidPassword) {
            return res.status(401).json('Username or password is incorrect');
        }

        // Give them the JWT token
        res.json({ token: jwtGenerator(students[0].id) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;