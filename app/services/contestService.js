const Contest = require('../models/contest');

function allContests() {
    return new Promise((resolve, reject) => {
        Contest.find({}).exec((err, contests) => {
            if (err) reject({ ok: false, status: 500, errors: err });
            resolve(contests);
        });
    });
}

function contestByID(id) {
    return new Promise((resolve, reject) => {
        Contest.findById(id, (err, contest) => {
            if (err) reject({ ok: false, status: 500, errors: err });
            resolve(contest);
        });
    });
}

function newContest(contest) {
    return new Promise((resolve, reject) => {
        contest.save((err, savedContest) => {
            if (err) reject({ ok: false, status: 500, errors: err });
            resolve({ ok: true, contest: savedContest });
        });
    });
}

function updateContest(id, data) {
    return new Promise((resolve, reject) => {

        Contest.findById(id, (err, contestFound) => {
            if (err) reject({ ok: false, status: 500, errors: err });
            if (!contestFound) reject({ ok: false, status: 400, errors: err });

            contestFound.nombreConcurso = data.nombreConcurso;
            contestFound.fechaInicio = data.fechaInicio;
            contestFound.fechaFin = data.fechaFin;
            contestFound.valorPagar = data.valorPagar;
            contestFound.guion = data.guion;
            contestFound.recomendaciones = data.recomendaciones;
            contestFound.rutaImagen = data.rutaImagen;
            contestFound.nombreURL = data.nombreURL;
            contestFound.estadoPublicacion = data.estadoPublicacion;
            contestFound.administradorId = data.adminId;

            contestFound.save((err, savedContest) => {
                if (err) reject({ ok: false, status: 500, errors: err });
                resolve({ ok: true, contest: savedContest });
            });
        });
    });
}
module.exports = {
    allContests,
    contestByID,
    newContest,
    updateContest
};