const { Concurso } = require('../../db');
const { createUserError } = require('../../utils/errors');
const sequelize = require('../../db');



/**
 * Return all the concursos of the app.
 *
 * @returns {Promise<Array>} Concurso
 */
async function getAllConcursos() {

    console.log("Fetching all concursos")
    return Concurso.findAll();
}

/**
 * Get a concurso by its id.
 *
 * @param concursoId {number} Concurso id
 * @return {Promise<Administrador>} The wanted concurso.
 */
async function getConcursoById(concursoId) {

    console.log("Concurso service: Fetching the concurso with id : "+concursoId);

    const concurso = await Concurso.findByPk(concursoId);

    if (!concurso) throw createUserError('Unknown Concurso','This concurso does not exist');

    return concurso;
}


/**
 * Create a concurso.
 *
 * @param newConcurso {Concurso} concurso
 * @return {Promise<Concurso>} The created concurso with its id
 */
async function createConcurso(newConcurso, adminId) {

    console.log('Concurso service: creating a new concurso named %s', newConcurso.nombreConcurso);
    
    const transaction = await sequelize.sequelize.transaction();
    try{
        await newConcurso.save({ transaction });
        await newConcurso.setAdministrador(adminId, { transaction });
    }catch(err){
        if (err.userError) throw err;

        await transaction.rollback();
        console.log('Concurso service: Error while creating concurso %o', err);

        if (err.Errors === sequelize.SequelizeUniqueConstraintError) {
            throw createUserError('BadURL', 'an URL must be unique');
        }

        throw createServerError('ServerError', 'Error while creating a concurso');
    }

    await transaction.commit();
    return newConcurso;
}


/**
 * Update a concurso.
 * This will copy only the allowed changes from the `updateConcurso`
 * into the current concurso.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 * You can't change the adminId
 *
 * @param concursoId {number} concurso id
 * @param updatedConcurso {Concurso} Updated concurso, constructed from the request.
 * @return {Promise<Concurso>} The updated concurso
 */
async function updateConcurso(concursoId, updateConcurso) {

    const currentConcurso = await Concurso.findByPk(concursoId);

    if (!currentConcurso) throw createUserError('Unknown Concurso','This concurso does not exist');

    console.log('Concurso service: updating concurso named %s', currentConcurso.nombreConcurso);

    return currentConcurso.update({
        nombreConcurso: updateConcurso.nombreConcurso,
        fechaInicio: updateConcurso.fechaInicio,
        fechaFin: updateConcurso.fechaFin,
        valorPagar: updateConcurso.valorPagar,
        guion: updateConcurso.guion,
        recomendaciones: updateConcurso.recomendaciones,
        rutaImagen: updateConcurso.rutaImagen,
        nombreUrl: updateConcurso.nombreUrl,
        estadoPublicacion: updateConcurso.estadoPublicacion
    });
}

/**
 * Delete a concurso.
 * This will change the attribute estado to "unactive"
 * This means, the concurso will not be deleted from the database
 *
 * @param concursoId {number} concurso id
 * @return {Promise<Concurso>} The deleted concurso
 */
async function deleteConcurso(concursoId) {

    const currentConcurso = await Concurso.findByPk(concursoId);

    if (!currentConcurso) throw createUserError('Unknown Concurso','This concurso does not exist');

    console.log('Concurso service: deleting concurso named%s', currentConcurso.nombreConcurso);

    return currentConcurso.update({
        estadoPublicacion: "unactive",
    });
}

/**
 * Return all the concursos of a particular admin.
 *
 * @returns {Promise<Array>} Concurso
 */
async function getAllConcursosByAdmin(idAdmin) {

    console.log("Fetching all concursos")
    return Concurso.findAll({
        where: {
            administradorId: idAdmin,
        }
    });
}



module.exports = {
    getAllConcursos,
    getConcursoById,
    createConcurso,
    updateConcurso,
    deleteConcurso,
    getAllConcursosByAdmin
}