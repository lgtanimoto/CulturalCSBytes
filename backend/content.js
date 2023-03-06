const pool = require('./db');
const fs = require('fs');

async function insertQuestions(culture) {
    const jsonDir = `../content/A000/${culture}/`;
    const imgsDir = jsonDir + 'images/';

    const re = new RegExp(`^A000-${culture}-\\d[A-Z]\\d{2}-\\d\\.json$`);
    const files = fs.readdirSync(jsonDir);
    const jsons = files.filter(file => re.test(file));

    await Promise.all(
        jsons.map(async json => {
            const data = require(`${jsonDir}${json}`);
        
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
    
            let blob = null;
    
            if (QuestionJSON.QuestionImage !== null && QuestionJSON.QuestionImage !== '') {
                const file = imgsDir + QuestionJSON.QuestionImage;
                if (fs.existsSync(file)) {
                    const bitmap = fs.readFileSync(file);
                    blob = Buffer.from(bitmap);
                }
            }
            
            await pool.query(
                'INSERT INTO question (qsc_id, mq_id, alt_code, difficulty, json, blob, version, iscurrent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [qscId, mqId, QuestionAltCode, QuestionDifficulty, QuestionJSON, blob, 0, QuestionCurrent]
            );
        })
    );
    
    console.log(`Inserted questions for culture ${culture}`);
}

Promise.all([
    insertQuestions('A000'),
    insertQuestions('A001'),
    insertQuestions('A002')
])
.then(() => {
    pool.end(() => {
        console.log('pool has ended');
    });
})
.catch(err => {
    console.log(err);
});
