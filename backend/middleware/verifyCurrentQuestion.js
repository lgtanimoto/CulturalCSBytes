const pool = require('../db');

module.exports = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const order = parseInt(req.params.order);

        // NOTE: If question not answered yet, student answer will be null
        let sessionQuestions = await pool.query(
            'SELECT question_id, answer_order, student_answer FROM session_question WHERE session_id = $1 AND question_order = $2 AND status = $3',
            [sessionId, order, 1]
        );

        if (sessionQuestions.rows.length === 0) {
            return res.status(403).json('Student is not currently working on this question.');
        }

        req.question = sessionQuestions.rows[0];
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).json('Not Authorized');
    }
}