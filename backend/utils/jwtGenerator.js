const jwt = require('jsonwebtoken');

require('dotenv').config();

function jwtGenerator(userId) {
    const payload = {
        user: {
            id: userId
        }
    };
    return jwt.sign(payload, process.env.JWTSECRET);
}

module.exports = jwtGenerator;