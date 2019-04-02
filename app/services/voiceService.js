var async = require('async');
const AWS = require('aws-sdk');
const Voice = require('../models/voice');

// Load your AWS credentials and try to instantiate the object.
AWS.config.loadFromPath(__dirname + '/config.json');

function allVoices(req) {
    return new Promise((resolve, reject) => {
        Voice.find({}).exec((err, voices) => {
            if (err) reject({ ok: false, status: 500, errors: err });
            resolve({ ok: true, voices: voices });
        });
    });
}

/**
 * Upload voice to S3 and save de new voice to database
 * @param {Object} params 
 * @param {Object} dataVoice 
 * @param {String} userID 
 */
function uploadVoice(params, dataVoice, userID) {
    return new Promise((resolve, reject) => {
        const s3 = new AWS.S3();
        s3.upload(params, function(err, data) {

            if (err) reject({ ok: false, status: 500, errors: err });

            const voiceLocation = data.Location.split('svoice.s3.amazonaws.com/').pop();

            const voice = new Voice({
                rutaArchivoOriginal: `https://d3n3owg4bn2vbl.cloudfront.net/${voiceLocation}`,
                rutaArchivoConvertida: dataVoice.rutaArchivoConvertida,
                estadoRegistroVoces: dataVoice.estadoRegistroVoces,
                nombresLocutor: dataVoice.nombresLocutor,
                apellidosLocutor: dataVoice.apellidosLocutor,
                correoLocutor: dataVoice.correoLocutor,
                observacionesLocutor: dataVoice.observacionesLocutor,
                adminId: userID,
                contestId: dataVoice.contestId,
                url: dataVoice.urlConcurso,
                mail: dataVoice.mail
            });

            voice.save((err, savedVoice) => {
                if (err) reject({ ok: false, status: 500, errors: err });
                resolve({ ok: true, voice: voice });
            })
        });
    });
}

module.exports = {
    allVoices,
    uploadVoice
}