const mail = require('./sendMail');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const ffmpeg = require('fluent-ffmpeg');
const log4js = require('log4js');

const AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/config.json');

var fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

//Log de pruebas
log4js.configure({
    appenders: { cheese: { type: 'file', filename: `./log/${new Date().getTime()}.log` } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});

const logger = log4js.getLogger('cheese');
let logFilename = '';

fs.readdir('./log', function(err, files) {

    if (err) console.log('Unable to scan directory: ' + err);

    files.forEach(function(file) {
        logFilename = file;
    });

});

function ffmpegVoice(voice) {
    return new Promise((resolve, reject) => {

        const nameAudio = `${voice.adminId}-${new Date().getTime()}.mp3`;
        logger.fatal(`Inicio de la conversion del archivo, voice id: ${nameAudio}`);

        ffmpeg(voice.rutaArchivoOriginal).toFormat('mp3')
            .on('error', (err) => {
                console.log('El archivo no se pudo convertir')
                reject({ ok: false });
            })
            .on('progress', (progress) => { console.log(`Processing: ${progress.targetSize} KB converted`); })
            .on('end', () => {

                const savedVoice = `./temp/${nameAudio}`;
                logger.fatal(`Final de la conversion del archivo, voice id: ${nameAudio}`);

                fs.readFile(`./log/${logFilename}`, (err, file) => {

                    if (err) console.log('read log');

                    const logParam = {
                        Bucket: 'svoice',
                        Key: `logs/worker/${logFilename}`,
                        Body: file,
                    };

                    const logS3 = new AWS.S3();

                    logS3.upload(logParam, function(err, data) {
                        if (err) console.log('upload log');
                        console.log('file uploaded');
                    });

                });


                fs.readFile(savedVoice, (err, file) => {

                    if (err) reject({ ok: false, message: 'readFile' });

                    const params = {
                        Bucket: 'svoice',
                        Key: `${voice.adminId}/${voice.contestId}/convertedAudios/${nameAudio}`,
                        Body: file,
                        ACL: 'public-read'
                    };

                    const s3 = new AWS.S3();

                    s3.upload(params, function(err, data) {

                        if (err) reject({ ok: false, message: 'upload' });

                        fs.unlinkSync(savedVoice);

                        const voiceLocation = data.Location.split('svoice.s3.amazonaws.com/').pop();
                        voice.rutaArchivoConvertida = `https://d3n3owg4bn2vbl.cloudfront.net/${voiceLocation}`;

                        mail.sendMail(voice).then((result) => {
                            resolve(result);
                        }).catch((err) => {
                            reject(err);
                        });

                    });

                });

            })
            .save(`./temp/${nameAudio}`);
    });
}

module.exports = {
    ffmpegVoice
};