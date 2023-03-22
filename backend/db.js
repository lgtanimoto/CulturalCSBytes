const Pool = require('pg').Pool;

require('dotenv').config();

const pool = new Pool({
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
});

module.exports = pool;