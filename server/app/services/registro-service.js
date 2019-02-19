const { Registro } = require('../../db');
const { createUserError } = require('../../utils/errors');
const sequelize = require('../../db');



/**
 * Return all the registro de voces of the app.
 *
 * @returns {Promise<Array>} Registro
 */
async function getAllRegistros() {

    console.log("Fetching all registros")
    return Registro.findAll();
}

/**
 * Get a registro by its id.
 *
 * @param registroId {number} Registro id
 * @return {Promise<Registro>} The wanted registro.
 */
async function getRegistroById(registroId) {

    console.log("Registro service: Fetching the registro with id : " + registroId);

    const registro = await Registro.findByPk(registroId);

    if (!registro) throw createUserError('Unknown registro', 'This registro does not exist');

    return registro;
}


/**
 * Create a registro.
 *
 * @param newRegistro {Registro} registro
 * @return {Promise<Registro>} The created registro with its id
 */
async function createRegistro(newRegistro, concursoId) {

    return newRegistro.save().then(result => {
        return newRegistro.setConcurso(concursoId).then(res => {
            return { ok: true, audio: result.dataValues, addContes: res };
        }).catch(err => {
            return { ok: false, errors: err };
        })
    });
    /*
    console.log('Registro service: creating a new registro de voz by %s %s', newRegistro.nombresLocutor, newRegistro.apellidosLocutor);
    
    const transaction = await sequelize.sequelize.transaction();
    try{
        await newRegistro.save({ transaction });
        await newRegistro.setConcurso(concursoId, { transaction });
    }catch(err){
        if (err.userError) throw err;

        await transaction.rollback();
        console.log('Registro service: Error while creating registro %o', err);

        throw createServerError('ServerError', 'Error while creating a concurso');
    }

    await transaction.commit();
    return newRegistro;
    */
}


/**
 * Update a registro.
 * This will copy only the allowed changes from the `updateRegistro`
 * into the current registro.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 * You can't change the concursoId
 *
 * @param registroId {number} registro id
 * @param updatedRegistro {Registro} Updated registro, constructed from the request.
 * @return {Promise<Registro>} The updated registro
 */
async function updateRegistro(registroId, updatedRegistro) {

    const currentRegistro = await Registro.findByPk(registroId);

    if (!currentRegistro) throw createUserError('Unknown registro', 'This registro does not exist');

    console.log('Registro service: updating registro de voz by %s %s', currentRegistro.nombresLocutor, currentRegistro.apellidosLocutor);

    return currentRegistro.update({
        rutaArchivoOriginal: updatedRegistro.rutaArchivoOriginal,
        rutaArchivoConvertida: updatedRegistro.rutaArchivoConvertida,
        estadoRegistroVoces: updatedRegistro.estadoRegistroVoces,
        nombresLocutor: updatedRegistro.nombresLocutor,
        apellidosLocutor: updatedRegistro.apellidosLocutor,
        correoLocutor: updatedRegistro.correoLocutor,
        observacionesLocutor: updatedRegistro.observacionesLocutor,
    });
}

/**
 * Delete a registro.
 * This will change the attribute estado to "unactive"
 * This means, the registro will not be deleted from the database
 *
 * @param registroId {number} registro id
 * @return {Promise<Registro>} The deleted registro
 */
async function deleteRegistro(registroId) {

    const currentRegistro = await Registro.findByPk(registroId);

    if (!currentRegistro) throw createUserError('Unknown registro', 'This registro does not exist');

    console.log('Registro service: deleting registro de voz by %s %s', currentRegistro.nombresLocutor, currentRegistro.apellidosLocutor);

    return currentRegistro.update({
        estadoRegistroVoces: "unactive",
    });
}

/**
 * Return all the registros of a particular concurso.
 *
 * @returns {Promise<Array>} Registro
 */
async function getAllRegistrosByConcurso(idConcurso) {

    console.log("Fetching all registros of the concurso %s", idConcurso)
    return Registro.findAll({
        where: {
            concursoId: idConcurso,
        }
    });
}



module.exports = {
    getAllRegistros,
    getRegistroById,
    createRegistro,
    updateRegistro,
    deleteRegistro,
    getAllRegistrosByConcurso
}