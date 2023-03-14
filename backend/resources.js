const pool = require('./db');
const fs = require('fs');

const baseDir = '../content/A000/';

async function insertResources() {
    const baseCsv = `${baseDir}A000-resource.csv`;
    let codes = '';

    fs.createReadStream(baseCsv, { encoding: 'utf-8' })
    .on("data", (code) => {
        codes = code;
    })
    .on("error", (error) => {
        console.log(error);
    });

    const qscIds = await pool.query('SELECT id FROM question_set_culture');
    codes = codes.split('\n').filter(code => code !== '');

    await Promise.all(
        qscIds.rows.map(async qscId => {
            await Promise.all(
                codes.map(async resourceCode => {
                    await pool.query(
                        'INSERT INTO resource_qsc_links (qsc_id, resource_code) VALUES ($1, $2)',
                        [qscId.id, resourceCode]
                    );
                })
            );
        })
    );

    console.log('Inserted resources for all cultures.')
}

async function insertResourcesCulture(culture) {
    const cultureCsv = `${baseDir}${culture}/A000-${culture}-resource.csv`;
    let codes = '';

    fs.createReadStream(cultureCsv, { encoding: 'utf-8' })
    .on("data", (code) => {
        codes = code;
    })
    .on("error", (error) => {
        console.log(error);
    });

    const qscId = await pool.query(
        'SELECT id FROM question_set_culture WHERE culture_code = $1',
        [culture]
    );

    codes = codes.split('\n').filter(code => code !== '');

    await Promise.all(
        codes.map(async resourceCode => {
            await pool.query(
                'INSERT INTO resource_qsc_links (qsc_id, resource_code) VALUES ($1, $2)',
                [qscId.rows[0].id, resourceCode]
            );
        })
    );
    
    console.log(`Inserted resources for culture ${culture}`);
}

Promise.all([
    insertResources(),
    insertResourcesCulture('A000'),
    insertResourcesCulture('A001'),
    insertResourcesCulture('A002')
])
.then(() => {
    pool.end(() => {
        console.log('pool has ended');
    });
})
.catch(err => {
    console.log(err);
});