const contestService = require('../services/contestService');
const Contest = require('../models/contest');

function getContests(req) {
    return new Promise((resolve, reject) => {
        contestService.allContests().then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    })
}

function getContestById(req) {
    return new Promise((resolve, reject) => {
        const _id = req.params.id;
        console.log(_id);
        contestService.contestByID(_id).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    })
}

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

function editContest(req) {
    return new Promise((resolve, reject) => {
        const _id = req.params.id;
        const data = req.body;
        contestService.updateContest(_id, data).then((result) => {
            resolve(result);
        }).catch((err) => reject(err));
    });
}
module.exports = {
    getContests,
    getContestById,
    createContest,
    editContest
};