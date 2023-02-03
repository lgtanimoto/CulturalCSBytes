const pool = require('../db');

const getEnrollmentData = async function (enrollment) {
    /* Retrieve necessary fields from enrollment */

    const { 
        id, 
        classroom_id, 
        status, 
        registration_date
    } = enrollment;

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

    /* Retrieve question sets and sessions related to enrollment concurrently */
    
    const [questionSets, sessions] = await Promise.all([
        findQuestionSets(),
        findSessions()
    ]);

    return {
        id,
        name: `${questionSets[0].name} ${registration_date.toLocaleDateString()}`,
        sessions,
        status: {
            started: status !== 0,
            completed: status === 2
        }
    };
}

const getEnrollmentMetrics = async function (enrollment) {
    const {
        enrollmentName,
        sessions,
        status
    } = await getEnrollmentData(enrollment);

    sessions.sort((a, b) => (a.end_date || a.start_date || a.expected_start) - (b.end_date || b.start_date || b.expected_start));
    
    const sessionsData = sessions.map(session => {
        const {
            id: sessionId,
            attempt,
            total_questions,
            cultures,
            status,
            expected_start,
            start_time,
            end_time,
            correct
        } = session;

        function getSessionDate() {
            switch (status) {
                case 1:
                    return start_time;
                case 2:
                    return end_time;
                default:
                    return expected_start;
            }
        }

        const sessionName = getSessionName(attempt);
        const sessionDate = getSessionDate();
        const isOfficialSession = attempt >= 1 && attempt <= 5;

        let data = {
            id: sessionId,
            name: sessionName,
            date: sessionDate
        }

        // If currently in progress or completed, provide additional information
        if (status !== 0) {
            data = {
                ...data,
                cultures,
                correct,
                totalQuestions: total_questions,
                isOfficialSession
            }
        }

        return data;
    });

    const actions = {
        start: false,
        practice: false,
        continue: false
    };

    // If in progress, need to determine what we can do for the current enrollment
    if (status.started && !status.completed) {
        const { currentSession, currentDate } = getSessionData(sessions);
        
        actions.continue = currentSession;
        actions.practice = !currentSession;

        // Can only start if not continuing and last official date was at least one week ago
        const weeks = Math.floor((Date.now() - currentDate) / 1000 / 60 / 60 / 24 / 7);
        actions.start = !currentSession && weeks >= 1;
    }

    return {
        enrollmentName,
        sessions: sessionsData,
        actions
    };
}

const getSessionData = function (sessions) {
    let completedSessions = 0;
    let highScore = 0;
    let currentSession = false;
    let currentDate = null;

    sessions.forEach(session => {
        const {
            attempt,
            total_questions, 
            status,
            correct,
            start_time,
            end_time
        } = session;

        /* Update current session if necesssary */

        if (status === 1) {
            currentSession = true;
        }

        /* Get features for official session */
        
        if (attempt >= 1 && attempt <= 5) {
            if (status === 1) {
                currentDate = start_time > currentDate ? start_time : currentDate;
            } else if (status === 2) {
                currentDate = end_time > currentDate ? end_time : currentDate;
                completedSessions++;
            }
        }

        /* Update high score */
        
        highScore = Math.max(highScore, Math.round(correct * 100.0) / total_questions);
    });

    return {
        completedSessions,
        highScore,
        currentSession,
        currentDate
    };
}

const getSessionName = function (attempt) {
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
}

const getStudentNames = async function (studentId) {
    const students = await pool.query(
        'SELECT username, nickname FROM student WHERE id = $1',
        [studentId]
    );
    return students.rows[0];
}

module.exports = {
    getEnrollmentData,
    getEnrollmentMetrics,
    getSessionData,
    getSessionName,
    getStudentNames
};