const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');

/* Registration */

router.post('/register', async (req, res) => {
    try {

        // 1. Destructure the req.body (name, email, password)
        
        const { username, password } = req.body;
        
        // 2. Check if user (student or teacher) exists (if user exists, then throw error)

        const student = await pool.query(
            'SELECT * FROM student WHERE username = $1', 
            [username]
        );

        const teacher = await pool.query(
            'SELECT * FROM teacher WHERE username = $1', 
            [username]
        );

        // If student or teacher already exists with username, send error
        if (student.rows.length !== 0 || teacher.rows.length !== 0) {
            return res.status(401).send('User already exists.')
        }

        // 3. Bcrypt the user password

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4. Enter the new user inside our database

        const newUser = await pool.query(
            'INSERT INTO student (username, password) VALUES ($1, $2) RETURNING *',
            [username, bcryptPassword]
        );
        
        // 5. Generate our jwt token

        const token = jwtGenerator(newUser.rows[0].id);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

/* Login */

router.post('/login', async (req, res) => {
    try {

        // 1. Destructure the req.body

        const { username, password } = req.body;
        
        // 2. Check if user doesn't exist (if not, then throw error)

        const student = await pool.query(
            'SELECT * FROM student WHERE username = $1',
            [username]
        );

        if (student.rows.length === 0) {
            return res.status(401).json('Username or password is incorrect');
        }
        
        // 3. Check if incoming password is the same as the database password

        const isValidPassword = await bcrypt.compare(password, student.rows[0].password);
        
        if (!isValidPassword) {
            return res.status(401).json('Username or password is incorrect');
        }

        // 4. Give them the jwt token

        const token = jwtGenerator(student.rows[0].id);

        res.json({ token });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;