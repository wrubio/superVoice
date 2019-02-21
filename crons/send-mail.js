const CronJob = require('cron').CronJob;
const request = require("request");
var requestify = require('requestify');
const nodemailer = require('nodemailer');

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
function putVoices(path) {
    return new Promise((resolve, reject) => {
        request({
            method: 'PUT',
            url: path,
            body: { mail: 1 },
            json: true,
            headers: {
                'User-Agent': 'request'
            }
        }, (err, res, body) => {
            if (err) {
                console.log(err);
                reject({ ok: false, errors: err });
            } else {
                resolve({ ok: true });
            }
        });
    });
}

async function configPut(voiceToConvert) {
    for (let voice of voiceToConvert) {
        let path = `${urlDB}/registro/${voice.id}`;
        await putVoices(path);
    }
    console.log('Done PUT Mail = 1!');
}


const sMail = async(voice, nameContest) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'supervoicescontest@gmail.com',
            pass: 'superVoices2019$'
        }
    });

    let mailOptions = {
        from: '"SuperVoices 👻" <supervoicescontest@gmail.com>', // sender address
        to: voice.correoLocutor,
        subject: "Hello ✔ - Tu voz del concurso ya es lista",
        text: "Tu superVOice ya está lista!",
        html: `<h1>superVoice</h1>
        <br>
        <p>Hola ${voice.nombresLocutor}, nos complace informarte, que tu voz subida en el concurso ${nameContest} ya esta <b>publicada</b><br>
        puedes escuchar tu superVoces en el siguiente link:</p>
        <a href="${urlWeb}/#/contest/${voice.url}">Link al concurso ${nameContest}</a>
        <br><br>
        <p>Recuerda visitarnos seguidamente para que puedas mejorar tu voz con las que puedes ver en la página del concurso</p>
        <br><br>
        Atentamente,
        <br><br>
        Equipo de SuperVoice
        `
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            return err
        } else {
            return 'ok'
        }
    });
}


async function configMail(voiceToConvert) {
    for (let voice of voiceToConvert) {
        let convertedPath = voice.rutaArchivoConvertida.split('/converted/');
        let nameContest = convertedPath[0].split('/').pop();
        await sMail(voice, nameContest);
    }
    console.log('Done SEND Mail!');
    configPut(voiceToConvert);
}

// const sendMail = new CronJob('*/30 * * * * *', () => {
const startSendMails = function () {
    console.log('############################### start cron send mail #################################');
    getVoices().then(res => {
        const voices = JSON.parse(res);
        const lenVoices = voices.length;
        let i = 0;

        let voiceToConvert = [];
        for (i; i < lenVoices; i++) {
            if (voices[i].mail === 0) {
                voiceToConvert.push(voices[i]);
            }
        }

        if (voiceToConvert.length > 0) {
            console.log('Total correos sin enviar:' + voiceToConvert.length);
            configMail(voiceToConvert);
        } else {
            console.log('No hay coreos pendientes para enviar');
        }

    }).catch(err => {
        console.log(err);
    })
}
// }, null, true, 'America/Bogota');
module.exports = startSendMails;