const pool = require('../db');

module.exports = async (req, res, next) => {
    try {
        if (req.enrollment.status === 2) {
            return res.status(403).json('Student cannot continue session after completing enrollment.');
        }
        
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).json('Not Authorized');
    }
}