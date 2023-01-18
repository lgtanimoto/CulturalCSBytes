const pool = require('../db');

const helpers = {
    getEnrollmentData: async function (enrollment) {
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
    },
    getSessionData: function (sessions, status) {
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
    },
    getSessionName: function (attempt) {
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
    },
};

module.exports = helpers;