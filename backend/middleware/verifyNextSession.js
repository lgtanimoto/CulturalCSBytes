const pool = require('../db');
const { getEnrollmentData, getSessionData } = require('../utils/helpers');

module.exports = async (req, res, next) => {
    try {
        const { enrollmentId } = req.params;

        const { sessions } = await getEnrollmentData(req.enrollment);
        const { completedSessions, currentSession, currentDate } = getSessionData(sessions);

        // If current session going on, must complete current session first
        if (currentSession) {
            return res.status(403).json('Student must complete current session first.');
        }

        const session = await pool.query(
            'SELECT id, attempt FROM session WHERE enrollment_id = $1 AND attempt = $2',
            [enrollmentId, completedSessions + 1]
        );

        req.session = session.rows[0];
        req.date = currentDate;
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).json('Not Authorized');
    }
}