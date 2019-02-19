const registroService = require('../services/registro-service');
const { Registro } = require('../../db');

/**
 * Fetch all the registro from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllRegistros(req, res) {
    const registros = await registroService.getAllRegistros();
    res.json(registros);
}

/**
 * Get a registro by its id.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getRegistroById(req, res) {
    const registroId = req.params.id;

    const registro = await registroService.getRegistroById(registroId);

    res.json(registro);
}


/**
 * Create a registro.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createRegistro(req, res) {

    const data = req.body;

    const concursoId = data.contestId;

    console.log(data);

    let newRegistro = new Registro({
        rutaArchivoOriginal: data.rutaArchivoOriginal,
        rutaArchivoConvertida: data.rutaArchivoConvertida,
        estadoRegistroVoces: data.estadoRegistroVoces,
        nombresLocutor: data.nombresLocutor,
        apellidosLocutor: data.apellidosLocutor,
        correoLocutor: data.correoLocutor,
        observacionesLocutor: data.observacionesLocutor,
    });

    newRegistro = await registroService.createRegistro(newRegistro, concursoId);

    res.json({ ok: true, data: newRegistro });
}


/**
 * Update a registro.
 * We cannot update the concursoId of a registro
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateRegistro(req, res) {
    const data = req.body;

    let newRegistro = new Registro({
        rutaArchivoOriginal: data.rutaArchivoOriginal,
        rutaArchivoConvertida: data.rutaArchivoConvertida,
        estadoRegistroVoces: data.estadoRegistroVoces,
        nombresLocutor: data.nombresLocutor,
        apellidosLocutor: data.apellidosLocutor,
        correoLocutor: data.correoLocutor,
        observacionesLocutor: data.observacionesLocutor,
    });

    const registroId = req.params.id;

    newRegistro = await registroService.updateRegistro(registroId, newRegistro);

    res.json(newRegistro);
}

/**
 * Delete a registro.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteRegistro(req, res) {

    const registroId = req.params.id;

    deletedRegistro = await registroService.deleteRegistro(registroId);

    res.json(deletedRegistro);
}

/**
 * Fetch all the registros from the database of a particular concurso.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllRegistrosByConcurso(req, res) {

    const idConcurso = req.params.id;

    const registros = await registroService.getAllRegistrosByConcurso(idConcurso);
    res.json(registros);
}


module.exports = {
    getAllRegistros,
    getRegistroById,
    createRegistro,
    updateRegistro,
    deleteRegistro,
    getAllRegistrosByConcurso
}