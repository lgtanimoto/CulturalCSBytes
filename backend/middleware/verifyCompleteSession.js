const pool = require('../db');

module.exports = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        /* Get session metrics */

        const sessions = await pool.query(
            'SELECT attempt, total_questions, cultures, correct, wrong FROM session WHERE id = $1 AND status = $2',
            [sessionId, 2]
        );

        if (sessions.rows.length === 0) {
            return res.status(404).json('Cannot find completed session.');
        }
        
        req.session = sessions.rows[0];
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).json('Not Authorized');
    }
}