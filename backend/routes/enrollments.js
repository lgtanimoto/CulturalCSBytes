const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');
const { DEFAULT_CLASSROOM_ID, INITIAL_SESSION, PRACTICE_SESSION } = require('../constants');

/* Helper Functions */

function getSessionName(attempt) {
    switch (attempt) {
        case 1:
            return 'Initial Session';
        case 5:
            return 'Final Session';
        case 2:
        case 3:
        case 4:
            return `Session ${attempt}`;
        default:
            return 'Practice Session';
    }
}

function getSessionData(sessions, status) {
    let completedSessions = 0;
    let highScore = 0;
    let currentSession = null;
    let currentDate = null;

    if (status !== 0) {
        sessions.forEach(session => {
            const {
                id: sessionId,
                attempt,
                total_questions, 
                status,
                correct,
                end_time
            } = session;

            if (attempt >= 1 && attempt <= 5 && status === 2) {
                completedSessions++;

                // Current date is the most recently completed official session
                if (!currentDate || end_time > currentDate) {
                    currentDate = end_time;
                }
            }

            highScore = Math.max(highScore, Math.round(correct * 100.0) / total_questions);

            // Set current session if status is 1
            currentSession = status === 1 && sessionId;
        });
    }

    return {
        completedSessions,
        highScore,
        currentSession,
        currentDate
    }
}

/* Queries */

async function getStudentNames(studentId) {
    const students = await pool.query(
        'SELECT username, nickname FROM student WHERE id = $1',
        [studentId]
    );
    return students.rows[0];
}

async function getEnrollmentData(enrollment) {
    const { 
        id, 
        classroom_id, 
        status, 
        registration_date
    } = enrollment;

    // Get the question set name and sessions concurrently
    async function findQuestionSets() {
        const questionSets = await pool.query(
            'SELECT question_set.name FROM question_set JOIN classroom ON question_set.code = classroom.question_set_code WHERE classroom.id = $1',
            [classroom_id]
        );
        return questionSets.rows;
    }

    async function findSessions() {
        const sessions = await pool.query(
            'SELECT * FROM session WHERE enrollment_id = $1',
            [id]
        );
        return sessions.rows;
    }

    const [questionSets, sessions] = await Promise.all([
        findQuestionSets(),
        findSessions()
    ]);

    return {
        id,
        enrollmentName: `${questionSets[0].name} ${registration_date.toLocaleDateString()}`,
        sessions,
        status: {
            started: status !== 0,
            completed: status === 2
        }
    };
}

async function getFormData(attempt) {
    const cultures = await pool.query('SELECT * FROM culture');
    const sessionName = getSessionName(attempt);

    let formName = '';
    let difficulties = null;

    // Switch for form name
    switch (attempt) {
        case 1:
            formName = 'Classroom Enrollment/Initial Session';
            break;
        case 5:
            formName = 'Final Session';
            break;
        default:
            formName = 'Session Start';
    }

    // Switch for difficulties
    switch (attempt) {
        case 1:
        case 5:
            difficulties = ['Medium'];
            break;
        default:
            difficulties = ['Easy', 'Medium', 'Difficult'];
    }

    return {
        attempt,
        formName,
        cultures: cultures.rows,
        sessionName,
        difficulties
    };
}

/* Routes */

// GET enrollments
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

            return summary
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

// GET enrollments/:id
router.get('/:id', authorization, async (req, res) => {
    try {
        const { id: enrollmentId } = req.params;

        async function getEnrollmentMetrics() {
            const enrollments = await pool.query(
                'SELECT * FROM enrollment WHERE id = $1 AND student_id = $2',
                [enrollmentId, req.user.id]
            );
            if (enrollments.rows.length === 0) {
                res.status(403).json('Student does not have this enrollment.');
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
                    end_time,
                    correct,
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
                const {
                    currentSession,
                    currentDate
                } = getSessionData(sessions, status);

                actions.continue = currentSession;
                actions.practice = !currentSession;

                // Can only start if not continuing and last official date was at least one week prior
                const weeks = Math.floor((Date.now() - currentDate) / 1000 / 60 / 60 / 24 / 7);
                actions.start = !currentSession && weeks >= 1;
            }

            return {
                enrollmentName,
                sessions: sessionsData,
                status,
                actions
            };
        }

        const [
            { username, nickname },
            { enrollmentName, sessions, status, actions }
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

/* In Progress - Not Ready to Test Yet!!! */

// GET enrollments/:id/start
router.get('/:id/sessions/start', authorization, async (req, res) => {
    /* Get the form data for starting a new official session */
    try {
        const { id: enrollmentId } = req.params;

        const enrollments = await pool.query(
            'SELECT * FROM enrollment WHERE id = $1 AND student_id = $2',
            [enrollmentId, req.user.id]
        );

        if (enrollments.rows.length === 0) {
            res.status(403).json('Cannot access enrollment for student.');
        }

        const {
            sessions,
            status
        } = await getEnrollmentData(enrollments.rows[0]);

        const { completedSessions } = getSessionData(sessions, status);

        // Get the session start form for the next official session
        const data = await getFormData(completedSessions + 1);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// GET enrollments/practice
router.get(':id/sessions/practice', authorization, async (req, res) => {
    /* Get the form data for practicing a */
    try {
        const { id: enrollmentId } = req.params;

        const enrollments = await pool.query(
            'SELECT * FROM enrollment WHERE id = $1 AND student_id = $2',
            [enrollmentId, req.user.id]
        );

        if (enrollments.rows.length === 0) {
            res.status(403).json('Cannot access enrollment for student.');
        }

        const data = await getFormData(PRACTICE_SESSION);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// GET enrollments/:id/continue
router.get('/:id/sessions/continue', authorization, async (req, res) => {
    /* Continue a session */
    try {
        const { id: enrollmentId } = req.params;

        const enrollments = await pool.query(
            'SELECT * FROM enrollment WHERE id = $1 AND student_id = $2',
            [enrollmentId, req.user.id]
        );

        if (enrollments.rows.length === 0) {
            res.status(403).json('Cannot access enrollment for student.');
        }

        const { sessions } = await getEnrollmentData(enrollments.rows[0]);
        const session = sessions.filter(session => session.status === 1);

        // TODO: Get the current question for the session

        res.json(session);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

module.exports = router;