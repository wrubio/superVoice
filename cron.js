const express = require('express');
const CronJob = require('cron').CronJob;
var requestify = require('requestify');
const nodemailer = require('nodemailer');

const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');

console.log(ffmpegStatic);

const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);



const request = require("request");
const fs = require("fs");

// init variables
let app = express();

const urlDB = 'http://localhost:3000';
const urlWeb = 'http://localhost:4200';
let voiceToConvert = [];

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
/*
let mailOptions = (id, voice) => {
    request.get(`${urlDB}/concurso/${id}`, (err, resp, body) => {
        if (err) {
            console.log(err);
        } else {
            let contest = JSON.parse(body);
                // mailOptions(voice, contest);
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: 'supervoicescontest@gmail.com', // generated ethereal user
                    pass: 'superVoices2019$' // generated ethereal password
                }
            });
            let mailOptions = {
                from: '"SuperVoices 👻" <supervoicescontest@gmail.com>', // sender address
                to: voice.correoLocutor,
                subject: "Hello ✔ - Tu voz del concurso ya es lista",
                text: "Tu superVOice ya está lista!",
                html: `<h1>superVoice</h1>
                <br>
                <p>Hola ${voice.nombresLocutor}, nos complace informarte, que tu voz subida en el concurso ${contest.nombreConcurso} ya esta <b>publicada</b><br>
                puedes escuchar tu superVoces en el siguiente link:</p>
                <a href="${urlWeb}/${contest.nombreURL}">Link al concurso ${contest.nombreConcurso}</a>
                <br><br>
                <p>Recuerda visitarnos seguidamente para que puedas mejorar tu voz con las que puedes ver en la página del concurso</p>
                <br><br>
                Atentamente,
                <br><br>
                Equipo de SuperVoice
                `
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(ok);
                }
            });

            // console.log("Message sent: %s", info.messageId);
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // return info;
        }
    })

}
*/
/**
 * Promese - Convierte los audios pendientes con ffmpeg
 * @param {*} audio 
 * @param {*} path 
 * @param {*} nameAudio 
 * @param {*} voice 
 * @param {*} url 
 */
async function convertAudio(audio, path, nameAudio, voice, url) {
    return new Promise((resolve, reject) => {

        ffmpeg(audio).toFormat('mp3')
            .on('error', (err) => {
                console.log('El archivo no se pudo convertir')
                reject({ ok: false });
            })
            .on('progress', (progress) => { console.log(`Processing: ${progress.targetSize} KB converted`); })
            .on('end', () => {
                console.log('El archivo se convirtio correctamente');
                resolve({ ok: true });
            })
            .save(`${path}/${nameAudio}.mp3`);
    })
}
/**
 * Procesa cada una de las conversiones linealmente
 * @param {*} voiceToConvert 
 */
async function processVoices(voiceToConvert) {

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

        await convertAudio(pathAudio, convertedFolder, nameAudio, voice, splitPathDB[0]);
        // console.log(convertedFolder + nameAudio);
    }
    console.log('Done!');
    putVoices();
}
/**
 * Cron que se realiza cada 50 segundos
 */
new CronJob('*/60 * * * * *', () => {
    console.log('You will see this message every 15 second');
    getVoices().then(res => {
        const voices = JSON.parse(res);
        const lenVoices = voices.length;
        let i = 0;

        for (i; i < lenVoices; i++) {
            if (voices[i].estadoRegistroVoces === 'original') {
                voiceToConvert.push(voices[i]);
            }
        }

        processVoices(voiceToConvert);
    }).catch(err => {
        console.log(err);
    })
}, null, true, 'America/Bogota');

async function putVoices() {
    for (let voice of voiceToConvert) {
        // configurando el nuevo path del mp3
        let splitOriginalPath = voice.rutaArchivoOriginal.split('voices/');
        let newNameAudio = splitOriginalPath[1].split('.').slice(0, -1).join('.') + '.mp3';
        let newAduioUrl = `${splitOriginalPath[0]}converted/${newNameAudio}`;

        // Asignando los nuevo valores al modelo de base de datos de los audios
        voice.rutaArchivoConvertida = newAduioUrl;
        voice.estadoRegistroVoces = 'Generada';

        // Path para el PUT de actualizacion del audio
        let path = `${urlDB}/registro/${voice.concursoId}`;
        await sendAudioData(path, voice);
    }
    console.log('Done PUT!');
}

async function sendAudioData(path, voice) {
    return new Promise((resolve, reject) => {
        requestify.put(path, voice).then(resp => {
            console.log(resp.body);
            resolve({ ok: true });
        }).catch(err => {
            reject({ ok: false, errors: err });
        })
    });
};

function getContest(id) {
    let algo = request.get(`${urlDB}/concurso/${id}`, (err, resp, body) => {
        if (err) {
            return console.log(err);
        } else {
            let contest = JSON.parse(body);
            voiceToConvert
            return contest;
            // mailOptions(voice, contest);
        }
    })
    return algo;
}
/*
// configurando el nuevo path del mp3
const splitOriginalPath = voice.rutaArchivoOriginal.split('voices');
// Asignando los nuevo valores al modelo de base de datos de los audios
voice.rutaArchivoConvertida = `${splitOriginalPath[0]}converted/${nameAudio}.mp3`;
voice.estadoRegistroVoces = 'Generada';
// Path para el PUT de actualizacion del audio
const path = `${urlDB}/registro/${voice.concursoId}`;
// Envia los cambios de la conversion con la nueva ruta

requestify.put(path, voice).then(resp => {
    resolve({ ok: true });
}).catch(err => {
    reject({ ok: false, errors: err });
})
*/

module.exports = CronJob;