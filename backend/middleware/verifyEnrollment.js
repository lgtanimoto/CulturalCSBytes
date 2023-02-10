const pool = require('../db');

module.exports = async (req, res, next) => {
    try {
        const { enrollmentId } = req.params;

        const enrollments = await pool.query(
            'SELECT * FROM enrollment WHERE id = $1 AND student_id = $2',
            [enrollmentId, req.user.id]
        );

        if (enrollments.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                error: 'Cannot find enrollment for student.'
            });
        }

        req.enrollment = enrollments.rows[0];
        next();
    } catch (err) {
        return res.status(403).json({
            statusCode: 403,
            error: 'Not Authorized'
        });
    }
}