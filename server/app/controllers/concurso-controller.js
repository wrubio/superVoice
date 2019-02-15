const { Administrador } = require('../../db');
const concursoService = require('../services/concurso-service');
const { Concurso } = require('../../db');


var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

app.use(fileUpload('createParentPath', false));


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
const typeExt = ['jpg', 'jpeg', 'png', 'gif'];

async function createConcurso(req, res) {

    if (!req.files) { res.json({ img: false, query: req.query }) } else { res.json({ img: true, query: req.query }) }
    /*
    res.json(req.files.rutaImagen);
    // Get the file extension
    var fileUpload = req.files.img;
    var fileExt = fileUpload.name.split('.').pop();

    // Validate the file extension
    if (typeExt.indexOf(fileExt.toLowerCase()) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'File not valid',
            error: { message: `The valid file extension are ${typeExt.join(', ')}` }
        });
    }

    const adminId = data.adminId;
    const isAdmin = await Administrador.findByPk(adminId);

    if (isAdmin === null) {
        res.json({ ok: false, message: `El usuario con id ${adminId}, no existe!.` })
    }

    // Set new name to the file
    const newFileName = `${adminId}-${new Date().getTime()}.${fileExt}`;

    // Save file in the new folder
    const userPath = `./server/public/uploads/concursos/${adminId}`;
    const savePath = `./server/public/uploads/concursos/${adminId}/${newFileName}`;

    // Create user folder if this doesn't exist
    if (!fs.existsSync(userPath)) fs.mkdirSync(userPath);

    const algo = await fileUpload.mv(savePath);

    res.json(algo);
    
    saveContestFile(savePath).then(res => {
        res.json(res)
    }).catch(err => {
        res.json(err)
    });

    let newConcurso = new Concurso({
        nombreConcurso: data.nombreConcurso,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        valorPagar: data.valorPagar,
        guion: data.guion,
        recomendaciones: data.recomendaciones,
        rutaImagen: savePath,
        nombreURL: data.nombreURL,
        estadoPublicacion: data.estadoPublicacion
    });
    // newConcurso = await concursoService.createConcurso(newConcurso, adminId);

    // res.json(newConcurso);
    */
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
        recommandaciones: data.recommandaciones,
        rutaImagen: data.rutaImagen,
        nombreUrl: data.nombreUrl,
        estadoPublicacion: data.estadoPublicacion
    });

    const concursoId = req.params.id;

    newConcurso = await concursoService.updateConcurso(concursoId, newConcurso);

    res.json(newConcurso);
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
/*
function saveContestFile(savePath) {
    return new Promise((resolve, reject) => {
        fileUpload.mv(savePath, (err) => {
            if (err) {
                console.log('ksjhdkahkdjajskdhk');
                reject({
                    ok: false,
                    message: `ups!!! The file ${fileUpload.name} could not be uploaded`
                });
            }
            resolve({ ok: true })
        })
    })
}
*/
module.exports = {
    getAllConcursos,
    getConcursoById,
    createConcurso,
    updateConcurso,
    deleteConcurso,
    getAllConcursosByAdmin
}