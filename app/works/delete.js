const mail = require('./sendMail');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const ffmpeg = require('fluent-ffmpeg');

const AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/config.json');

var fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

function ffmpegVoice(voice) {
    return new Promise((resolve, reject) => {
        const nameAudio = `${voice.adminId}-${new Date().getTime()}.mp3`;;
        ffmpeg(voice.rutaArchivoOriginal).toFormat('mp3')
            .on('error', (err) => {
                console.log('El archivo no se pudo convertir')
                reject({ ok: false });
            })
            .on('progress', (progress) => { console.log(`Processing: ${progress.targetSize} KB converted`); })
            .on('end', () => {

                const savedVoice = `./temp/${nameAudio}`;

                fs.readFile(savedVoice, (err, file) => {
                    if (err) reject({ ok: false, message: 'readFile' });
                    console.log(file);
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