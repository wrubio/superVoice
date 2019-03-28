const contestService = require('../services/contestService');
const Contest = require('../models/contest');

function getContest(req) {
    return new Promise((resolve, reject) => {
        Contest.find({}).exec((err, contests) => {
            if (err) reject({ ok: false, status: 500, errors: err });
            resolve(contests);
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

module.exports = {
    createContest,
    getContest
};