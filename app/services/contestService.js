const Contest = require('../models/contest');

var async = require('async');
const AWS = require('aws-sdk');

// Load your AWS credentials and try to instantiate the object.
AWS.config.loadFromPath(__dirname + '/config.json');

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

async function destroyContest(contestID, contest) {

    const s3 = new AWS.S3();

    const filesContestParam = { Bucket: 'svoice', Prefix: `${contest.administradorId}/${contestID}/` };
    const promiseAll = [];

    const filesContest = await s3.listObjects(filesContestParam).promise();

    filesContest.Contents.forEach((file) => {
        let keyObject = file.Key;
        let promiseFile = s3.deleteObject({ Bucket: 'svoice', Key: keyObject }).promise();
        promiseAll.push(promiseFile);
    });

    return Promise.all(promiseAll).then(async(result) => {
        console.log('ok');
        const resultDeleteContest = await Contest.findByIdAndDelete(contestID, (err, deletedContest) => {
            if (err) return { ok: false, status: 500, errors: err };
            return { ok: true, contest: deletedContest };
        });
        console.log(resultDeleteContest);
        return resultDeleteContest;
    }).catch((err) => {
        console.log('not ok');
        return { ok: false, status: 500, errors: err };
    });

}

module.exports = {
    allContests,
    contestByID,
    newContest,
    updateContest,
    destroyContest
};