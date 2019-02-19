const express = require('express');
const CronJob = require('cron').CronJob;

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
 * TRansforma los audio subidos a .mp3
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
    }
    console.log('Done!');
}
/**
 * Cron que se realiza cada 2 min
 */
new CronJob('*/120 * * * * *', () => {
    console.log('############################### start cron convert #################################')
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
            processVoices(voiceToConvert);
        } else {
            console.log('No hay archivos a convertir');
        }
    }).catch(err => {
        console.log(err);
    })
}, null, true, 'America/Bogota');

module.exports = CronJob;