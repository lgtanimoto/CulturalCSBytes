const router = require('express').Router({mergeParams: true});
const pool = require('../db');
const authorization = require('../middleware/authorization');
const { getEnrollmentData, getSessionData, getSessionName } = require('../utils/helpers');

/* Helper Functions */

async function initSession(sessionId, preferredCulture, difficulty, additionalCultures) {
    let difficultyCode = 0;
    switch (difficulty) {
        case 'Easy':
            difficultyCode = 0;
            break;
        case 'Medium':
            difficultyCode = 1;
            break;
        default:
            difficultyCode = 2;
    }

    additionalCultures = additionalCultures.filter(culture => culture !== preferredCulture);
    additionalCultures.unshift(preferredCulture);
    const cultures = additionalCultures.join();

    async function updateSession() {
        await pool.query(
            'UPDATE session SET difficulty = $1, cultures = $2, status = $3, start_time = $4, correct = $5, wrong = $6 WHERE id = $7',
            [difficultyCode, cultures, 1, new Date(Date.now()), 0, 0, sessionId]
        );
    }

    async function insertSessionQuestions() {
        await pool.query(
            'CALL insert_session_questions($1)',
            [sessionId]
        );
    }

    await Promise.all([
        updateSession(),
        insertSessionQuestions()
    ]);

    const question = await pool.query(
        'UPDATE session_question SET status = $1, start_time = $2 WHERE session_id = $3 AND question_order = $4 RETURNING *',
        [1, new Date(Date.now()), sessionId, 1]
    );

    return question.rows[0];
}

/* Routes */

router.use('/:sessionId/questions', require('./questions'));

// Section 5
router.get('/new', authorization, async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { practice } = req.query;

        async function getCultures() {
            const cultures = await pool.query('SELECT * FROM culture');
            return cultures.rows;
        }

        async function getNextSession() {
            // Ensure student has access to enrollment
            const enrollments = await pool.query(
                'SELECT * FROM enrollment WHERE id = $1 AND student_id = $2',
                [enrollmentId, req.user.id]
            );
            if (enrollments.rows.length === 0) {
                res.status(404).json('Could not find enrollment for student.');
            }

            const { sessions, status } = await getEnrollmentData(enrollments.rows[0]);

            if (status === 2) {
                res.status(403).json('Student has already completed enrollment.');
            } else {
                const { completedSessions, currentSession } = getSessionData(sessions, status);
                if (currentSession) {
                    res.status(403).json('Cannot start new session until completed current session.');
                }
                const session = await pool.query(
                    'SELECT id, attempt FROM session WHERE enrollment_id = $1 AND attempt = $2',
                    [enrollmentId, completedSessions + 1]
                );
                return session.rows[0];
            }
        }

        const [cultures, nextSession] = await Promise.all([
            getCultures(),
            getNextSession()
        ]);

        const isPractice = practice && nextSession.attempt !== 1;
        const attempt = isPractice ? 0 : nextSession.attempt;
        const difficulties = attempt != 1 && attempt != 5 ? ['Easy', 'Medium', 'Difficult'] : ['Medium'];
        
        const data = {
            sessionId: !isPractice && nextSession.id,
            cultures,
            sessionName: getSessionName(attempt),
            difficulties
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// Section 6 - Practice Session
router.post('/', authorization, async (req, res) => {
    try {
        const { enrollmentId } = req.params;

        const {
            preferredCulture,
            difficulty,
            additionalCultures
        } = req.body;

        const session = await pool.query(
            'INSERT INTO session (enrollment_id, attempt, total_questions) VALUES ($1, $2, $3) RETURNING *',
            [enrollmentId, 0, 10]
        );

        const question = await initSession(session.rows[0].id, preferredCulture, difficulty, additionalCultures);
        res.json(question);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// Section 6 - Official Session
router.patch('/:sessionId', authorization, async (req, res) => {
    try {
        const { 
            enrollmentId,
            sessionId
        } = req.params;

        const {
            preferredCulture,
            difficulty,
            additionalCultures
        } = req.body;

        const session = await pool.query(
            'SELECT attempt FROM session WHERE id = $1',
            [sessionId]
        );
        if (session.rows[0].attempt === 1) {
            await pool.query(
                'UPDATE enrollment SET status = $1 WHERE id = $2',
                [1, enrollmentId]
            );
        }

        const question = await initSession(sessionId, preferredCulture, difficulty, additionalCultures);
        res.json(question);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

module.exports = router;