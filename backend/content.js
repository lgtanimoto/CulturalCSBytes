const pool = require('./db');

const dir = '../content/A000/A000/';
const re = /^A000-A000-\d[A-Z]\d{2}-\d\.json$/;

const fs = require('fs');
const files = fs.readdirSync(dir);
const jsons = files.filter(file => re.test(file));

Promise.all(
    jsons.map(async json => {
        const data = require(`${dir}${json}`);
    
        const {
            QuestionSetCode,
            CultureCode,
            MQCode,
            QuestionAltCode,
            QuestionDifficulty,
            QuestionCurrent,
            QuestionJSON
        } = data;

        async function getQSCId() {
            const qsc = await pool.query(
                'SELECT id FROM question_set_culture WHERE question_set_code = $1 AND culture_code = $2',
                [QuestionSetCode, CultureCode]
            );
            return qsc.rows[0].id;
        }

        async function getMQId() {
            mq = await pool.query(
                'SELECT id FROM meta_question WHERE code = $1',
                [MQCode]
            );
            return mq.rows[0].id;
        }

        const [qscId, mqId] = await Promise.all([
            getQSCId(),
            getMQId()
        ]);
        
        await pool.query(
            'INSERT INTO question (qsc_id, mq_id, alt_code, difficulty, json, iscurrent) VALUES ($1, $2, $3, $4, $5, $6)',
            [qscId, mqId, QuestionAltCode, QuestionDifficulty, QuestionJSON, QuestionCurrent]
        );
    })
)
.then(() => {
    pool.end(() => {
        console.log('pool has ended');
    });
})
.catch(err => {
    console.log(err);
});