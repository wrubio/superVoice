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
        estado: "active",
        nombreEmpresa: data.nombreEmpresa,
    });

    newAdmin = await administradorService.createAdministrador(newAdmin);

    res.json(newAdmin);
}


/**
 * Update an admin.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateAdministrador(req, res) {
    const data = req.body;

    let newAdministrador = new Administrador({
        nombres: data.nombres,
        apellidos: data.apellidos,
        correo: data.correo,
        contrasena: data.contrasena,
        estado: data.estado,
        nombreEmpresa: data.nombreEmpresa
    });

    const adminId = req.params.id;

    newAdministrador = await administradorService.updateAdministrador(adminId, newAdministrador);

    res.json(newAdministrador);
}


/**
 * Delete an admin.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteAdministrador(req, res) {

    const adminId = req.params.id;

    deletedAdministrador = await administradorService.deleteAdministrador(adminId);

    res.json(deletedAdministrador);
}


module.exports = {
    getAllAdministradors,
    getAdministradorById,
    createAdministrador,
    updateAdministrador,
    deleteAdministrador
}