const pool = require('../db');

module.exports = async (req, res, next) => {
    try {
        const {
            enrollmentId,
            sessionId
        } = req.params;

        const sessions = await pool.query(
            'SELECT attempt, total_questions, correct, wrong FROM session WHERE id = $1 AND enrollment_id = $2 AND status = $3',
            [sessionId, enrollmentId, 1]
        );

        if (sessions.rows.length === 0) {
            return res.status(403).json({
                statusCode: 403,
                error: 'Cannot access questions for session not in progress.'
            });
        }

        req.session = sessions.rows[0];
        next();
    } catch (err) {
        return res.status(403).json({
            statusCode: 403,
            error: 'Not Authorized'
        });
    }
}