module.exports = (req, res, next) => {
    const { username, password } = req.body;

    if (![username, password].every(Boolean)) {
        return res.status(401).json('Missing Credentials');
    }

    next();
}