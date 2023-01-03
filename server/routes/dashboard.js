const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async (req, res) => {
    try {

        // req.user has the payload
        const user = await pool.query(
            'SELECT username FROM student WHERE id = $1',
            [req.user]
        );

        res.json(user.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
})

module.exports = router;