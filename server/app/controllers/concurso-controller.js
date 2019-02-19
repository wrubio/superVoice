const concursoService = require('../services/concurso-service');
const { Concurso } = require('../../db');

/**
 * Fetch all the concursos from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllConcursos(req, res) {
    const concursos = await concursoService.getAllConcursos();
    res.json(concursos);
}

/**
 * Get a concurso by its id.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getConcursoById(req, res) {
    const concursoId = req.params.id;

    const concurso = await concursoService.getConcursoById(concursoId);

    res.json(concurso);
}


/**
 * Create a concurso.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createConcurso(req, res) {

    const data = req.body;

    const adminId = data.adminId;

    // res.status(200).json({ data });

    let newConcurso = new Concurso({
        nombreConcurso: data.nombreConcurso,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        valorPagar: data.valorPagar,
        guion: data.guion,
        recomendaciones: data.recomendaciones,
        rutaImagen: data.rutaImagen,
        nombreURL: data.nombreURL,
        estadoPublicacion: data.estadoPublicacion
    });

    newConcurso = await concursoService.createConcurso(newConcurso, adminId);

    res.json(newConcurso);
}


/**
 * Update a concurso.
 * We cannot update the admin of a concurso
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateConcurso(req, res) {
    const data = req.body;

    let newConcurso = new Concurso({
        nombreConcurso: data.nombreConcurso,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        valorPagar: data.valorPagar,
        guion: data.guion,
        recomendaciones: data.recomendaciones,
        rutaImagen: data.rutaImagen,
        nombreURL: data.nombreURL,
        estadoPublicacion: data.estadoPublicacion
    });

    const concursoId = req.params.id;

    newConcurso = await concursoService.updateConcurso(concursoId, newConcurso);

    res.json({ ok: true, data: newConcurso });
}


/**
 * Delete a concurso.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteConcurso(req, res) {

    const concursoId = req.params.id;

    deletedConcurso = await concursoService.deleteConcurso(concursoId);

    res.json(deletedConcurso);
}

/**
 * Fetch all the concursos from the database of a particular admin.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllConcursosByAdmin(req, res) {

    const idAdmin = req.params.id;

    const concursos = await concursoService.getAllConcursosByAdmin(idAdmin);
    res.json(concursos);
}


module.exports = {
    getAllConcursos,
    getConcursoById,
    createConcurso,
    updateConcurso,
    deleteConcurso,
    getAllConcursosByAdmin
}