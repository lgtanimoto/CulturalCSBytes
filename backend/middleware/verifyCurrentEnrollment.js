const pool = require('../db');

module.exports = async (req, res, next) => {
    try {
        if (req.enrollment.status === 2) {
            return res.status(403).json({
                statusCode: 403,
                error: 'Student cannot continue session after completing enrollment.'
            });
        }
        
        next();
    } catch (err) {
        return res.status(403).json({
            statusCode: 403,
            error: 'Not Authorized'
        });
    }
}