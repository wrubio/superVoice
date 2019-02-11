const { Administrador } = require('../../db');

/**
 * Return all the administradors of the app.
 *
 * @returns {Promise<Array>} Administrador
 */
async function getAllAdministradors() {

    console.log("Fetching all administradors")
    return Administrador.findAll();
}

/**
 * Get an administrador by its id.
 *
 * @param adminId {number} Administrador id
 * @return {Promise<Administrador>} The wanted admin.
 */
async function getAdministradorById(adminId) {

    console.log("Admin service: Fetching the administrador with id : "+adminId);

    const admin = await Administrador.findByPk(adminId);

    if (!admin) throw new Error('This admin does not exist');

    return admin;
}


/**
 * Create an administrador.
 *
 * @param newAdmin {Administrador}  amin
 * @return {Promise<Administrador>} The created admin with its id
 */
async function createAdministrador(newAdmin) {

    console.log('Admin service: creating a new admin named %s %s', newAdmin.nombres, newAdmin.apellidos);
    return newAdmin.save();
}



module.exports = {
    getAllAdministradors,
    getAdministradorById,
    createAdministrador,
}