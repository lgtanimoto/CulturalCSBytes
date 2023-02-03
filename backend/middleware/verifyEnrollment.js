const pool = require('../db');

module.exports = async (req, res, next) => {
    try {
        const { enrollmentId } = req.params;

        const enrollments = await pool.query(
            'SELECT * FROM enrollment WHERE id = $1 AND student_id = $2',
            [enrollmentId, req.user.id]
        );

        if (enrollments.rows.length === 0) {
            return res.status(404).json('Cannot find enrollment for student.');
        }

        req.enrollment = enrollments.rows[0];
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).json('Not Authorized');
    }
}