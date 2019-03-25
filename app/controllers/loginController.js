const loginService = require('../services/loginService');

function findAdmin(req) {
    return new Promise((resolve, reject) => {
        const email = req.body.correo;
        const password = req.body.contrasena;
        loginService.getAdmin(email, password).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = {
    findAdmin
}