const router = require('express').Router({mergeParams: true});
const pool = require('../db');
const { verifyCompleteSession, verifyCurrentEnrollment, verifyCurrentSession, verifyNextSession } = require('../middleware');
const { getEnrollmentData, getEnrollmentMetrics, getSessionName, getStudentNames } = require('../utils/helpers');

/* Helper Functions */

async function initSession(sessionId, preferredCulture, difficulty, additionalCultures) {
    /* Define difficulty code based on field */

    let difficultyCode = 1;

    switch (difficulty) {
        case 'Easy':
            difficultyCode = 1;
            break;
        case 'Medium':
            difficultyCode = 2;
            break;
        default:
            difficultyCode = 3;
    }

    /* Create a string for the list of all the cultures, starting with the preferred culture */
    
    const cultures = [preferredCulture];
    additionalCultures = additionalCultures ? additionalCultures.filter(culture => culture !== preferredCulture) : [];
    cultures.push(...additionalCultures);

    async function updateSession() {
        await pool.query(
            'UPDATE session SET difficulty = $1, cultures = $2, status = $3, start_time = $4, correct = $5, wrong = $6 WHERE id = $7',
            [difficultyCode, cultures.join(','), 1, new Date(Date.now()), 0, 0, sessionId]
        );
    }

    async function insertSessionQuestions() {
        /* Get the question distribution for each culture */

        const cultureDistr = [];
        let rem = 20;
        for (let i = 0; i < cultures.length; i++) {
            let alloc = i === 0 ? 
                Math.round(20.0 * 2 / (cultures.length + 1)) :
                Math.round(rem / (cultures.length - i));
            cultureDistr.push(alloc);
            rem -= alloc;
        }

        /* Get the difficulty distribution for each culture */

        const totalDistr = [];

        for (let i = 0; i < cultureDistr.length; i++) {
            const diffDistr = [0, 0, 0];
            diffDistr[difficultyCode - 1] = Math.round(cultureDistr[i] * 4 / 10.0);
            
            let totalRem = cultureDistr[i] - diffDistr[difficultyCode - 1];
            let diffRem = 2;
            for (let j = 1; j <= 3; j++) {
                if (j !== difficultyCode) {
                    diffDistr[j - 1] = Math.round(totalRem / diffRem);
                    totalRem -= diffDistr[j - 1];
                    diffRem--;
                }
            }

            totalDistr.push(...diffDistr);
        }

        /* Pass the session to add the questions to and the distribution of culture/difficulty */

        await pool.query(
            'CALL insert_session_questions($1, $2, $3)',
            [sessionId, cultures, totalDistr]
        );
    }

    /* Initialize the session and insert session questions concurrently */
    
    await Promise.all([
        updateSession(),
        insertSessionQuestions()
    ]);

    /* Start the first question */
    
    await pool.query(
        'UPDATE session_question SET status = $1, start_time = $2 WHERE session_id = $3 AND question_order = $4 RETURNING *',
        [1, new Date(Date.now()), sessionId, 1]
    );
}

/* Routes */

router.use('/:sessionId/questions', verifyCurrentEnrollment, verifyCurrentSession, require('./questions'));

// Section 3,4 - Continue
router.get('/continue', verifyCurrentEnrollment, async (req, res) => {
    try {
        const { enrollmentId } = req.params;

        /* Find session in progress */

        const sessions = await pool.query(
            'SELECT id FROM session WHERE enrollment_id = $1 AND status = $2',
            [enrollmentId, 1]
        );

        // If no session in progress, redirect to starting new session
        if (sessions.rows.length === 0) {
            return res.json({
                redirect: true,
                route: 'new'
            })
        }

        /* Access question in progres */

        let sessionQuestions = await pool.query(
            'SELECT question_id, question_order, answer_order, student_answer FROM session_question WHERE session_id = $1 AND status = $2',
            [sessions.rows[0].id, 1]
        );

        res.json({
            redirect: true,
            route: {
                sessionId: sessions.rows[0].id,
                questionOrder: sessionQuestions.rows[0].question_order
            }
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            statusCode: 500,
            error: 'Server Error'
        });
    }
});

// Section 5
router.get('/new', verifyCurrentEnrollment, verifyNextSession, async (req, res) => {
    try {
        const { practice } = req.query;

        // If current date is less than one week ago, redirect to practice session
        if (req.date != null) {
            const weeks = Math.floor((Date.now() - req.date) / 1000 / 60 / 60 / 24 / 7);

            if (!practice && weeks < 1) {
                return res.json({
                    redirect: true,
                    route: 'new',
                    params: { practice: true }
                });
            }
        }

        const cultures = await pool.query('SELECT * FROM culture');

        const isPractice = practice && req.session.attempt !== 1;
        const attempt = isPractice ? 0 : req.session.attempt;
        const difficulties = attempt != 1 && attempt != 5 ? ['Easy', 'Medium', 'Difficult'] : ['Medium'];
        
        const data = {
            sessionId: !isPractice && req.session.id,
            sessionName: getSessionName(attempt),
            cultures: cultures.rows,
            difficulties
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            statusCode: 500,
            error: 'Server Error'
        });
    }
});

// Section 6 - Practice Session
router.post('/', verifyCurrentEnrollment, verifyNextSession, async (req, res) => {
    try {
        const { enrollmentId } = req.params;

        const {
            preferredCulture,
            difficulty,
            additionalCultures
        } = req.body;

        if (req.session.attempt === 1) {
            return res.status(403).json({
                statusCode: 403,
                error: 'Cannot start practice session until completed initial session.'
            });
        }

        const session = await pool.query(
            'INSERT INTO session (enrollment_id, attempt, total_questions) VALUES ($1, $2, $3) RETURNING *',
            [enrollmentId, 0, 20]
        );

        await initSession(session.rows[0].id, preferredCulture, difficulty, additionalCultures);
        
        res.json({ sessionId: session.rows[0].id });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            statusCode: 500,
            error: 'Server Error'
        });
    }
});

// Section 6 - Official Session
router.patch('/:sessionId', verifyCurrentEnrollment, verifyNextSession, async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const sessionId = parseInt(req.params.sessionId);

        const {
            preferredCulture,
            difficulty,
            additionalCultures
        } = req.body;

        // If starting the wrong session, return error
        if (sessionId !== req.session.id) {
            return res.status(403).json({
                statusCode: 403,
                error: 'Cannot start this session.'
            });
        }

        // If current date is less than one week ago, return error
        if (req.date != null) {
            const weeks = Math.floor((Date.now() - req.date) / 1000 / 60 / 60 / 24 / 7);
            if (weeks < 1) {
                return res.status(403).json({
                    statusCode: 403,
                    error: 'Must wait at least one week to start next official session.'
                });
            }
        }

        // If the initial session, start the enrollment
        if (req.session.attempt === 1) {
            await pool.query(
                'UPDATE enrollment SET status = $1 WHERE id = $2',
                [1, enrollmentId]
            );
        }

        await initSession(sessionId, preferredCulture, difficulty, additionalCultures);
        
        res.json({ success: 'Started official session!' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            statusCode: 500,
            error: 'Server Error'
        });
    }
});

// Section 9 - Recommendations
router.get('/:sessionId/recommendations', verifyCompleteSession, async (req, res) => {
    try {
        const { sessionId } = req.params;

        function filter(resources) {
            const result = []
            const map = {}

            resources.forEach(inner => {
                inner.forEach(resource => {
                    if (!(resource.code in map)) {
                        result.push(resource);
                        map[resource.code] = resource;
                    }
                });
            });

            return result;
        }

        async function getCultureResources() {
            const cultures = req.session.cultures.split(',');
            
            const cultureResources = await Promise.all(cultures.map(async culture => {
                const resources = await pool.query(
                    'SELECT resources.code, resources.title, resources.url FROM resources \
                    JOIN resource_culture_links ON resources.code = resource_culture_links.resource_code \
                    JOIN culture ON resource_culture_links.culture_code = culture.code \
                    WHERE culture.name = $1',
                    [culture]
                );

                return resources.rows;
            }));

            return filter(cultureResources);
        }

        async function getQuestionSetResources() {
            const cultures = req.session.cultures.split(',');

            const questionSetResources = await Promise.all(cultures.map(async culture => {
                const resources = await pool.query(
                    'SELECT resources.code, resources.title, resources.url FROM resources \
                    JOIN resource_qsc_links ON resources.code = resource_qsc_links.resource_code \
                    JOIN question_set_culture ON resource_qsc_links.qsc_id = question_set_culture.id \
                    JOIN culture ON question_set_culture.culture_code = culture.code \
                    WHERE culture.name = $1',
                    [culture]
                );

                return resources.rows;
            }));

            return filter(questionSetResources);
        }

        async function getQuestionMissedResources() {
            const resources = await pool.query(
                'SELECT resources.code, resources.title, resources.url FROM resources \
                JOIN resource_question_links ON resources.code = resource_question_links.resource_code \
                JOIN question ON resource_question_links.question_id = question.id \
                JOIN session_question ON question.id = session_question.question_id \
                WHERE session_question.session_id = $1 AND session_question.correct_answer != session_question.student_answer',
                [sessionId]
            );

            return filter([resources.rows]);
        }

        const [{ nickname }, { enrollmentName }, cultureResources, questionSetResources, questionMissedResources] = await Promise.all([
            getStudentNames(req.user.id),
            getEnrollmentData(req.enrollment),
            getCultureResources(),
            getQuestionSetResources(),
            getQuestionMissedResources()
        ]);

        const data = {
            nickname,
            correct: req.session.correct,
            totalQuestions: req.session.total_questions,
            sessionName: getSessionName(req.session.attempt),
            enrollmentName,
            resources: {
                culture: cultureResources,
                questionSet: questionSetResources,
                questionMissed: questionMissedResources
            }
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            statusCode: 500,
            error: 'Server Error'
        });
    }
});

// Section 10 - Results
router.get('/:sessionId/results', verifyCompleteSession, async (req, res) => {
    try {
        const [{ nickname }, { enrollmentName, sessions }] = await Promise.all([
            getStudentNames(req.user.id),
            getEnrollmentMetrics(req.enrollment)
        ]);

        const data = {
            nickname,
            correct: req.session.correct,
            totalQuestions: req.session.total_questions,
            enrollmentName,
            sessions
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            statusCode: 500,
            error: 'Server Error'
        });
    }
});

module.exports = router;