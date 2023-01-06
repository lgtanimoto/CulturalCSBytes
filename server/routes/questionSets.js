const router = require('express').Router();
const pool = require('../db');

// GET question-sets
router.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM question_set');
        res.json({ questionSets: data.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;