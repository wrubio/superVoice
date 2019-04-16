const express = require('express');
const CronJob = require('cron').CronJob;
const AWS = require('aws-sdk');
const request = require("request");
const fs = require("fs");
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const ffmpeg = require('fluent-ffmpeg');
const log4js = require('log4js');


// ffmpeg config
ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

// Load the SDK for JavaScript
AWS.config.loadFromPath(__dirname + '/config.json');

//Log de pruebas
log4js.configure({
    appenders: { cheese: { type: 'file', filename: './cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});

const logger = log4js.getLogger('cheese');

// URL del REST API
const urlDB = 'http://superVoiceC-2039393659.us-east-1.elb.amazonaws.com';


/**
 * Obtiene los registros de los audios pendientes por convertir
 */
function getVoices() {
    return new Promise((resolve, reject) => {
        request.get(`${urlDB}/registro`, (err, resp, body) => {
            if (err) reject(err);
            resolve(body);
        });
    })
}


/**
 * Actualiza los datos en los campos de estadoRegistroVoces y rutaArchivoConvertida 
 * @param {*} path 
 * @param {*} voice 
 */
function updateVoiceMail(path, voice) {
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
                reject({ ok: false, errors: err });
            } else {
                resolve({ ok: true, voice: body });
            }
        });
    });
}

/**
 * Envia correo al usuario dueno de la voz
 * @param {*} voice 
 */
function configMail(voice) {

    return new Promise((resolve, reject) => {

        let convertedPath = voice.rutaArchivoConvertida.split('/converted/');
        let nameContest = convertedPath[0].split('/').pop();

        // Create sendEmail params 
        let params = {
            Destination: {
                ToAddresses: [`${voice.correoLocutor}`, ]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<h1>superVoice</h1>
                        <br>
                        <p>Hola ${voice.nombresLocutor}, nos complace informarte, que tu voz subida en el concurso ${nameContest} ya esta <b>publicada</b><br>
                        puedes escuchar tu superVoces en el siguiente link:</p>
                        <a href="${urlDB}/#/contest/${voice.url}">Link al concurso ${nameContest}</a>
                        <br><br>
                        <p>Recuerda visitarnos seguidamente para que puedas mejorar tu voz con las que puedes ver en la página del concurso</p>
                        <br><br>
                        Atentamente,
                        <br><br>
                        Equipo de SuperVoice
                        `
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: "TEXT_FORMAT_BODY"
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Hello ✔ - Tu voz del concurso ya es lista'
                }
            },
            Source: 'supervoicescontest@gmail.com'
        };

        // Create the promise and SES service object
        var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

        // Handle promise's fulfilled/rejected states
        sendPromise.then((result) => {
            resolve({ ok: true, message: 'mail' });
        }).catch((err) => {
            reject({ ok: false, message: 'mail', errors: err });
        });

    });

}

/**
 * Transforma los audio subidos a .mp3
 * @param {*} audio 
 * @param {*} path 
 * @param {*} nameAudio 
 * @param {*} voice 
 * @param {*} url 
 */
async function convertAudio(audio, path, nameAudio, voice, url) {
    return new Promise((resolve, reject) => {

        const splitUrl = voice.rutaArchivoOriginal.split('/voices/');
        logger.fatal(`Inicio de la conversion del archivo, voice id: ${voice.id}`);

        ffmpeg(audio).toFormat('mp3')
            .on('error', (err) => {
                console.log('El archivo no se pudo convertir')
                reject({ ok: false });
            })
            .on('progress', (progress) => { console.log(`Processing: ${progress.targetSize} KB converted`); })
            .on('end', () => {
                logger.fatal(`Final de la conversion del archivo, voice id: ${voice.id}`);

                // Path para el PUT de actualizacion del audio
                const pathToUpdate = `${urlDB}/registro/${voice.id}`;
                const convertedUrl = `${splitUrl[0]}/converted/${nameAudio}.mp3`
                updateVoiceMail(pathToUpdate, {
                    estadoRegistroVoces: 'Generada',
                    rutaArchivoConvertida: convertedUrl,
                    mail: 1
                }).then((result) => {

                    configMail(voice).then((mailResult) => {
                        resolve(mailResult);
                    }).catch((err) => {
                        reject(err);
                    });

                }).catch((err) => {
                    reject({ ok: false, errors: err });
                });

            })
            .save(`${path}/${nameAudio}.mp3`);
    })
}


/**
 * Procesa cada una de las conversiones linealmente
 * @param {*} voiceToConvert 
 */
function processVoices(voiceToConvert) {
    return new Promise(async(resolve, reject) => {

        const promiseAllConvertAudio = [];

        for (let voice of voiceToConvert) {

            let pathDB = voice.rutaArchivoOriginal;
            let splitPathDB = pathDB.split('uploads');
            let newSplitPathDB = splitPathDB[1].split('voices');

            // Path donde se ecuentra el archivo a convertir
            let pathAudio = `./dist/uploads${splitPathDB[1]}`;

            //nombre del archivo a convertir
            let namedAudioExt = pathAudio.split(/(\\|\/)/g).pop();
            let nameAudio = namedAudioExt.split('.').slice(0, -1).join('.');

            // Crea el folder donde se guardaran los archivos coonvertiods
            let convertedFolder = `./dist/uploads${newSplitPathDB[0]}converted`;
            if (!fs.existsSync(convertedFolder)) fs.mkdirSync(convertedFolder);

            let promiseConvertAudio = convertAudio(pathAudio, convertedFolder, nameAudio, voice, splitPathDB[0]);

            promiseAllConvertAudio.push(promiseConvertAudio);

        }

        const resultPromiseConverAudioAll = await Promise.all(promiseAllConvertAudio).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });

    });
}

/**
 * Cron que se realiza cada 2 min
 */
new CronJob('*/30 * * * * *', async() => {

    const voiceToConvert = [];
    const promiseAllMail = [];

    const voices = await getVoices().then((result) => {
        return JSON.parse(result);
    }).catch((err) => {
        return err;
    });

    if (voices.length > 0) {

        for (let i = 0, vLength = voices.length; i < vLength; i++) {
            if (i < 5 && voices[i].mail === 0) {
                voiceToConvert.push(voices[i]);
            }
        }

        if (voiceToConvert.length > 0) {

            for (let v = 0, vtcLen = voiceToConvert.length; v < vtcLen; v++) {
                // Path para el PUT de actualizacion del audio
                let path = `${urlDB}/registro/${voiceToConvert[v].id}`;
                let promiseMail = updateVoiceMail(path, { mail: 2 });
                promiseAllMail.push(promiseMail);
            }

            let updateMailStatus = await Promise.all(promiseAllMail).then((result) => {

                processVoices(voiceToConvert).then((result) => {
                    console.log(result);
                }).catch((err) => {
                    console.log(err);
                });

            }).catch((err) => {
                console.log(err);
            });

        } else {
            console.log('No hay archivos a convertir');
        }

    } else {
        console.log('No hay archivos a convertir');
    }

}, null, true, 'America/Bogota');

module.exports = CronJob;