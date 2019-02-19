const CronJob = require('cron').CronJob;
var requestify = require('requestify');
const request = require("request");

const urlDB = 'http://localhost:3000';
const urlWeb = 'http://localhost:4200';
/**
 * Obtiene los registros de los audios pendientes por convertir
 */
function getVoices() {
    return new Promise((resolve, reject) => {
        request.get(`${urlDB}/registro`, (err, resp, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    })
}
/**
 * Actualiza los datos en los campos de estadoRegistroVoces y rutaArchivoConvertida 
 * @param {*} path 
 * @param {*} voice 
 */
function putVoices(path, voice) {
    return new Promise((resolve, reject) => {
        request({
            method: 'PUT',
            url: path,
            body: voice,
            json: true,
            headers: {
                'User-Agent': 'request'
            }
        }, (err, res, body) => {
            if (err) {
                console.log(err);
                reject({ ok: false, errors: err });
            } else {
                console.log(body.id);
                resolve({ ok: true });
            }
        });
    });
}
/**
 * Funcion asincrona para el envio de correos
 * @param {*} voiceToConvert 
 */
async function configVoices(voiceToConvert) {
    for (let voice of voiceToConvert) {
        // configurando el nuevo path del mp3
        let splitOriginalPath = voice.rutaArchivoOriginal.split('voices/');
        let newNameAudio = splitOriginalPath[1].split('.').slice(0, -1).join('.') + '.mp3';
        let newAduioUrl = `${splitOriginalPath[0]}converted/${newNameAudio}`;
        // Path para el PUT de actualizacion del audio
        let path = `${urlDB}/registro/${voice.id}`;
        if (newAduioUrl) {
            console.log('EXISTE');
            await putVoices(path, { estadoRegistroVoces: 'Generada', rutaArchivoConvertida: newAduioUrl });
        } else {
            console.log('No EXISTE');
        }
    }
    console.log('Done PUT!');
}
/**
 * Cron que se ejecuta cada 2 minutos
 */
const updateVoice = new CronJob('*/120 * * * * *', () => {
    console.log('############################### start cron update #################################');
    getVoices().then(res => {
        const voices = JSON.parse(res);
        const lenVoices = voices.length;
        let i = 0;

        let voiceToConvert = [];
        for (i; i < lenVoices; i++) {
            if (voices[i].estadoRegistroVoces === 'original') {
                voiceToConvert.push(voices[i]);
            }
        }

        if (voiceToConvert.length > 0) {
            console.log('Total sin convertir:' + voiceToConvert.length);
            configVoices(voiceToConvert);
        } else {
            console.log('No hay registros para actualizar');
        }

    }).catch(err => {
        console.log(err);
    })
}, null, true, 'America/Bogota');

module.exports = updateVoice;