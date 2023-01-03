const express = require('express');
const app = express();
const cors = require('cors');

/* Middleware */

app.use(express.json());
app.use(cors());

/* Routes */

// Register

app.use('/auth', require('./routes/jwtAuth'))

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});