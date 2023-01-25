const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');
const { getEnrollmentData, getSessionData, getSessionName } = require('../utils/helpers');

/* Helper Functions */

async function getStudentNames(studentId) {
    const students = await pool.query(
        'SELECT username, nickname FROM student WHERE id = $1',
        [studentId]
    );
    return students.rows[0];
}

/* Routes */

router.use('/:enrollmentId/sessions', require('./sessions'));

// Section 3
router.get('/', authorization, async (req, res) => {
    try {
        // Getting the enrollment summary can be done concurrently with student names
        async function getEnrollmentSummary() {
            // Limit to five enrollments, ordered by not started, paused, and completed
            const enrollments = await pool.query(
                'SELECT * FROM enrollment WHERE student_id = $1 ORDER BY status LIMIT 5',
                [req.user.id]
            );

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
                    } = getSessionData(sessions, status);

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
        res.status(500).json('Server Error');
    }
});

// Section 4
router.get('/:enrollmentId', authorization, async (req, res) => {
    try {
        const { enrollmentId } = req.params;

        async function getEnrollmentMetrics() {
            const enrollments = await pool.query(
                'SELECT * FROM enrollment WHERE id = $1 AND student_id = $2',
                [enrollmentId, req.user.id]
            );
            if (enrollments.rows.length === 0) {
                res.status(404).json('Could not find enrollment for student.');
            }

            const {
                enrollmentName,
                sessions,
                status
            } = await getEnrollmentData(enrollments.rows[0]);
            if (!status.started) {
                res.status(403).json('Student cannot access metrics until started initial session.');
            }

            // Sort sessions by end date, start date, or expected start
            sessions.sort((a, b) => (a.end_date || a.start_date || a.expected_start) - (b.end_date || b.start_date || b.expected_start));
            
            const sessionsData = sessions.map(session => {
                const {
                    id: sessionId,
                    attempt,
                    total_questions,
                    cultures,
                    status,
                    expected_start,
                    start_time,
                    end_time,
                    correct
                } = session;

                function getSessionDate() {
                    switch (status) {
                        case 1:
                            return start_time;
                        case 2:
                            return end_time;
                        default:
                            return expected_start;
                    }
                }

                const sessionName = getSessionName(attempt);
                const sessionDate = getSessionDate();

                // This will be important for the chart (I think)
                const isOfficialSession = attempt >= 1 && attempt <= 5;

                let data = {
                    id: sessionId,
                    name: sessionName,
                    date: sessionDate
                }

                // If currently in progress or completed, want additional info
                if (status !== 0) {
                    data = {
                        ...data,
                        cultures,
                        correct,
                        totalQuestions: total_questions,
                        isOfficialSession
                    }
                }

                return data;
            });

            const actions = {
                start: false,
                practice: false,
                continue: false
            };

            // If in progress, need to determine what we can do for the current enrollment
            if (status.started && !status.completed) {
                const { currentSession, currentDate } = getSessionData(sessions, status);

                actions.continue = currentSession ? true : false;
                actions.practice = currentSession ? false : true;

                // Can only start if not continuing and last official date was at least one week prior
                const weeks = Math.floor((Date.now() - currentDate) / 1000 / 60 / 60 / 24 / 7);
                actions.start = !currentSession && weeks >= 1;
            }

            return {
                enrollmentName,
                sessions: sessionsData,
                actions
            };
        }

        const [
            { username, nickname },
            { enrollmentName, sessions, actions }
        ] = await Promise.all([
            getStudentNames(req.user.id),
            getEnrollmentMetrics()
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
        res.status(500).json('Server Error');
    }
});

module.exports = router;