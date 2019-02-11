const administradorService = require('../services/administrador-service');
const { Administrador } = require('../../db');

/**
 * Fetch all the administradors from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllAdministradors(req, res) {
    const administradors = await administradorService.getAllAdministradors();
    res.json(administradors);
}

/**
 * Get an administrador by its id.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAdministradorById(req, res) {
    const adminId = req.params.id;

    const admin = await administradorService.getAdministradorById(adminId);

    res.json(admin);
}


/**
 * Create an admin.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createAdministrador(req, res) {

    const data = req.body;

    let newAdmin = new Administrador({
        nombres: data.nombres,
        apellidos: data.apellidos,
        correo: data.correo,
        contrasena: data.contrasena,
        estado: data.estado,
        nombreEmpresa: data.nombreEmpresa,
    });

    newAdmin = await administradorService.createAdministrador(newAdmin);

    res.json(newAdmin);
}


module.exports = {
    getAllAdministradors,
    getAdministradorById,
    createAdministrador,
}