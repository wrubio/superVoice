const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

exports.verifyToke = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decode) => {
        if (err) {
            return resizeBy.status(401).json({
                message: 'Token incorrecto',
                errors: err
            })
        }

        req.user = decode.user;

        next();
    });
}