const contestService = require('../services/contestService');
const Contest = require('../models/contest');

/**
 * Get all contests
 * @param {String} req 
 */
function getContests(req) {
    return new Promise((resolve, reject) => {
        contestService.allContests().then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    })
}
/**
 * Get Contests by id
 * @param {String} req 
 */
function getContestById(req) {
    return new Promise((resolve, reject) => {
        const _id = req.params.id;
        contestService.contestByID(_id).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    })
}
/**
 * Create new contest
 * @param {String} req 
 */
function createContest(req) {
    return new Promise((resolve, reject) => {
        const data = req.body;

        let contest = new Contest({
            nombreConcurso: data.nombreConcurso,
            fechaInicio: data.fechaInicio,
            fechaFin: data.fechaFin,
            valorPagar: data.valorPagar,
            guion: data.guion,
            recomendaciones: data.recomendaciones,
            rutaImagen: data.rutaImagen,
            nombreURL: data.nombreURL,
            estadoPublicacion: data.estadoPublicacion,
            administradorId: data.adminId
        });

        contestService.newContest(contest).then((result) => {
            resolve(result);
        }).catch((err) => reject(err));
    });
}
/**
 * Edit a contest
 * @param {String} req 
 */
function editContest(req) {
    return new Promise((resolve, reject) => {
        const _id = req.params.id;
        const data = req.body;
        contestService.updateContest(_id, data).then((result) => {
            resolve(result);
        }).catch((err) => reject(err));
    });
}
/**
 * Delete a contest
 * @param {String} req 
 */
function deleteContest(req) {
    return new Promise((resolve, reject) => {
        const _id = req.params.id;
        console.log(_id);
        Contest.findById(_id, (err, contestFound) => {

            if (err) reject({ ok: false, status: 500, errors: err });
            if (!contestFound) reject({ ok: false, status: 400, errors: err });

            contestService.destroyContest(_id, contestFound).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });

        });
    });
}

module.exports = {
    getContests,
    getContestById,
    createContest,
    editContest,
    deleteContest
};