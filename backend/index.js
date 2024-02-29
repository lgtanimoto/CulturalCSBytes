const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const client = require('./db');
const { authorization } = require('./middleware');
const { insertQuestions } = require('./content');
const { insertResources, insertResourcesCulture } = require('./resources');

var Batch = require('batch')
  , batch = new Batch;

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

async function processSQLFile(fileName) {
    // Extract SQL queries from files. Assumes no ';' in the fileNames
    var queries = fs.readFileSync(fileName).toString()
      // .replace(/(\r\n|\n|\r)/gm," ") // remove newlines
      // .replace(/\s+/g, ' ') // excess white space
      .split("\n\n") // split into all statements
      .map(Function.prototype.call, String.prototype.trim)
      .filter(function(el) {return el.length != 0}); // remove any empty ones
    
    for (var i = 0; i < queries.length; i++) {
      await client.query(queries[i]);
    }

    console.log(`Finished processing ${fileName}`);

    // Execute each SQL query sequentially
    // queries.forEach(function(query) {
    //   batch.push(function(done) {
    //     if (query.indexOf("COPY") === 0) { // COPY - needs special treatment
    //       var regexp = /COPY\ (.*)\ FROM\ (.*)\ DELIMITERS/gmi;
    //       var matches = regexp.exec(query);
    //       var table = matches[1];
    //       var fileName = matches[2];
    //       var copyString = "COPY " + table + " FROM STDIN DELIMITERS ',' CSV HEADER";
    //       var stream = client.copyFrom(copyString);
    //       stream.on('close', function () {
    //         done();
    //       });
    //       var csvFile = __dirname + '/' + fileName;
    //       var str = fs.readFileSync(csvFile);
    //       stream.write(str);
    //       stream.end();
    //     } else { // Other queries don't need special treatment
    //       client.query(query, function(result) {
    //         done();
    //       });
    //     }
    //   });
    // });
  }

app.listen(process.env.PORT, async () => {
  await client.connect();

  /* Init */
  await processSQLFile('./data/reset.sql');
  await processSQLFile('./data/schema.sql');
  await processSQLFile('./data/data.sql');
  await processSQLFile('./data/resources.sql');
  console.log('Finished db init!');

  /* Questions */
  const questionPromises = [
      insertQuestions('A000'),
      insertQuestions('A001'),
      insertQuestions('A002'),
      insertQuestions('A003'),
      insertQuestions('A004')
  ];
  await Promise.all(questionPromises);
  console.log('Finished inserting questions!');

  /* Resources */
  const resourcesPromises = [
      insertResources(),
      insertResourcesCulture('A000'),
      insertResourcesCulture('A001'),
      insertResourcesCulture('A002')
  ];
  await Promise.all(resourcesPromises);
  console.log('Finished inserting resources!');

  console.log(`Server is running on port ${process.env.PORT}`);
});