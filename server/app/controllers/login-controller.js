const { Administrador } = require('../../db');
const loginService = require('../services/login-service');


/**
 * Create an admin.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function loginSystem(req, res) {
    const data = req.body;
    const admin = await loginService.getAdministradorByCorreo(data.correo, data.contrasena);
    res.json(admin);
}

module.exports = { loginSystem }