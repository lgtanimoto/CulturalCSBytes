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

        // Ensure student session is in progress for the correct enrollment
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

        // Ensure student is accessing appropriate question
        let sessionQuestions = await pool.query(
            'SELECT question_id, question_order, answer_order FROM session_question WHERE session_id = $1 AND status = $2',
            [sessionId, 1]
        );

        if (sessionQuestions.rows.length === 0) {
            // Find next question not started
            sessionQuestions = await pool.query(
                'SELECT question_id, question_order, answer_order FROM session_question WHERE session_id = $1 AND status = $2 ORDER BY question_order LIMIT 1',
                [sessionId, 0]
            );

            if (sessionQuestions.rows.length === 0) {
                res.status(404).json('Could not find in progress question or not started question for session.');
            } else if (sessionQuestions.rows[0].question_order !== order) {
                res.status(403).json('Student must complete previous questions.');
            }
        } else if (sessionQuestions.rows[0].question_order !== order) {
            res.status(403).json('Student must complete current question.');
        }

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
            answerOrder: sessionQuestions.rows[0].answer_order
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

module.exports = router;