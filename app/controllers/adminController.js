const adminService = require('../services/adminService');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');

function createAdmin(req) {
    return new Promise((resolve, reject) => {
        const admin = req.body;
        const newAdmin = new Admin({
            names: admin.nombres,
            lastnames: admin.apellidos,
            email: admin.correo,
            password: bcrypt.hashSync(admin.contrasena, 10),
            status: admin.estado,
            company: admin.nombreEmpresa,
        });
        adminService.newAdmin(newAdmin).then((result) => {
            resolve(result);
        }).catch((err) => { reject(err) });
    });
}

module.exports = {
    createAdmin
}