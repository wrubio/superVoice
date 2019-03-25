const jwt = require('jsonwebtoken');
const SEED = require('../config/seed').SEED;

/**
 * TOKEN - Verify token
 */
exports.verifyToken = function(req, res, next) {

    const token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'incorrect token, unauthorized user',
                errors: err
            })
        }

        req.dUser = decoded.user;

        next();
    })

}