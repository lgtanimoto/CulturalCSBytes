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

app.use('/authentication', require('./routes/authentication'));
app.use('/enrollments', authorization, require('./routes/enrollments'));

/* Debugging */

app.get('/questions/:questionSetCode/:cultureCode/:mqCode/:altCode', async (req, res) => {
    const {
        questionSetCode,
        cultureCode,
        mqCode,
        altCode
    } = req.params;

    const data = require(`../content/${questionSetCode}/${cultureCode}/${questionSetCode}-${cultureCode}-${mqCode}-${altCode}.json`);
    res.json(data);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});