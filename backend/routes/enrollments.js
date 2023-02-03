const router = require('express').Router();
const pool = require('../db');
const { verifyEnrollment } = require('../middleware');
const { getEnrollmentData, getEnrollmentMetrics, getSessionData, getStudentNames } = require('../utils/helpers');

/* Routes */

router.use('/:enrollmentId/sessions', verifyEnrollment, require('./sessions'));

// Section 3
router.get('/', async (req, res) => {
    try {
        /* Get the enrollment summary data */

        async function getEnrollmentSummary() {
            /* Limit to five enrollments, prioritized by not started, paused, and completed */

            const enrollments = await pool.query(
                'SELECT * FROM enrollment WHERE student_id = $1 ORDER BY status LIMIT 5',
                [req.user.id]
            );

            /* For each enrollment, retrieve the necessary data concurrently */

            const summary = await Promise.all(
                enrollments.rows.map(async enrollment => {
                    const {
                        id: enrollmentId,
                        enrollmentName,
                        sessions,
                        status
                    } = await getEnrollmentData(enrollment);

                    const {
                        completedSessions,
                        highScore,
                        currentDate
                    } = getSessionData(sessions);

                    return {
                        id: enrollmentId,
                        name: enrollmentName,
                        completedSessions,
                        highScore,
                        date: currentDate,
                        status
                    };
                })
            );

            return summary;
        }

        /* Retrieve the names and the enrollment summary concurrently */

        const [{ username, nickname }, summary] = await Promise.all([
            getStudentNames(req.user.id),
            getEnrollmentSummary()
        ]);

        const data = {
            username,
            nickname,
            enrollments: summary
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json('Server Error');
    }
});

// Section 4
router.get('/:enrollmentId', verifyEnrollment, async (req, res) => {
    try {
        if (req.enrollment.status === 0) {
            return res.status(403).json('Cannot access until started initial session.');
        }

        /* Get student names and enrollment metrics concurrently */
        
        const [
            { username, nickname },
            { enrollmentName, sessions, actions }
        ] = await Promise.all([
            getStudentNames(req.user.id),
            getEnrollmentMetrics(req.enrollment)
        ]);

        const data = {
            username,
            nickname,
            enrollmentName,
            sessions,
            actions
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json('Server Error');
    }
});

module.exports = router;