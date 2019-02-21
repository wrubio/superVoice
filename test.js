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

const tableUpdate = require('./crons/update-voice');

const urlDB = 'http://localhost:3000';
const urlWeb = 'http://localhost:4200';

const log4js = require('log4js');

log4js.configure({
    appenders: { cheese: { type: 'file', filename: './cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
  });
  
  const logger = log4js.getLogger('cheese');
// logger.fatal('Cheese was breeding ground for listeria.');

/**
 * Procesa cada una de las conversiones linealmente
 * @param {*} voiceToConvert 
 */
async function processVoices(voiceToConvert) {
    for (let voice of voiceToConvert) {
        let  audio = `./dist/uploads/contests/2/test/voices/${voice}`;
        let audioName = voice.split('.');
        let startDate = new Date().getTime();
        logger.fatal('Inicio de la conversion del archivo');
        await ffmpeg(audio).toFormat('mp3')
            .on('error', (err) => {
                // console.log(err)
                //reject({ ok: false });
            })
            .on('progress', (progress) => { 
                // console.log(`Processing: ${progress.targetSize} KB converted`); 
            })
            .on('end', () => {
                let endDate = new Date().getTime();
                let resta = (endDate - startDate)/(1000*60);

                console.log(resta/(1000*60));
                logger.fatal('Final de la conversion del archivo' + resta);
                //resolve({ ok: true });
            })
            .save(`./dist/uploads/contests/2/test/converter/${audioName[0]}.mp3`);
    }
    console.log('Done!');
}
/**
 * Cron que se realiza cada 2 min
 */
new CronJob('*/60 * * * * *', () => {
    let oldFiles = [];
    fs.readdir(`./dist/uploads/contests/2/test/converter/`, (err, files) => {
        if (err) console.log(err);
        let lnSplitOld = files.length;
        let o = 0;
        for (o; o < lnSplitOld; o++) {
            let splitOld = files.splice('.');
            oldFiles.push(splitOld[0]);
        }
    });
    let fileToConver = [];
    fs.readdir('./dist/uploads/contests/2/test/voices/', (err, files) => {
        if (err) console.log(err);
        if (files.length > 0) {
            let lenFiles = files.length;
            let i = 0; 
            for (i; i < lenFiles; i++) {
                let splitNew = files[i].split('.');
                if (oldFiles.indexOf(splitNew[i]) < 0) {
                    fileToConver.push(files[i]);
                }
            }
            processVoices(fileToConver);
        } else {
            console.log('No ha audios para convertir');
        }
    });
}, null, true, 'America/Bogota');

module.exports = CronJob;