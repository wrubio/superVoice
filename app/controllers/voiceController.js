const voiceService = require('../services/voiceService');
const Voice = require('../models/voice');
// type of voice
const typeVoice = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];

function getAllVoice(req) {
    return new Promise((resolve, reject) => {
        voiceService.allVoices(req).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    });
}

/**
 * Create a voice database and upload voice to S3
 * @param {String} req 
 */
function loadVoice(req) {
    return new Promise((resolve, reject) => {

        if (!req.files) reject({ ok: false, status: 400, message: 'Audio data empty' });

        // get file ext
        const fileToUpload = req.files.audio;
        const fileExt = fileToUpload.name.split('.').pop();

        // validate file ext
        if (typeVoice.indexOf(fileExt.toLowerCase()) < 0) {
            return reject({
                ok: false,
                status: 400,
                message: `Las extenciones validas de imagenes son ${typeVoice.join(', ')}`
            })
        }

        const userID = req.query.userId;
        const contestID = req.query.contestId;
        const dataVoice = JSON.parse(req.query.voice);

        // Set new name to the file
        const newFileName = `${userID}-${new Date().getTime()}.${fileExt}`;
        const params = {
            Bucket: 'svoice',
            Key: `${userID}/${contestID}/originalAudios/${newFileName}`,
            Body: fileToUpload.data,
            ACL: 'public-read'
        };

        voiceService.uploadVoice(params, dataVoice, userID).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });

    });
}

module.exports = {
    getAllVoice,
    loadVoice
}