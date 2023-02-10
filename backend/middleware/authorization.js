const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        const jwtToken = req.header('token');

        if (!jwtToken) {
            return res.status(403).json({
                statusCode: 403,
                error: 'Not Authorized'
            });
        }
        
        const payload = jwt.verify(jwtToken, process.env.JWTSECRET);
        req.user = payload.user;
        next();
    } catch (err) {
        return res.status(403).json({
            statusCode: 403,
            error: 'Not Authorized'
        });
    }
};