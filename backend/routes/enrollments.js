const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');
const { DEFAULT_CLASSROOM_ID, INITIAL_SESSION } = require('../constants');

function getSessionName(attempt) {
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

function getEnabledActions(sessions, status) {
    let canStart = true;
    let canPractice = true;
    let canContinue = false;

    let lastCompletionDate = null;
    let currentSession = 1;

    sessions.forEach(session => {
        const {
            attempt,
            status,
            expected_start: expectedStart,
            end_time: endTime,
        } = session;

        const sessionDate = status === 2 ? endTime.toDate() : expectedStart.toDate();
        const isOfficialSession = attempt >= 1 && attempt <= 5;

        // Any session in progress (status === 1) must be the current session
        if (status === 1) {
            canStart = false;
            canPractice = false;
            canContinue = true;
            currentSession = attempt;
        }
        // If no session is in progress so far and is latest completed official session
        if (!canContinue && isOfficialSession && status === 2 && attempt > currentSession) {
            lastCompletionDate = sessionDate;
            currentSession = attempt + 1;
        }
    });

    // If not continuing session so far
    if (!canContinue) {
        // If completed at least one official session, check time since
        if (lastCompletionDate) {
            const weeks = Math.floor((Date.now() - lastCompletionDate) / 1000 / 60 / 60 / 24 / 7);
            canStart = canStart && weeks >= 1;
        }
        // Else, cannot practice
        else {
            canPractice = false;
        }
       
    }

    // If whole enrollment complete, cannot start, practice, or continue
    if (status === 2) {
        canStart = false;
        canPractice = false;
        canContinue = false;
    }

    return {
        actions: {
            start: canStart,
            practice: canPractice,
            continue: canContinue,
        },
        lastCompletionDate,
        currentSession,
    }
}

async function getStudentNames(studentId) {
    const students = await pool.query(
        'SELECT username, nickname FROM student WHERE id = $1',
        [studentId]
    );
    return students.rows[0];
}

async function getEnrollmentData(enrollment) {
    const { 
        id: enrollmentId, 
        classroom_id: classroomId, 
        status, 
        registration_date: registrationDate
    } = enrollment;

    // Get the question set name and sessions concurrently
    async function findQuestionSets() {
        const questionSets = await pool.query(
            'SELECT question_set.name FROM question_set JOIN classroom ON question_set.code = classroom.question_set_code WHERE classroom.id = $1',
            [classroomId]
        );
        return questionSets.rows;
    }

    async function findSessions() {
        const sessions = await pool.query(
            'SELECT * FROM session WHERE enrollment_id = $1',
            [enrollmentId]
        );
        return sessions.rows;
    }

    const [questionSets, sessions] = await Promise.all([
        findQuestionSets(),
        findSessions()
    ]);

    return {
        enrollmentId,
        enrollmentName: `${questionSets[0].name} ${registrationDate.toLocaleDateString()}`,
        sessions,
        status,
    };
}

async function getSessionFormData(attempt) {
    const questionSets = await pool.query('SELECT * FROM question_set');
    const cultures = await pool.query('SELECT * FROM culture');
    const sessionName = getSessionName(attempt);

    let formName = '';
    let difficulties = null;

    // Switch for form name
    switch (attempt) {
        case 1:
            formName = 'Classroom Enrollment/Initial Session';
            break;
        case 5:
            formName = 'Final Session';
            break;
        default:
            formName = 'Session Start';
    }

    // Switch for difficulties
    switch (attempt) {
        case 1:
        case 5:
            difficulties = ['Medium'];
            break;
        default:
            difficulties = ['Easy', 'Medium', 'Difficult'];
    }

    return {
        formName,
        questionSets,
        cultures,
        sessionName,
        difficulties,
    };
};

// GET enrollments
router.get('/', authorization, async (req, res) => {
    try {
        // Getting the enrollment summary can be done concurrently with student names
        async function getEnrollmentSummary() {
            // req.user has the payload
            const studentEnrollments = await pool.query(
                'SELECT * FROM enrollment WHERE student_id = $1 ORDER BY registration_date DESC LIMIT 5',
                [req.user]
            );

            let canAddEnrollment = true;

            const summary = await Promise.all(
                studentEnrollments.rows.map(async enrollment => {
                    const {
                        enrollmentId,
                        enrollmentName,
                        sessions,
                        status
                    } = await getEnrollmentData(enrollment);
        
                    // Aggregate stats for enrollment sessions
                    let completedSessions = 0;
                    let highScore = 0;

                    sessions.forEach(session => {
                        const {
                            attempt,
                            total_questions: totalQuestions, 
                            status,
                            correct 
                        } = session;
        
                        highScore = Math.max(highScore, Math.round(correct * 100.0 / totalQuestions));
        
                        if (attempt >= 1 && attempt <= 5 && status === 1) {
                            completedSessions++;
                        }
                    });

                    const { lastOfficialDate, currentSession } = getEnabledActions(sessions, status);
        
                    // Miscellaneous Features
                    let statusStr = '';
                    let actionStr = 'Continue';
                    let canGetStats = true;
                    let canStartOrContinue = true;
                    switch (status) {
                        case 1:
                            statusStr = `Paused on ${lastOfficialDate.toLocaleDateString()}`;
                            break;
                        case 2:
                            statusStr = `Completed on ${lastOfficialDate.toLocaleDateString()}`;
                            canStartOrContinue = false;
                            break;
                        default:
                            statusStr = 'Not Started';
                            actionStr = 'Start';
                            canGetStats = false;
                            break;
                    }
        
                    // Each enrollment must have at least one completed official session to be true
                    canAddEnrollment = canAddEnrollment && completedSessions >= 1;
        
                    return {
                        id: enrollmentId,
                        enrollmentName,
                        completedSessions,
                        highScore,
                        status: statusStr,
                        action: actionStr,
                        canGetStats,
                        canStartOrContinue,
                        currentSession,
                    }
                })
            );

            return {
                enrollments: summary,
                canAddEnrollment,
            }
        }

        const [{ username, nickname }, { enrollments, canAddEnrollment }] = await Promise.all([
            getStudentNames(req.user),
            getEnrollmentSummary()
        ]);

        const data = {
            username,
            nickname: nickname || '',
            enrollments,
            canAddEnrollment
        };
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// GET enrollments/add
router.get('/add', authorization, async (req, res) => {
    const data = await sessionForm(INITIAL_SESSION);
    res.json(data);
});

// GET enrollments/:id
router.get('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;

        async function getEnrollmentMetrics() {
            // Retrieve the enrollment with the matching id
            // Need to make sure student_id matches for authorization reasons
            const enrollments = await pool.query(
                'SELECT * FROM enrollment WHERE student_id = $1 AND id = $2',
                [req.user, id]
            );

            if (enrollments.rows.length === 0) {
                res.status(403).json('Student is not enrolled in this course.');
            }

            const {
                enrollmentName,
                sessions,
                status
            } = await getEnrollmentData(enrollments.rows[0]);

            // Sort sessions by completion date or expected completion date (same as expected start date)
            sessions.sort((a, b) => (a.end_date || a.expected_start) - (b.end_date || b.expected_start));
            
            const sessionsData = sessions.map(session => {
                const {
                    id: sessionId,
                    attempt,
                    total_questions: totalQuestions,
                    cultures,
                    status,
                    expected_start: expectedStart,
                    end_time: endTime,
                    correct,
                } = session;

                const sessionName = getSessionName(attempt);
                const sessionDate = status === 2 ? endTime.toDate() : expectedStart.toDate();
                const scoreStr = `${correct}/${totalQuestions}`;
                const scorePct = Math.round(correct * 100.0 / totalQuestions);
                const isOfficialSession = attempt >= 1 && attempt <= 5;
    
                return {
                    // Table Features
                    id: sessionId,
                    name: sessionName,
                    date: sessionDate,
                    cultures,
                    scoreStr,
                    // Chart Features: (Official) Score over Time (with date)
                    scorePct,
                    isOfficialSession,
                }
            });

            const {
                canStart,
                canPractice,
                canContinue,
                currentSession,
            } = getEnabledActions(sessions, status);

            return {
                enrollmentName,
                sessions: sessionsData,
                canStart,
                canPractice,
                canContinue,
                currentSession,
            }
        }

        const [
            { username, nickname },
            { enrollmentName, sessions, canStart, canPractice, canContinue, currentSession }
        ] = await Promise.all([
            getStudentNames(req.user),
            getEnrollmentMetrics()
        ]);

        data = {
            username,
            nickname: nickname || '',
            enrollmentName,
            sessions,
            canStart,
            canPractice,
            canContinue,
            currentSession,
        };

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// POST enrollments
router.post('/', authorization, async (req, res) => {
    try {
        const newEnrollment = await pool.query(
            'INSERT INTO enrollment (classroom_id, student_id, status) VALUES ($1, $2, $3) RETURNING *',
            [DEFAULT_CLASSROOM_ID, req.user, 0]
        );

        // Later we will redirect to confirmation screen for initial session
        res.json(newEnrollment);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

module.exports = router;