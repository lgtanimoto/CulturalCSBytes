const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async (req, res) => {
    try {

        // req.user has the payload
        const student = await pool.query(
            'SELECT id FROM student WHERE id = $1',
            [req.user]
        );

        const student_enrollments = await pool.query(
            'SELECT * FROM enrollment WHERE student_id = $1',
            [student.rows[0]['id']]
        );

        const data = student_enrollments.rows.map(async enrollment => {
            const { enrollmentId, classroomId, status, registrationDate } = enrollment;
            
            const questionSet = await pool.query(
                'SELECT question_set.name FROM question_set JOIN classroom ON question_set.code = classroom.question_set_code WHERE classroom.id = $1',
                [classroomId]
            );
            const { questionSetName } = questionSet.rows[0];

            const sessions = await pool.query(
                'SELECT * FROM session WHERE enrollment_id = $1',
                [enrollmentId]
            );

            let completedSessions = 0;
            let highScore = 0;
            let currentDate = null;

            sessions.rows.forEach(async session => {
                const { totalQuestions, status, expectedDate, correct } = session;

                highScore = Math.max(highScore, Math.round(correct * 100.0 / totalQuestions));

                if (status === 1) {
                    completedSessions++;
                }

                if (!currentDate || expectedDate > currentDate) {
                    currentDate = expectedDate;
                }
            });

            return { 
                // Enrollment Name
                questionSetName, 
                registrationDate, 

                // Completed Sessions
                completedSessions,

                // High Score
                highScore,

                // Status
                //   If status = 0, then "Not Started"
                //   If status = 1, then "Paused on currentDate"
                //   Else (status = 2), "Completed on currentDate"
                status,
                currentDate,
            }
        });

        res.json(true);

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
})

module.exports = router;