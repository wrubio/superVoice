const Voice = require('../models/voice');

function updateVoice(data) {
    return new Promise((resolve, reject) => {
        Voice.findById(data._id, (err, voiceFound) => {
            if (err) reject({ ok: false, status: 500, errors: err });
            if (!voiceFound) reject({ ok: false, status: 400, errors: err });

            voiceFound.rutaArchivoOriginal = data.rutaArchivoOriginal;
            voiceFound.rutaArchivoConvertida = data.rutaArchivoConvertida;
            voiceFound.estadoRegistroVoces = 'Generada';
            voiceFound.nombresLocutor = data.nombresLocutor;
            voiceFound.apellidosLocutor = data.apellidosLocutor;
            voiceFound.correoLocutor = data.correoLocutor;
            voiceFound.observacionesLocutor = data.observacionesLocutor;
            voiceFound.adminId = data.adminId;
            voiceFound.contestId = data.contestId;
            voiceFound.url = data.url;
            voiceFound.mail = data.mail;

            voiceFound.save((err, voiceSaved) => {
                if (err) reject({ ok: false, status: 500, errors: err });
                resolve({ ok: true, voice: voiceSaved });
            });
        })
    });
}

module.exports = {
    updateVoice
}