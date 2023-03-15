const router = require('express').Router({mergeParams: true});
const pool = require('../db');
const { verifyCurrentQuestion } = require('../middleware');

/* Routes */

// Section 7, 8
router.get('/:order', verifyCurrentQuestion, async (req, res) => {
    try {
        const features = await pool.query(
            'SELECT meta_question.code AS mq_code, question.alt_code, question.json, question.blob, \
            question_set_culture.question_set_code, culture.code AS culture_code, culture.icon FROM question \
            JOIN question_set_culture ON question.qsc_id = question_set_culture.id \
            JOIN culture ON question_set_culture.culture_code = culture.code \
            JOIN meta_question ON question.mq_id = meta_question.id \
            WHERE question.id = $1',
            [req.question.question_id]
        );

        const data = {
            codes: {
                questionSetCode: features.rows[0].question_set_code,
                cultureCode: features.rows[0].culture_code,
                mqCode: features.rows[0].mq_code,
                altCode: features.rows[0].alt_code
            },
            cultureIcon: features.rows[0].icon,
            totalQuestions: req.session.total_questions,
            questionJson: features.rows[0].json,
            imagesBlob: features.rows[0].blob,
            answerOrder: req.question.answer_order,
            studentAnswer: req.question.student_answer
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

// Section 8
router.patch('/:order', verifyCurrentQuestion, async (req, res) => {
    try {
        const {
            enrollmentId,
            sessionId
        } = req.params;
        const order = parseInt(req.params.order);
        const { next } = req.body;

        const date = new Date(Date.now());

        // If starting the next question
        if (next) {
            // Ensure that student answer is not null
            if (!req.question.student_answer) {
                return res.status(403).json({
                    statusCode: 403,
                    error: 'Student must answer current question first.'
                });
            }

            // Complete the current question
            await pool.query(
                'UPDATE session_question SET status = $1, end_time = $2 WHERE session_id = $3 AND question_order = $4',
                [2, date, sessionId, order]
            );

            // If completed all questions, set session to complete
            if (req.session.total_questions === order) {
                await pool.query(
                    'UPDATE session SET status = $1, end_time = $2 WHERE id = $3',
                    [2, date, sessionId]
                );

                // If final session, set enrollment to complete
                if (req.session.attempt === 5) {
                    await pool.query(
                        'UPDATE enrollment SET status = $1 WHERE id = $2',
                        [2, enrollmentId]
                    );
                }

                res.json({ success: 'Completed session!' });
            } 
            // Else, start the next question
            else {
                await pool.query(
                    'UPDATE session_question SET status = $1, start_time = $2 WHERE session_id = $3 AND question_order = $4',
                    [1, date, sessionId, order + 1]
                );

                res.json({ success: 'Started next question!' });
            }
        } 
        // Else, answering the current question
        else {
            // Ensure student is not trying to resubmit
            if (req.question.student_answer) {
                return res.status(403).json({
                    statusCode: 403,
                    error: 'Student cannot reanswer question.'
                });
            }

            const { answer } = req.body;

            // Answer the question
            const sessionQuestions = await pool.query(
                'UPDATE session_question SET student_answer = $1 WHERE session_id = $2 AND question_order = $3 RETURNING correct_answer',
                [answer, sessionId, order]
            );

            // If correct, increment correct answers
            if (answer === sessionQuestions.rows[0].correct_answer) {
                await pool.query(
                    'UPDATE session SET correct = correct + 1 WHERE id = $1',
                    [sessionId]
                );
            } 
            // Else, increment wrong answers
            else {
                await pool.query(
                    'UPDATE session SET wrong = wrong + 1 WHERE id = $1',
                    [sessionId]
                );
            }

            res.json({ success: 'Answered question!' });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            statusCode: 500,
            error: 'Server Error'
        });
    }
});

module.exports = router;