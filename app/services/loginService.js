const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SEED = require('../config/seed').SEED;
const Admin = require('../models/admin');

function getAdmin(email, password) {
    return new Promise((resolve, reject) => {
        Admin.findOne({ email: email }, (err, foundAdmin) => {

            if (err) reject({
                ok: false,
                status: 500,
                errors: err
            })

            if (!foundAdmin) reject({
                ok: false,
                status: 400,
                errors: 'Usuario no existe!'
            })

            if (!bcrypt.compareSync(password, foundAdmin.password)) reject({
                ok: false,
                status: 203,
                message: "Credenciales incorrectas"
            })

            foundAdmin.password = ';)';

            const token = jwt.sign({ user: foundAdmin }, SEED, { expiresIn: 14400 });

            resolve({
                ok: true,
                user: foundAdmin,
                token: token
            });

        });
    });
}

module.exports = {
    getAdmin
}