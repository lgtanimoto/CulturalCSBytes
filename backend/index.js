const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const { authorization } = require('./middleware');

require('dotenv').config();

/* Middleware */

app.use(express.json());
app.use(cors());

/* Routes */

app.use('/api/authentication', require('./routes/authentication'));
app.use('/api/enrollments', authorization, require('./routes/enrollments'));

/* Debugging */

// Question JSON Files

// app.get('/questions/:questionSetCode/:cultureCode/:mqCode/:altCode', async (req, res) => {
//     const {
//         questionSetCode,
//         cultureCode,
//         mqCode,
//         altCode
//     } = req.params;

//     const data = require(`../content/${questionSetCode}/${cultureCode}/${questionSetCode}-${cultureCode}-${mqCode}-${altCode}.json`);
//     res.json(data);
// });

// Image Blobs

// const pool = require('./db');

// app.get('/questions/:questionId/image', async (req, res) => {
//     const { questionId } = req.params;

//     const questions = await pool.query(
//         'SELECT blob FROM question WHERE id = $1',
//         [questionId]
//     );

//     if (questions.rows[0].blob !== null) {
//         const buffer = questions.rows[0].blob;
//         const src = `data:image/jpeg;base64,${buffer.toString('base64')}`;
//         return res.send(`<img src=${src} alt='Question image'>`);
//     }

//     res.send('<h1>Error: Question does not have image.</h1>');
// });

/* AWS Health */

app.get('/', async (req, res) => {
    res.json({ success: 'Hello World!' });
})

/* Listening */

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});