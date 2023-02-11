const express = require('express');
const app = express();
const cors = require('cors');
const { authorization } = require('./middleware');

require('dotenv').config();

/* Middleware */

app.use(express.json());
app.use(cors());

/* Routes */

app.use('/authentication', require('./routes/authentication'));
app.use('/enrollments', authorization, require('./routes/enrollments'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});