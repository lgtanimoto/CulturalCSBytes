const router = require('express').Router({mergeParams: true});
const pool = require('../db');
const authorization = require('../middleware/authorization');
const { getEnrollmentData, getSessionData, getSessionName } = require('../utils/helpers');

/* Routes */

// GET enrollments/:enrollmentId/sessions/new
router.get('/new', authorization, async (req, res) => {
    /* Session Form */
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
                res.status(403).json('Student does not have this enrollment.');
            }

            const { sessions, status } = await getEnrollmentData(enrollments.rows[0]);

            if (status === 0) {
                return 1;
            } else if (status === 2) {
                res.status(403).json('Student has already completed enrollment.')
            } else {
                const { completedSessions } = getSessionData(sessions, status);
                return completedSessions + 1;
            }
        }

        const [cultures, nextSession] = await Promise.all([
            getCultures(),
            getNextSession()
        ]);

        const attempt = practice ? 0 : nextSession;
        const difficulties = attempt != 1 && attempt != 5 ? ['Easy', 'Medium', 'Difficult'] : ['Medium'];
        
        const data = {
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

// POST enrollments/:enrollmentId/sessions
router.post('/', authorization, async (req, res) => {
    /* Practice Session */

    // Get body data

    // Add new practice session (attempt = -1) WHERE enrollment id

    // Add to session question

    // Return first session question
});

// PUT enrollments/:enrollmentId/sessions
router.put('/', authorization, async (req, res) => {
    /* Official Session */

    // Same as POST, except we find the session in the DB
});

// PATCH enrollments/:enrollmentId/sessions
router.patch('/', authorization, async (req, res) => {
    /* Update correct, wrong, end time */
    
    // Same as POST, except we find the session in the DB
});

module.exports = router;