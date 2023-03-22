const Pool = require('pg').Pool;

require('dotenv').config();

const pool = new Pool({
    user: process.env.DBUSER || 'postgres',
    password: process.env.DBPW || 'postgres',
    host: process.env.DBHOST || 'localhost',
    port: process.env.DBPORT || 5432,
    database: process.env.DBNAME || 'ccsb'
});

module.exports = pool;