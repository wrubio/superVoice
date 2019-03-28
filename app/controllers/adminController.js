const adminService = require('../services/adminService');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');

function createAdmin(req) {
    return new Promise((resolve, reject) => {
        const admin = req.body;
        const newAdmin = new Admin({
            nombres: admin.nombres,
            apellidos: admin.apellidos,
            correo: admin.correo,
            contrasena: bcrypt.hashSync(admin.contrasena, 10),
            estado: admin.estado,
            nombreEmpresa: admin.nombreEmpresa,
        });
        adminService.newAdmin(newAdmin).then((result) => {
            resolve(result);
        }).catch((err) => { reject(err) });
    });
}

module.exports = {
    createAdmin
}