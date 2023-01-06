const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

/* Middleware */

app.use(express.json());
app.use(cors());

/* Routes */

app.use('/authentication', require('./routes/authentication'));
app.use('/enrollments', require('./routes/enrollments'));

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});