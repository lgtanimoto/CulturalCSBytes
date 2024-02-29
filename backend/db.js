const Pool = require('pg').Pool;
const fs = require('fs');

require('dotenv').config();

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: fs.readFileSync(process.env.POSTGRES_PASSWORD_FILE, 'utf8'),
    port: 5432,
});

module.exports = pool;