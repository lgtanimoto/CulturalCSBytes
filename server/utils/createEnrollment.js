const pool = require('../db');
const { DEFAULT_CLASSROOM_ID } = require('../constants');

async function createEnrollment(userId) {
    const newEnrollment = await pool.query(
        'INSERT INTO enrollment (classroom_id, student_id, status) VALUES ($1, $2, $3) RETURNING *',
        [DEFAULT_CLASSROOM_ID, userId, 0]
    );

    return newEnrollment;
}

module.exports = createEnrollment;