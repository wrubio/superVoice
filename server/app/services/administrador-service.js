const { Administrador } = require('../../db');

/**
 * Return all the administradors of the app.
 *
 * @returns {Promise<Array>} Administrador
 */
async function getAllAdministradors() {

    console.log("Fetching all actives administradors")
    return Administrador.findAll({
        where: {
            estado: 'active',
        }
    });
}

/**
 * Get an administrador by its id.
 *
 * @param adminId {number} Administrador id
 * @return {Promise<Administrador>} The wanted admin.
 */
async function getAdministradorById(adminId) {

    console.log("Admin service: Fetching the administrador with id : " + adminId);

    const admin = await Administrador.findByPk(adminId);

    if (!admin || admin.estado == 'unactive') throw new Error('This admin does not exist');

    return admin;
}


/**
 * Create an administrador.
 *
 * @param newAdmin {Administrador} admin
 * @return {Promise<Administrador>} The created admin with its id
 */
async function createAdministrador(newAdmin) {

    console.log('Admin service: creating a new admin named %s %s', newAdmin.nombres, newAdmin.apellidos);
    return newAdmin.save()
        .then(result => {
            return result.dataValues;
        })
        .catch(err => {
            return { ok: false, errores: err };
        })
}


/**
 * Update an administrador.
 * This will copy only the allowed changes from the `updateAdmin`
 * into the current admin.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 *
 * @param adminId {number} admin id
 * @param updatedAdministrador {Administrador} Updated admin, constructed from the request.
 * @return {Promise<Administrador>} The updated adamin
 */
async function updateAdministrador(adminId, updateAdministrador) {

    const currentAdministrador = await Administrador.findByPk(adminId);

    if (!currentAdministrador || currentAdministrador.estado == 'unactive') throw new Error('This administrador does not exist');

    console.log('Administrador service: updating administrador named %s %s', currentAdministrador.nombres, currentAdministrador.apellidos);

    return currentAdministrador.update({
        nombres: updateAdministrador.nombres,
        apellidos: updateAdministrador.apellidos,
        correo: updateAdministrador.correo,
        // contrasena: updateAdministrador.contrasena,
        // estado: updateAdministrador.estado,
        nombreEmpresa: updateAdministrador.nombreEmpresa
    });
}

/**
 * Delete an administrador.
 * This will change the attribute estado to "unactive"
 * This means, the administrador will not be deleted from the database
 *
 * @param adminId {number} admin id
 * @return {Promise<Administrador>} The deleted admin
 */
async function deleteAdministrador(adminId) {

    const currentAdministrador = await Administrador.findByPk(adminId);

    if (!currentAdministrador || currentAdministrador.estado == 'unactive') throw new Error('This administrador does not exist');

    console.log('Administrador service: deleting administrador named %s %s', currentAdministrador.nombres, currentAdministrador.apellidos);

    return currentAdministrador.update({
        estado: "unactive",
    });
}




module.exports = {
    getAllAdministradors,
    getAdministradorById,
    createAdministrador,
    updateAdministrador,
    deleteAdministrador
}