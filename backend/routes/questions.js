const router = require('express').Router({mergeParams: true});
const pool = require('../db');
const authorization = require('../middleware/authorization');

/* Routes */

// Section 7
router.get('/:order', authorization, async (req, res) => {
    try {
        const {
            enrollmentId,
            sessionId
        } = req.params;

        // Integer version of order
        const order = parseInt(req.params.order);

        /* Ensure student session is in progress for the correct enrollment */

        const enrollments = await pool.query(
            'SELECT id FROM enrollment WHERE id = $1 AND student_id = $2',
            [enrollmentId, req.user.id]
        );

        if (enrollments.rows.length === 0) {
            res.status(404).json('Could not find enrollment for student.');
        }

        const sessions = await pool.query(
            'SELECT total_questions FROM session WHERE id = $1 AND enrollment_id = $2 AND status = $3',
            [sessionId, enrollmentId, 1]
        );

        if (sessions.rows.length === 0) {
            res.status(404).json('Could not find in progress session for enrollment.');
        }

        /* Ensure student is accessing appropriate question */

        let sessionQuestions = await pool.query(
            'SELECT question_id, question_order, answer_order, student_answer FROM session_question WHERE session_id = $1 AND status = $2',
            [sessionId, 1]
        );

        if (sessionQuestions.rows.length === 0) {
            // Find last question completed
            sessionQuestions = await pool.query(
                'SELECT question_id, question_order, answer_order, student_answer FROM session_question WHERE session_id = $1 AND status = $2 ORDER BY question_order DESC LIMIT 1',
                [sessionId, 2]
            );

            if (sessionQuestions.rows.length === 0) {
                res.status(404).json('Could not find in progress question or last completed question for session.');
            } else if (sessionQuestions.rows[0].question_order !== order) {
                res.status(403).json('Student must complete previous question.');
            }
        } else if (sessionQuestions.rows[0].question_order !== order) {
            res.status(403).json('Student must complete previous question.');
        }

        /* Get icon for the question */

        const questions = await pool.query(
            'SELECT qsc_id, json FROM question WHERE id = $1',
            [sessionQuestions.rows[0].question_id]
        );

        const questionSetCultures = await pool.query(
            'SELECT culture_code FROM question_set_culture WHERE id = $1',
            [questions.rows[0].qsc_id]
        );

        const cultures = await pool.query(
            'SELECT icon FROM culture WHERE code = $1',
            [questionSetCultures.rows[0].culture_code]
        );

        const data = {
            cultureIcon: cultures.rows[0].icon,
            totalQuestions: sessions.rows[0].total_questions,
            questionJson: questions.rows[0].json,
            answerOrder: sessionQuestions.rows[0].answer_order,
            studentAnswer: sessionQuestions.rows[0].student_answer
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// Section 8
router.patch('/:order', authorization, async (req, res) => {
    try {
        const {
            enrollmentId,
            sessionId
        } = req.params;
        const order = parseInt(req.params.order);
        const { next } = req.body;

        const date = new Date(Date.now());

        const sessions = await pool.query(
            'SELECT attempt, total_questions, correct, wrong FROM session WHERE id = $1 AND enrollment_id = $2 AND status = $3',
            [sessionId, enrollmentId, 1]
        );

        // If switching to the next question
        if (next) {
            // If completed all sessions
            if (sessions.rows[0].total_questions === order) {
                // Set session to complete
                await pool.query(
                    'UPDATE session SET status = $1, end_time = $2 WHERE id = $3',
                    [2, date, sessionId]
                );

                // If final session, set enrollment to complete
                if (sessions.rows[0].attempt === 5) {
                    await pool.query(
                        'UPDATE enrollment SET status = $1 WHERE id = $2',
                        [2, enrollmentId]
                    );
                }

                // TBD
                res.redirect('../../..');
            } else {
                // Start the next question
                await pool.query(
                    'UPDATE session_question SET status = $1, start_time = $2 WHERE session_id = $3 AND question_order = $4',
                    [1, date, sessionId, order + 1]
                );

                res.redirect(`${order + 1}`);
            }
        } 
        // Else, update question as correct or wrong
        else {
            // Complete current question
            const { answer } = req.body;

            const sessionQuestions = await pool.query(
                'UPDATE session_question SET status = $1, student_answer = $2, end_time = $3 WHERE session_id = $4 AND question_order = $5 RETURNING correct_answer',
                [2, answer, date, sessionId, order]
            );

            // Update correct or wrong answers for session
            if (answer === sessionQuestions.rows[0].correct_answer) {
                await pool.query(
                    'UPDATE session SET correct = $1 WHERE id = $2',
                    [sessions.rows[0].correct + 1, sessionId]
                );
            } else {
                await pool.query(
                    'UPDATE session SET wrong = $1 WHERE id = $2',
                    [sessions.rows[0].wrong + 1, sessionId]
                );
            }

            res.redirect(`${order}`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

module.exports = router;